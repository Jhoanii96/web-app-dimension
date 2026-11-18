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
    public class KPIController : Controller
    {

        static SqlConnection __Sql;

        public KPIController()
        {
            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();
        }

        // GET: KPIController
        [OAuthService]
        public async Task<ActionResult> IndexAsync()
        {
            DataTable tdata1 = new DataTable();
            DataTable tdata2 = new DataTable();
            DataTable tdata3 = new DataTable();

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
                string query1 = "SELECT * FROM [velkpi].[V_KPI_LIST] WHERE [Id] != -1 ORDER BY [IdNum] ASC;";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                string query2 = "SELECT * FROM [velkpi].[V_MEASUREMENT_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = await command2.ExecuteReaderAsync();
                tdata2.Load(sqlData2);

                string query3 = "SELECT * FROM [velkpi].[V_CATEGORY_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command3 = new SqlCommand(query3, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData3 = await command3.ExecuteReaderAsync();
                tdata3.Load(sqlData3);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                    tdata1.Rows[i]["IdCategory"] = EncryptString(tdata1.Rows[i]["IdCategory"].ToString());
                    tdata1.Rows[i]["IdMeasurement"] = EncryptString(tdata1.Rows[i]["IdMeasurement"].ToString());
                }
                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
                    tdata2.Rows[j]["IdUOM"] = EncryptString(tdata2.Rows[j]["IdUOM"].ToString());
                }
                for (int k = 0; k < tdata3.Rows.Count; k++)
                {
                    tdata3.Rows[k]["Id"] = EncryptString(tdata3.Rows[k]["Id"].ToString());
                }

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1,
                    CollectionB = tdata2,
                    CollectionC = tdata3
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
        public ActionResult SetNewKPIs(KPIObject[] NewKPI)
        {
            ErrorMessage error = new ErrorMessage();

            try
            {

                for (int i = 0; i < NewKPI.Length; i++)
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
                    string idmsr = DecryptString(Uri.UnescapeDataString(NewKPI[i].kpi_msr));
                    string idcat = DecryptString(Uri.UnescapeDataString(NewKPI[i].kpi_cat));
                    string data = $"EXECUTE [velkpi].[PRC_INSERT_KPI] {idcat}, '{NewKPI[i].kpi_agr.Replace("'", "''")}', {NewKPI[i].kpi_weig}, {idmsr}, {NewKPI[i].kpi_dec}; ";
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
        public ActionResult SaveChanges(KPIObject[] ChangeKPI)
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

                string idkpi = DecryptString(Uri.UnescapeDataString(ChangeKPI[0].kpi_id));
                string idmsr = DecryptString(Uri.UnescapeDataString(ChangeKPI[0].kpi_msr));
                string idcat = DecryptString(Uri.UnescapeDataString(ChangeKPI[0].kpi_cat));

                string my_query = $"EXECUTE [velkpi].[PRC_UPDATE_KPI] {idkpi}, {idcat}, " +
                    $"'{ChangeKPI[0].kpi_agr}', {ChangeKPI[0].kpi_weig}, {idmsr}, {ChangeKPI[0].kpi_dec};";

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
        public ActionResult DeleteKPI(string kpi_id)
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

                string idkpi = DecryptString(Uri.UnescapeDataString(kpi_id));
                string my_query = $"EXECUTE [velkpi].[PRC_DELETE_KPI] {idkpi}; ";

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
        public ActionResult RefreshTable(string filter_msr, string filter_cat)
        {
            DataTable tdata1 = new DataTable();
            DataTable tdata2 = new DataTable();
            DataTable tdata3 = new DataTable();

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

                string idmsr;
                string idcat;
                if (filter_msr != "All")
                {
                    idmsr = DecryptString(Uri.UnescapeDataString(filter_msr));
                }
                else
                {
                    idmsr = filter_msr;
                }
                if (filter_cat != "All")
                {
                    idcat = DecryptString(Uri.UnescapeDataString(filter_cat));
                }
                else
                {
                    idcat = filter_cat;
                }

                string query1;
                if (idmsr == "All" && idcat == "All")
                {
                    query1 = $"SELECT * FROM [velkpi].[V_KPI_LIST] WHERE [IdNum] != -1 ORDER BY [IdNum] ASC;";
                }
                else if (idmsr != "All" && idcat == "All")
                {
                    query1 = $"SELECT * FROM [velkpi].[V_KPI_LIST] WHERE [IdNum] != -1 AND [IdMeasurementNum] = '{idmsr}' ORDER BY [IdNum] ASC;";
                }
                else if (idmsr == "All" && idcat != "All")
                {
                    query1 = $"SELECT * FROM [velkpi].[V_KPI_LIST] WHERE [IdNum] != -1 AND [IdCategoryNum] = '{idcat}' ORDER BY [IdNum] ASC;";
                }
                else
                {
                    query1 = $"SELECT * FROM [velkpi].[V_KPI_LIST] WHERE [IdNum] != -1 AND [IdMeasurementNum] = '{idmsr}' AND [IdCategoryNum] = '{idcat}' ORDER BY [IdNum] ASC;";
                }

                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                string query2 = "SELECT * FROM [velkpi].[V_MEASUREMENT_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = command2.ExecuteReader();
                tdata2.Load(sqlData2);

                string query3 = "SELECT * FROM [velkpi].[V_CATEGORY_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command3 = new SqlCommand(query3, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData3 = command3.ExecuteReader();
                tdata3.Load(sqlData3);

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                    tdata1.Rows[i]["IdMeasurement"] = EncryptString(tdata1.Rows[i]["IdMeasurement"].ToString());
                    tdata1.Rows[i]["IdCategory"] = EncryptString(tdata1.Rows[i]["IdCategory"].ToString());
                }
                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
                }
                for (int k = 0; k < tdata3.Rows.Count; k++)
                {
                    tdata3.Rows[k]["Id"] = EncryptString(tdata3.Rows[k]["Id"].ToString());
                }

                __Sql.Close();

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1,
                    CollectionB = tdata2,
                    CollectionC = tdata3
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

        [HttpPost]
        public ActionResult RefreshList(string type)
        {
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

                string query1;
                string query2;

                if (type == "msr")
                {
                    query1 = "SELECT * FROM [velkpi].[V_MEASUREMENT_LIST] WHERE [IdNum] != -1 ORDER BY [IdNum] ASC;";
                    query2 = "SELECT * FROM [velkpi].[V_UOM_LIST] WHERE [IdNum] != -1 ORDER BY [IdNum] ASC;";
                }
                else if (type == "cat")
                {
                    query1 = "SELECT * FROM [velkpi].[V_CATEGORY_LIST] WHERE [IdNum] != -1 ORDER BY [IdNum] ASC;";
                    query2 = "";
                }
                else
                {
                    query1 = "";
                    query2 = "";
                }

                if (type == "msr")
                {
                    SqlCommand command1 = new SqlCommand(query1, __Sql)
                    {
                        CommandTimeout = 3600
                    };
                    var sqlData1 = command1.ExecuteReader();
                    tdata1.Load(sqlData1);

                    SqlCommand command2 = new SqlCommand(query2, __Sql)
                    {
                        CommandTimeout = 3600
                    };
                    var sqlData2 = command2.ExecuteReader();
                    tdata2.Load(sqlData2);

                    for (int i = 0; i < tdata1.Rows.Count; i++)
                    {
                        tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                    }
                    for (int j = 0; j < tdata2.Rows.Count; j++)
                    {
                        tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
                    }
                }
                else
                {
                    SqlCommand command1 = new SqlCommand(query1, __Sql)
                    {
                        CommandTimeout = 3600
                    };
                    var sqlData1 = command1.ExecuteReader();
                    tdata1.Load(sqlData1);

                    for (int i = 0; i < tdata1.Rows.Count; i++)
                    {
                        tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                    }
                }

                __Sql.Close();

                var model = new GroupIndexModel()
                {
                    CollectionA = tdata1,
                    CollectionB = tdata2
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
        
        public ActionResult SaveNewItem(LittleData[] data)
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

                string my_query;

                if (data[0].Type == "msr")
                {
                    string _iduom = DecryptString(Uri.UnescapeDataString(data[0].UOM));
                    my_query = $"EXECUTE [velkpi].[PRC_INSERT_CNF_MEASUREMENT] '{data[0].Name_En}', '{data[0].Name_Sp}', {_iduom}; ";
                }
                else
                {
                    my_query = $"EXECUTE [velkpi].[PRC_INSERT_CATEGORY] '{data[0].Name_Only}', '{data[0].FunctionalArea}', '{data[0].Process}', '{data[0].SubProcess}'; ";
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


        public ActionResult SaveChangesMsrCat(LittleData[] data)
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

                string my_query;
                string _id = DecryptString(Uri.UnescapeDataString(data[0].Id));

                if (data[0].Type == "msr")
                {
                    string _iduom = DecryptString(Uri.UnescapeDataString(data[0].UOM));
                    my_query = $"EXECUTE [velkpi].[PRC_UPDATE_CNF_MEASUREMENT] {_id}, '{data[0].Name_En}', '{data[0].Name_Sp}', {_iduom}; ";
                }
                else
                {
                    my_query = $"EXECUTE [velkpi].[PRC_UPDATE_CATEGORY] {_id}, '{data[0].Name_Only}', '{data[0].FunctionalArea}', '{data[0].Process}', '{data[0].SubProcess}'; ";
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
        public ActionResult DeleteMsrCat(string id, string type)
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

                string my_query;
                string _id = DecryptString(Uri.UnescapeDataString(id));

                if (type == "msr")
                {
                    my_query = $"EXECUTE [velkpi].[PRC_DELETE_CNF_MEASUREMENT] {_id}; ";
                }
                else
                {
                    my_query = $"EXECUTE [velkpi].[PRC_DELETE_CATEGORY] {_id}; ";
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

        public class KPIObject
        {
            public string kpi_id { get; set; }
            public string kpi_msr { get; set; }
            public string kpi_cat { get; set; }
            public string kpi_agr { get; set; }
            public int? kpi_weig { get; set; }
            public int? kpi_dec { get; set; }
        }

        public class LittleData
        {
            public string Id { get; set; }
            public string Name_En { get; set; }
            public string Name_Sp { get; set; }
            public string UOM { get; set; }
            public string Name_Only { get; set; }
            public string FunctionalArea { get; set; }
            public string Process { get; set; }
            public string SubProcess { get; set; }
            public string Type { get; set; }
        }

    }
}
