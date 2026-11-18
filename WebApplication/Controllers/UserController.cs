using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
    public class UserController : Controller
    {
        static SqlConnection __Sql;

        public UserController()
        {
            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();
        }

        [OAuthService]
        public async Task<IActionResult> IndexAsync()
        {
            /*
            Guid workspaceId = new Guid("2339d02d-eb12-42d9-922a-f0ea3a53ca25");
            Guid reportId = new Guid("4c3bdbb5-19d7-422d-b5e2-a6d2d25e4752");

            var accesstoken = HttpContext.Request.Cookies["AccessToken"];
            var viewModel = await powerBiServiceApi.GetReport(workspaceId, reportId, accesstoken);
            */

            return View();
        }

        [OAuthService]
        public async Task<IActionResult> UserList()
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
                string query1 = $"SELECT * FROM [velkpi].[V_USER_INFO];";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["IdUser"] = EncryptString(tdata1.Rows[i]["IdUser"].ToString());
                }

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
        [OAuthService]
        public async Task<IActionResult> Edit(string id)
        {

            if (string.IsNullOrEmpty(id))
            {
                return Redirect($"{this.Request.Scheme}://{this.Request.Host}/User/UserList");
            }

            DataTable tdata1 = new DataTable();
            DataTable tdata2 = new DataTable();

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

                string iduser = DecryptString(Uri.UnescapeDataString(id));

                string query1 = $"SELECT * FROM [velkpi].[V_USER_INFO] WHERE [IdUser] = '{iduser}';";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                string query2 = $"SELECT * FROM [velkpi].[V_MODULE_LIST] WHERE [Status] = 1 ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = await command2.ExecuteReaderAsync();
                tdata2.Load(sqlData2);

                __Sql.Close();

                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["IdModule"] = EncryptString(tdata2.Rows[j]["IdModule"].ToString());
                }

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1,
                    CollectionB = tdata2
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

        [OAuthService]
        public async Task<IActionResult> AddUser()
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
                string query1 = $"SELECT * FROM [velkpi].[V_MODULE_LIST] WHERE [Status] = 1 ORDER BY [IdNum] ASC;";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["IdModule"] = EncryptString(tdata1.Rows[i]["IdModule"].ToString());
                }

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

        [HttpPost]
        public ActionResult SaveUser(SaveUserClass[] DataUser)
        {
            ErrorMessage error = new ErrorMessage();

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

                string IdUser = Guid.NewGuid().ToString();

                for (int i = 0; i < DataUser[0].user_module_permission.Length; i++)
                {
                    DataUser[0].user_module_permission[i] = DecryptString(Uri.UnescapeDataString(DataUser[0].user_module_permission[i]));
                }

                string my_query = $"EXECUTE [velkpi].[PRC_INSERT_CNF_USER] '{IdUser}', '{DataUser[0].user_email}', '{DataUser[0].user_firstname}', " +
                    $"'{DataUser[0].user_lastname}', {DataUser[0].user_showname}, '{string.Join(",", DataUser[0].user_module_permission)}'; ";

                SqlCommand command = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                command.ExecuteReader();

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

                __Sql.Close();

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
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

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }


        }

        [HttpPost]
        public ActionResult EditUser(EditUserClass[] DataUser)
        {
            ErrorMessage error = new ErrorMessage();

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

                string UserPrincipal = DecryptString(HttpContext.Request.Cookies["UserPrincipalName"]);
                string KeepLogin = HttpContext.Request.Cookies["KeepLogin"];
                bool MicrosoftRegistered = Convert.ToBoolean(DecryptString(HttpContext.Request.Cookies["MicrosoftRegistered"]));
                string showname_bool = (DataUser[0].user_showname == 1 ? "True" : "False");
                string iduser = DecryptString(Uri.UnescapeDataString(DataUser[0].user_a));
                string my_query;
                string usernummodule = string.Join(",", DataUser[0].user_num_module_permission);

                for (int i = 0; i < DataUser[0].user_module_permission.Length; i++)
                {
                    DataUser[0].user_module_permission[i] = DecryptString(Uri.UnescapeDataString(DataUser[0].user_module_permission[i]));
                }

                if (UserPrincipal.Equals(DataUser[0].user_email))
                {
                    my_query = $"EXECUTE [velkpi].[PRC_UPDATE_CNF_USER] '{iduser}', {DataUser[0].user_b}, '{DataUser[0].user_firstname}', " +
                        $"'{DataUser[0].user_lastname}', '{DataUser[0].user_email}', {DataUser[0].user_showname}, " +
                        $"1, '{string.Join(",", DataUser[0].user_module_permission)}'; ";
                }
                else
                {
                    my_query = $"EXECUTE [velkpi].[PRC_UPDATE_CNF_USER] '{iduser}', {DataUser[0].user_b}, '{DataUser[0].user_firstname}', " +
                        $"'{DataUser[0].user_lastname}', '{DataUser[0].user_email}', {DataUser[0].user_showname}, " +
                        $"{DataUser[0].user_userenabled}, '{string.Join(",", DataUser[0].user_module_permission)}'; ";
                }

                if (KeepLogin == "1")
                {
                    var cookies_option = new CookieOptions
                    {
                        Expires = DateTimeOffset.Now.AddYears(1)
                    };
                    if (MicrosoftRegistered)
                    {
                        if (UserPrincipal.Equals(DataUser[0].user_email))
                        {
                            HttpContext.Response.Cookies.Append("ShowName", EncryptString(showname_bool), cookies_option);
                            HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(usernummodule), cookies_option);
                        }
                    }
                    else
                    {
                        if (UserPrincipal.Equals(DataUser[0].user_email))
                        {
                            HttpContext.Response.Cookies.Append("FirstName", EncryptString(DataUser[0].user_firstname), cookies_option);
                            HttpContext.Response.Cookies.Append("LastName", EncryptString(DataUser[0].user_lastname), cookies_option);
                            HttpContext.Response.Cookies.Append("ShowName", EncryptString(showname_bool), cookies_option);
                            HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(usernummodule), cookies_option);
                        }
                    }
                }
                else
                {
                    if (MicrosoftRegistered)
                    {
                        if (UserPrincipal.Equals(DataUser[0].user_email))
                        {
                            HttpContext.Response.Cookies.Append("ShowName", EncryptString(showname_bool));
                            HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(usernummodule));
                        }
                    }
                    else
                    {
                        if (UserPrincipal.Equals(DataUser[0].user_email))
                        {
                            HttpContext.Response.Cookies.Append("FirstName", EncryptString(DataUser[0].user_firstname));
                            HttpContext.Response.Cookies.Append("LastName", EncryptString(DataUser[0].user_lastname));
                            HttpContext.Response.Cookies.Append("ShowName", EncryptString(showname_bool));
                            HttpContext.Response.Cookies.Append("IdNumModule", EncryptString(usernummodule));
                        }
                    }
                }

                SqlCommand command = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                command.ExecuteReader();

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

                __Sql.Close();

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
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

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }


        }

        [HttpPost]
        public ActionResult DeleteUser(string user_id, string user_email)
        {
            ErrorMessage error = new ErrorMessage();

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

                string iduser = DecryptString(Uri.UnescapeDataString(user_id));
                string my_query = $"EXECUTE [velkpi].[PRC_DELETE_CNF_USER] '{iduser}', '{user_email}'; ";

                SqlCommand command = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                command.ExecuteReader();

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

                __Sql.Close();

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
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

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }


        }

        [HttpPost]
        public ActionResult ResetUser(EditUserClass[] DataUser)
        {
            ErrorMessage error = new ErrorMessage();

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

                string iduser = DecryptString(Uri.UnescapeDataString(DataUser[0].user_a));
                string my_query = $"EXECUTE [velkpi].[PRC_RESET_PASSWORD_CNF_USER] '{iduser}', '{DataUser[0].user_email}', {DataUser[0].user_b}; ";

                SqlCommand command = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                command.ExecuteReader();

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

                __Sql.Close();

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
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

                var json = JsonConvert.SerializeObject(error,
                Formatting.None,
                new JsonSerializerSettings()
                {
                    ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                });

                return Json(json);

            }


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

        public class SaveUserClass
        {
            public string user_firstname { get; set; }
            public string user_lastname { get; set; }
            public string user_email { get; set; }
            public int user_showname { get; set; }
            public string[] user_module_permission { get; set; }
            public string[] user_num_module_permission { get; set; }
        }

        public class EditUserClass
        {
            public string user_a { get; set; } // IdUser
            public int user_b { get; set; }  // Microsoft User 
            public string user_firstname { get; set; }
            public string user_lastname { get; set; }
            public string user_email { get; set; }
            public int user_showname { get; set; }
            public int user_userenabled { get; set; }
            public string[] user_module_permission { get; set; }
            public string[] user_num_module_permission { get; set; }
        }


    }
}
