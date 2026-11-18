using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
using Microsoft.PowerBI.Api;
using Microsoft.PowerBI.Api.Models;
using Microsoft.Rest;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Net.Http;
using System.Threading.Tasks;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Controllers
{
    public class ReportController : Controller
    {

        private readonly string _clientId;
        private readonly string _clientSecret;
        private readonly string _tenantId;

        private static PowerBIClient pbiClient = null;
        // Power BI Service API Root URL
        const string urlPowerBiRestApiRoot = "https://api.powerbi.com/";

        static SqlConnection __Sql;
        static TokenContent tokenContents = new TokenContent();

        public ReportController(IConfiguration configuration)
        {
            _clientId = configuration["PowerBI_Client_Id"];
            _clientSecret = configuration["PowerBI_Client_Secret"];
            _tenantId = configuration["PowerBI_Tenant_Id"];

            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();
        }

        //[HttpGet]
        [HttpGet("Report/{report_id}")]
        public IActionResult Index(string report_id)
        {
            DataTable tdata1 = new DataTable();
            try
            {
                bool loop_attempts = true;
                int num_attempts = 0;
                do
                {
                    try
                    {
                        if (__Sql != null && __Sql.State == ConnectionState.Closed)
                        {
                            __Sql.Open();
                        }

                        loop_attempts = false;
                        num_attempts = 3;
                    }
                    catch (Exception)
                    {
                        num_attempts += 1;
                        if (num_attempts == 3)
                        {
                            loop_attempts = false;
                        }
                    }

                } while (loop_attempts == false && num_attempts < 3);
                string query1 = $"SELECT * FROM [velkpi].[V_REPORT_APPS_LIST] WHERE [IdModule] = 2 AND [ReportCode] = '{report_id}';";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);


                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1
                };

                return View(model);
            }
            catch (Exception ex)
            {

                ErrorInfo error = new ErrorInfo(ex);
                int _FileLineNumber = error.FileLineNumber;
                int _FileColumnNumber = error.FileColumnNumber;
                string _Method = error.Method;
                string _FileName = error.FileName;
                string _Message = error.Message;
                string _Class = error.Class;
                string _FullMessage = error.FullMessage;
                string _StackTrace = error.StackTrace;
                HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("false"));
                return RedirectToAction("Index", "Error", new
                {
                    RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier,
                    FileLineNumber = _FileLineNumber,
                    FileColumnNumber = _FileColumnNumber,
                    Method = _Method,
                    FileName = _FileName,
                    Message = _Message,
                    Class = _Class,
                    FullMessage = _FullMessage,
                    StackTrace = _StackTrace
                });

            }

        }

        public ActionResult GetAccessToken(string workspaceId, string reportId)
        {
            EmbedInfo tokenn = Task.Run(async () => await GetEmbedInfo(new Guid(workspaceId), new Guid(reportId))).Result;

            var model = new GroupIndexModel()
            {
                AccessToken = tokenn
            };

            var json = JsonConvert.SerializeObject(model,
                Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

            return Json(json);
        }

        public async Task<EmbedInfo> GetEmbedInfo(Guid workspaceId, Guid reportId)
        {
            if (pbiClient != null)
            {
                if (DateTimeOffset.UtcNow > tokenContents.expiresOn)
                {
                    pbiClient = GetPowerBiClient();
                }
            }
            else
            {
                pbiClient = GetPowerBiClient();
            }

            var tokenResponse = await pbiClient.Reports.GenerateTokenInGroupAsync(workspaceId, reportId, new GenerateTokenRequest(accessLevel: "edit"));
            
            return new EmbedInfo
            {
                ReportId = reportId.ToString(),
                EmbedUrl = "https://app.powerbi.com/reportEmbed?reportId=" + reportId.ToString() + "&groupId=" + workspaceId.ToString(),
                AccessToken = tokenResponse.Token
            };

        }

        private PowerBIClient GetPowerBiClient()
        {
            var tokenCredentials = new TokenCredentials(GetAppOnlyAccessToken(), "Bearer");
            return new PowerBIClient(new Uri(urlPowerBiRestApiRoot), tokenCredentials);
        }

        private string GetAppOnlyAccessToken()
        {

            var tenantAuthority = $"https://login.microsoftonline.com/{_tenantId}";

            var appConfidential = ConfidentialClientApplicationBuilder
                .Create(_clientId)
                .WithClientSecret(_clientSecret)
                .WithAuthority(tenantAuthority)
                .Build();

            var scopesDefault = new string[] { "https://analysis.windows.net/powerbi/api/.default" };
            var authResult = appConfidential
                .AcquireTokenForClient(scopesDefault)
                .ExecuteAsync()
                .Result;

            tokenContents.accessToken = authResult.AccessToken;
            tokenContents.expiresOn = authResult.ExpiresOn;

            return authResult.AccessToken;

        }

        public class TokenContent
        {
            public string accessToken { get; set; }
            public DateTimeOffset expiresOn { get; set; }
        }

        public class EmbedInfo
        {
            public string ReportId { get; set; }
            public string EmbedUrl { get; set; }
            public string AccessToken { get; set; }
        }

        public class GroupIndexModel
        {
            public DataTable CollectionA { get; set; }
            public DataTable CollectionB { get; set; }
            public DataTable CollectionC { get; set; }
            public EmbedInfo AccessToken { get; set; }
        }


    }
}
