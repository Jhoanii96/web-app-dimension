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
    public class UomController : Controller
    {

        static SqlConnection __Sql;

        public UomController()
        {
            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();
        }

        // GET: UomController
        [OAuthService]
        public async Task<ActionResult> IndexAsync()
        {
            DataTable tdata1 = new DataTable();
            //DataTable tdata3 = new DataTable();
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

                string query1 = "SELECT * FROM [velkpi].[V_UOM_LIST] WHERE [IdNum] != -1 ORDER BY [IdNum] ASC;";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
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
        public ActionResult SetNewUoms(UomObject[] NewUom)
        {
            ErrorMessage error = new ErrorMessage();

            try
            {

                for (int i = 0; i < NewUom.Length; i++)
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
                    string data = $"EXECUTE [velkpi].[PRC_INSERT_UOM] '{NewUom[i].uomv_name_en}', '{NewUom[i].uomv_name_sp}', '{Uri.UnescapeDataString(NewUom[i].uomv_symbol)}'; ";
                    SqlCommand command = new SqlCommand(data, __Sql)
                    {
                        CommandTimeout = 3600
                    };
                    command.ExecuteReader();
                    __Sql.Close();

                }

                error.Error = false;
                error.Number = 1;
                error.Message = "The execution was seccessful!";

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
        public ActionResult SaveChanges(UomObject[] ChangeUom)
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

                string uomid = DecryptString(Uri.UnescapeDataString(ChangeUom[0].uomv_id));
                string my_query = $"EXECUTE [velkpi].[PRC_UPDATE_UOM] {uomid}, '{ChangeUom[0].uomv_name_en}', '{ChangeUom[0].uomv_name_sp}', '{Uri.UnescapeDataString(ChangeUom[0].uomv_symbol)}'; ";

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
        public ActionResult DeleteUom(string uomv_id)
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

                string uomid = DecryptString(Uri.UnescapeDataString(uomv_id));
                string my_query = $"EXECUTE [velkpi].[PRC_DELETE_UOM] {uomid}; ";

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
        public ActionResult RefreshTable()
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

                string query1 = "SELECT * FROM [velkpi].[V_UOM_LIST] WHERE [Id] != -1 ORDER BY [Id] ASC;";

                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                }

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1
                };

                var json = JsonConvert.SerializeObject(model,
                    Formatting.None,
                    new JsonSerializerSettings()
                    {
                        ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore
                    });

                return Json(json);
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

        public class ErrorMessage
        {
            public bool Error { get; set; }
            public int Number { get; set; }
            public string Message { get; set; }
        }

        public class UomObject
        {
            public string uomv_id { get; set; }
            public string uomv_name_en { get; set; }
            public string uomv_name_sp { get; set; }
            public string uomv_symbol { get; set; }
        }


    }
}
