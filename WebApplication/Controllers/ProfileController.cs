using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.IO;
using System.Threading.Tasks;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Controllers
{
    //[Authorize]
    public class ProfileController : Controller
    {
        static SqlConnection __Sql;

        public ProfileController()
        {

            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();

        }

        [OAuthService]
        public async Task<IActionResult> IndexAsync()
        {
            DataTable tdata1 = new DataTable();
            DataTable tdata2 = new DataTable();
            try
            {
                string UserPrincipal = DecryptString(HttpContext.Request.Cookies["UserPrincipalName"]);

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
                string query1 = $"SELECT * FROM [velkpi].[V_USER_INFO] WHERE [UserPrincipalName] = '{UserPrincipal}';";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                string query2 = "SELECT * FROM [velkpi].[V_MODULE_LIST] WHERE [Status] = 1;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = await command2.ExecuteReaderAsync();
                tdata2.Load(sqlData2);

                __Sql.Close();

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

        [HttpPost]
        public IActionResult SaveChanges(int is_microsoft, string profile_name, string profile_lastname, int profile_showname, IFormFile profile_pic)
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
                string profile_showname_bool = (profile_showname == 1 ? "True" : "False");
                string my_query;
                string ImageName = string.Empty;

                if (profile_pic != null)
                {
                    //Set Key Name
                    ImageName = Guid.NewGuid().ToString() + Path.GetExtension(profile_pic.FileName);

                    //Get url To Save
                    string SavePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/images/avatars", ImageName);

                    using (var stream = new FileStream(SavePath, FileMode.Create))
                    {
                        profile_pic.CopyTo(stream);
                    }
                }

                my_query = $"EXECUTE [velkpi].[PRC_UPDATE_CNF_USER_PROFILE] {is_microsoft}, '{UserPrincipal}', '{profile_name}', '{profile_lastname}', " +
                    $"{profile_showname_bool}, '{ImageName}'; ";

                SqlCommand command = new SqlCommand(my_query, __Sql)
                {
                    CommandTimeout = 3600
                };
                command.ExecuteReader();

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

                if (profile_pic != null)
                {

                    if (is_microsoft == 1)
                    {
                        HttpContext.Response.Cookies.Append("PhotoPath", EncryptString(ImageName));
                        HttpContext.Response.Cookies.Append("ShowName", EncryptString(profile_showname_bool));
                    }
                    else
                    {
                        HttpContext.Response.Cookies.Append("PhotoPath", EncryptString(ImageName));
                        HttpContext.Response.Cookies.Append("ShowName", EncryptString(profile_showname_bool));
                        HttpContext.Response.Cookies.Append("FirstName", EncryptString(profile_name));
                        HttpContext.Response.Cookies.Append("LastName", EncryptString(profile_lastname));
                    }

                }
                else
                {
                    if (is_microsoft == 1)
                    {
                        HttpContext.Response.Cookies.Append("ShowName", EncryptString(profile_showname_bool));
                    }
                    else
                    {
                        HttpContext.Response.Cookies.Append("ShowName", EncryptString(profile_showname_bool));
                        HttpContext.Response.Cookies.Append("FirstName", EncryptString(profile_name));
                        HttpContext.Response.Cookies.Append("LastName", EncryptString(profile_lastname));
                    }
                }

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


    }
}
