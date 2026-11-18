using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;
using static WebApplication.Models.GlobalDataModel;

namespace WebApplication.Controllers
{
    public class LoginController : Controller
    {

        private readonly IConfiguration Configuration;
        static SqlConnection __Sql;
        private OAuth oauth = new OAuth();
        HttpClient httpClient = new HttpClient();

        public LoginController(ILogger<LoginController> logger, IConfiguration configuration)
        {
            Configuration = configuration;

            oauth.Authorization_Endpoint = Configuration["OAuth_Authorization_Endpoint"];
            oauth.Token_Endpoint = Configuration["OAuth_Token_Endpoint"];
            oauth.Client_Id = Configuration["OAuth_Client_Id"];
            oauth.Client_Secret = Configuration["OAuth_Client_Secret"];
            oauth.Redirect_Uri = Configuration["OAuth_Redirect_Uri"];
            oauth.Scope = Configuration["OAuth_Scope"];
            oauth.Api_Endpoint = Configuration["OAuth_Api_Endpoint"];

            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();

        }

        public IActionResult Index()
        {
            bool isAuthenticated = false;
            string UserPrincipalName = string.Empty;
            string IdNumModule = string.Empty;
            //string Surname = string.Empty;
            string Id = string.Empty;
            try
            {
                isAuthenticated = Convert.ToBoolean(DecryptString(HttpContext.Request.Cookies["IsAuthenticated"]));
                UserPrincipalName = DecryptString(HttpContext.Request.Cookies["UserPrincipalName"]);
                IdNumModule = DecryptString(HttpContext.Request.Cookies["IdNumModule"]);
                //Surname = HttpContext.Request.Cookies["Surname"];
                Id = DecryptString(HttpContext.Request.Cookies["Id"]);
            }
            catch (Exception)
            {

            }

            if (isAuthenticated == false || string.IsNullOrEmpty(UserPrincipalName) || string.IsNullOrEmpty(Id) || string.IsNullOrEmpty(IdNumModule))
            {
                return View();
            }
            else
            {
                return Redirect("/");
            }

        }

        public IActionResult SignIn()
        {

            string Authorization_Endpoint = oauth.Authorization_Endpoint;
            string Response_Type = "code";
            string Client_Id = oauth.Client_Id;
            string Redirect_Uri = oauth.Redirect_Uri;
            string Scope = oauth.Scope;
            const string State = "StateValue";

            string URL = $"{Authorization_Endpoint}?" +
                $"response_type={Response_Type}&" +
                $"client_id={Client_Id}&" +
                $"redirect_uri={Redirect_Uri}&" +
                $"scope={Scope}&state={State}";

            return Redirect(URL);

        }

        [HttpGet("/authentication/login-callback")]
        public IActionResult LoginCallback([FromQuery] string code, string state)
        {

            try
            {
                login_data islogged = new login_data
                {
                    code = code,
                    state = state,
                    IsAuthenticated = true
                };

                UserInformation user_information = new UserInformation();

                const string Grant_type = "authorization_code";

                string Token_Endpoint = oauth.Token_Endpoint;
                string Redirect_Uri = oauth.Redirect_Uri;
                string Client_Id = oauth.Client_Id;
                string Client_Secret = oauth.Client_Secret;
                string Scope = oauth.Scope;

                Dictionary<string, string> BodyData = new Dictionary<string, string>
                {
                    { "grant_type", Grant_type },
                    { "code", islogged.code },
                    { "redirect_uri", Redirect_Uri },
                    { "client_id", Client_Id },
                    { "client_secret", Client_Secret },
                    { "scope", Scope }
                };

                var Body = new FormUrlEncodedContent(BodyData);
                var Response1 = Task.Run(async () => await httpClient.PostAsync(Token_Endpoint, Body)).Result;
                var Status = $"{(int)Response1.StatusCode} {Response1.ReasonPhrase}";
                var JsonContent = Task.Run(async () => await Response1.Content.ReadFromJsonAsync<JsonElement>()).Result;
                var token = System.Text.Json.JsonSerializer.Serialize(JsonContent,
                    new JsonSerializerOptions { WriteIndented = true });

                var AccessToken = JsonDocument.Parse(token).RootElement.GetProperty("access_token").GetString();
                HttpContext.Response.Cookies.Append("AccessTokenAdd", "Bearer " + AccessToken);
                string Api_Endpoint = oauth.Api_Endpoint;
                var HttpClient = new HttpClient();

                HttpClient.DefaultRequestHeaders.Authorization =
                    new AuthenticationHeaderValue("Bearer", AccessToken);

                var Response2 = Task.Run(async () => await HttpClient.GetAsync(Api_Endpoint)).Result;

                (string Status, string Content) Model;

                Model.Status = $"{(int)Response2.StatusCode} {Response2.ReasonPhrase}";

                if (Response2.IsSuccessStatusCode)
                {
                    var JsonElement = System.Text.Json.JsonSerializer.Deserialize<JsonElement>(Task.Run(async () => await Response2.Content.ReadAsStringAsync()).Result);

                    Model.Content = System.Text.Json.JsonSerializer.Serialize(JsonElement,
                        new JsonSerializerOptions
                        {
                            WriteIndented = true,
                            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
                        });
                }
                else
                {
                    Model.Content = Task.Run(async () => await Response2.Content.ReadAsStringAsync()).Result;
                }

                var user_deserializer = System.Text.Json.JsonSerializer.Deserialize<User_Information>(Model.Content);

                if (user_deserializer.odatacontext != null)
                {
                    user_information.odatacontext = user_deserializer.odatacontext;
                    HttpContext.Response.Cookies.Append("Odatacontext", EncryptString(user_deserializer.odatacontext.ToString()));
                }
                if (user_deserializer.displayName != null)
                {
                    user_information.displayName = user_deserializer.displayName;
                    HttpContext.Response.Cookies.Append("DisplayName", EncryptString(user_deserializer.displayName.ToString()));
                }
                if (user_deserializer.givenName != null)
                {
                    user_information.givenName = user_deserializer.givenName;
                    HttpContext.Response.Cookies.Append("GivenName", EncryptString(user_deserializer.givenName.ToString()));
                }
                if (user_deserializer.jobTitle != null)
                {
                    user_information.jobTitle = user_deserializer.jobTitle;
                    HttpContext.Response.Cookies.Append("JobTitle", EncryptString(user_deserializer.jobTitle.ToString()));
                }
                if (user_deserializer.surname != null)
                {
                    user_information.surname = user_deserializer.surname;
                    HttpContext.Response.Cookies.Append("Surname", EncryptString(user_deserializer.surname.ToString()));
                }
                if (user_deserializer.userPrincipalName != null)
                {
                    user_information.userPrincipalName = user_deserializer.userPrincipalName;
                    HttpContext.Response.Cookies.Append("UserPrincipalName", EncryptString(user_deserializer.userPrincipalName.ToString()));
                }
                if (user_deserializer.id != null)
                {
                    user_information.id = user_deserializer.id;
                    HttpContext.Response.Cookies.Append("Id", EncryptString(user_deserializer.id.ToString()));
                }

                if (Response2.IsSuccessStatusCode)
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

                    DataTable tdata1 = new DataTable();

                    string query = $"EXECUTE [velkpi].[PRC_INSERT_GET_MICROSOFT_USER] '{user_information.id}', '{user_information.userPrincipalName}', '{user_information.displayName}', '{user_information.surname}';";
                    SqlCommand cmd = new SqlCommand(query, __Sql)
                    {
                        CommandTimeout = 3600
                    };
                    // create data adapter
                    SqlDataAdapter da = new SqlDataAdapter(cmd);
                    // this will query your database and return the result to your datatable
                    da.Fill(tdata1);
                    if (__Sql != null && __Sql.State == ConnectionState.Open)
                    {
                        __Sql.Close();
                    }
                    da.Dispose();

                    HttpContext.Response.Cookies.Append("UserPrincipalName", EncryptString(tdata1.Rows[0]["UserPrincipalName"].ToString()));
                    HttpContext.Response.Cookies.Append("DisplayName", EncryptString(tdata1.Rows[0]["DisplayName"].ToString()));
                    HttpContext.Response.Cookies.Append("Surname", EncryptString(tdata1.Rows[0]["Surname"].ToString()));
                    HttpContext.Response.Cookies.Append("FirstName", EncryptString(tdata1.Rows[0]["DisplayName"].ToString()));
                    HttpContext.Response.Cookies.Append("LastName", EncryptString(tdata1.Rows[0]["Surname"].ToString()));
                    HttpContext.Response.Cookies.Append("DateCreated", EncryptString(tdata1.Rows[0]["DateCreated"].ToString()));
                    HttpContext.Response.Cookies.Append("PhotoPath", (string.IsNullOrEmpty(tdata1.Rows[0]["PhotoPath"].ToString()) ? EncryptString("normal.jpg") : EncryptString(tdata1.Rows[0]["PhotoPath"].ToString())));
                    HttpContext.Response.Cookies.Append("MicrosoftRegistered", EncryptString(tdata1.Rows[0]["MicrosoftRegistered"].ToString()));
                    HttpContext.Response.Cookies.Append("ShowName", EncryptString(tdata1.Rows[0]["ShowName"].ToString()));
                    HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(tdata1.Rows[0]["IdNumModule"].ToString()));
                    HttpContext.Response.Cookies.Append("IdCodModule", EncryptString(tdata1.Rows[0]["IdCodModule"].ToString()));
                    HttpContext.Response.Cookies.Append("ModuleName_EN", EncryptString(tdata1.Rows[0]["ModuleName_EN"].ToString()));
                    HttpContext.Response.Cookies.Append("ModuleName_ES", EncryptString(tdata1.Rows[0]["ModuleName_ES"].ToString()));

                    HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("true"));
                    return Redirect("/");

                }
                else
                {
                    HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("false"));
                    return Redirect("/Login");
                }

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

        public ActionResult SignOut()
        {

            //var client = new WebClient();
            //client.DownloadString("https://login.microsoftonline.com/common/oauth2/v2.0/logout");

            HttpContext.Response.Cookies.Delete("Id");
            HttpContext.Response.Cookies.Delete("UserPrincipalName");
            HttpContext.Response.Cookies.Delete("DisplayName");
            HttpContext.Response.Cookies.Delete("Surname");
            HttpContext.Response.Cookies.Delete("FirstName");
            HttpContext.Response.Cookies.Delete("LastName");
            HttpContext.Response.Cookies.Delete("DateCreated");
            HttpContext.Response.Cookies.Delete("PhotoPath");
            HttpContext.Response.Cookies.Delete("MicrosoftRegistered");
            HttpContext.Response.Cookies.Delete("ShowName");
            HttpContext.Response.Cookies.Delete("IdNumModule");
            HttpContext.Response.Cookies.Delete("ModuleName_EN");
            HttpContext.Response.Cookies.Delete("ModuleName_ES"); 

            HttpContext.Response.Cookies.Delete("IsAuthenticated");

            string appBaseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            return Redirect("https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=" + appBaseUrl);

        }

        [HttpPost]
        public ActionResult VerifyAccount(string acc)
        {
            ErrorMessage error = new ErrorMessage();
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

                string my_query = $"EXECUTE [velkpi].[PRC_VERIFY_USER] '{acc}'; ";

                SqlCommand command1 = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1
                };

                __Sql.Close();

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(model,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
            catch (System.Data.SqlClient.SqlException ex)
            {

                if (__Sql != null && __Sql.State == ConnectionState.Open)
                {
                    __Sql.Close();
                }

                error.Error = true;
                error.Number = ex.Number;
                error.Message = ex.Message;

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(error,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
        }

        [HttpPost]
        public ActionResult RegisterPasswordAccount(string acc, string pass)
        {
            ErrorMessage error = new ErrorMessage();
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

                string password_encrypted = EncryptString(pass);
                string my_query = $"EXECUTE [velkpi].[PRC_REGISTER_NEW_PASSWORD] '{acc}', '{password_encrypted}'; ";

                SqlCommand command1 = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1
                };

                __Sql.Close();

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(model,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
            catch (System.Data.SqlClient.SqlException ex)
            {

                if (__Sql != null && __Sql.State == ConnectionState.Open)
                {
                    __Sql.Close();
                }

                error.Error = true;
                error.Number = ex.Number;
                error.Message = ex.Message;

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(error,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
        }

        [HttpPost]
        public ActionResult LoginAcount(string acc, string pass, string keep)
        {
            ErrorMessage error = new ErrorMessage();
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

                string password_encrypted = EncryptString(pass);
                string my_query = $"EXECUTE [velkpi].[PRC_LOGIN_ACCOUNT_USER] '{acc}', '{password_encrypted}'; ";

                SqlCommand command1 = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1
                };

                __Sql.Close();

                if (keep == "1")
                {
                    var cookies_option = new CookieOptions
                    {
                        Expires = DateTimeOffset.Now.AddYears(1)
                    };
                    HttpContext.Response.Cookies.Append("Id", EncryptString(tdata1.Rows[0]["IdUser"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("UserPrincipalName", EncryptString(tdata1.Rows[0]["UserPrincipalName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("DisplayName", EncryptString(tdata1.Rows[0]["FirstName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("Surname", EncryptString(tdata1.Rows[0]["LastName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("FirstName", EncryptString(tdata1.Rows[0]["FirstName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("LastName", EncryptString(tdata1.Rows[0]["LastName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("DateCreated", EncryptString(tdata1.Rows[0]["DateCreated"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("PhotoPath", (string.IsNullOrEmpty(tdata1.Rows[0]["PhotoPath"].ToString()) ? EncryptString("normal.jpg") : EncryptString(tdata1.Rows[0]["PhotoPath"].ToString())));
                    HttpContext.Response.Cookies.Append("MicrosoftRegistered", EncryptString(tdata1.Rows[0]["MicrosoftRegistered"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("ShowName", EncryptString(tdata1.Rows[0]["ShowName"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(tdata1.Rows[0]["IdNumModule"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("ModuleName_EN", EncryptString(tdata1.Rows[0]["ModuleName_EN"].ToString()), cookies_option);
                    HttpContext.Response.Cookies.Append("ModuleName_ES", EncryptString(tdata1.Rows[0]["ModuleName_ES"].ToString()), cookies_option); 
                    HttpContext.Response.Cookies.Append("KeepLogin", EncryptString("1"), cookies_option);

                    HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("true"), cookies_option);
                }
                else
                {
                    HttpContext.Response.Cookies.Append("Id", EncryptString(tdata1.Rows[0]["IdUser"].ToString()));
                    HttpContext.Response.Cookies.Append("UserPrincipalName", EncryptString(tdata1.Rows[0]["UserPrincipalName"].ToString()));
                    HttpContext.Response.Cookies.Append("DisplayName", EncryptString(tdata1.Rows[0]["FirstName"].ToString()));
                    HttpContext.Response.Cookies.Append("Surname", EncryptString(tdata1.Rows[0]["LastName"].ToString()));
                    HttpContext.Response.Cookies.Append("FirstName", EncryptString(tdata1.Rows[0]["FirstName"].ToString()));
                    HttpContext.Response.Cookies.Append("LastName", EncryptString(tdata1.Rows[0]["LastName"].ToString()));
                    HttpContext.Response.Cookies.Append("DateCreated", EncryptString(tdata1.Rows[0]["DateCreated"].ToString()));
                    HttpContext.Response.Cookies.Append("PhotoPath", (string.IsNullOrEmpty(tdata1.Rows[0]["PhotoPath"].ToString()) ? EncryptString("normal.jpg") : EncryptString(tdata1.Rows[0]["PhotoPath"].ToString())));
                    HttpContext.Response.Cookies.Append("MicrosoftRegistered", EncryptString(tdata1.Rows[0]["MicrosoftRegistered"].ToString()));
                    HttpContext.Response.Cookies.Append("ShowName", EncryptString(tdata1.Rows[0]["ShowName"].ToString()));
                    HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(tdata1.Rows[0]["IdNumModule"].ToString()));
                    HttpContext.Response.Cookies.Append("ModuleName_EN", EncryptString(tdata1.Rows[0]["ModuleName_EN"].ToString()));
                    HttpContext.Response.Cookies.Append("ModuleName_ES", EncryptString(tdata1.Rows[0]["ModuleName_ES"].ToString())); 
                    HttpContext.Response.Cookies.Append("KeepLogin", EncryptString("0"));

                    HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("true"));
                }

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(model,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
            catch (System.Data.SqlClient.SqlException ex)
            {

                if (__Sql != null && __Sql.State == ConnectionState.Open)
                {
                    __Sql.Close();
                }

                error.Error = true;
                error.Number = ex.Number;
                error.Message = ex.Message;

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(error,
                Newtonsoft.Json.Formatting.None,
                new Newtonsoft.Json.JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }
        }

        public IActionResult SignOutAccount()
        {

            HttpContext.Response.Cookies.Delete("Id");
            HttpContext.Response.Cookies.Delete("UserPrincipalName");
            HttpContext.Response.Cookies.Delete("DisplayName");
            HttpContext.Response.Cookies.Delete("Surname");
            HttpContext.Response.Cookies.Delete("FirstName");
            HttpContext.Response.Cookies.Delete("LastName");
            HttpContext.Response.Cookies.Delete("DateCreated");
            HttpContext.Response.Cookies.Delete("PhotoPath");
            HttpContext.Response.Cookies.Delete("MicrosoftRegistered");
            HttpContext.Response.Cookies.Delete("ShowName");
            HttpContext.Response.Cookies.Delete("IdNumModule");
            HttpContext.Response.Cookies.Delete("ModuleName_EN");
            HttpContext.Response.Cookies.Delete("ModuleName_ES"); 

            HttpContext.Response.Cookies.Delete("IsAuthenticated");

            string appBaseUrl = $"{this.Request.Scheme}://{this.Request.Host}";

            return Redirect(appBaseUrl + "/Login");

        }

        public class OAuth
        {
            public string Authorization_Endpoint { get; set; }
            public string Token_Endpoint { get; set; }
            public string Client_Id { get; set; }
            public string Client_Secret { get; set; }
            public string Redirect_Uri { get; set; }
            public string Scope { get; set; }
            public string Api_Endpoint { get; set; }
        }

        public class User_Information
        {
            public string odatacontext { get; set; }
            public string displayName { get; set; }
            public string givenName { get; set; }
            public string jobTitle { get; set; }
            public string surname { get; set; }
            public string userPrincipalName { get; set; }
            public string id { get; set; }
        }

        public class GroupIndexModel
        {
            public DataTable CollectionA { get; set; }
            public DataTable CollectionB { get; set; }
            public DataTable CollectionC { get; set; }

        }

        public class ErrorMessage
        {
            public bool Error { get; set; }
            public int Number { get; set; }
            public string Message { get; set; }
        }

    }
}
