using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Threading.Tasks;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Controllers
{
    //[Authorize]
    public class HomeController : Controller
    {

        private readonly ILogger<HomeController> _logger;
        private static SqlConnection __Sql;
        private static IHttpContextAccessor _httpContextAccessor;
        private static LanguageService _languageService;

        public HomeController(ILogger<HomeController> logger, IHttpContextAccessor httpContextAccessor, [FromServices] LanguageService languageService)
        {
            _logger = logger;

            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();

            _httpContextAccessor = httpContextAccessor;
            _languageService = languageService;

        }

        [OAuthService]
        public async Task<IActionResult> IndexAsync()
        {
            DataTable tdata1 = new DataTable();
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

            try
            {
                string query1 = $"SELECT * FROM [velkpi].[V_REPORT_APPS_LIST] WHERE [IdModuleNum] = 1 AND [IdNum] = 1;";
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

        public IActionResult Privacy()
        {
            return View();
        }
        public IActionResult ChangeLanguage(string culture)
        {
            try
            {
                _httpContextAccessor.HttpContext.Response.Cookies.Append(CookieRequestCultureProvider.DefaultCookieName, CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(culture)),
                new CookieOptions() { Expires = DateTimeOffset.UtcNow.AddYears(1) });
                _languageService.culturename = culture;
                return Redirect(Request.Headers["Referer"].ToString());
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


        public class GroupIndexModel
        {
            public DataTable CollectionA { get; set; }
            public DataTable CollectionB { get; set; }
            public DataTable CollectionC { get; set; }
        }


    }
}
