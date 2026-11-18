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
    public class KPIScenarioController : Controller
    {

        static SqlConnection __Sql;

        public KPIScenarioController()
        {
            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();
        }

        // GET: KPIScenarioController
        [OAuthService]
        public async Task<IActionResult> IndexAsync()
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
                string query1 = "SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] ORDER BY [IdKPINum], [IdScenarioNum], [IdSourceNum] ASC;";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = await command1.ExecuteReaderAsync();
                tdata1.Load(sqlData1);

                string query2 = "SELECT [IdNum], [Id], [CategoryName], ([CategoryName] + ': ' + [DescriptionEs]) AS [KPINameEs], ([CategoryName] + ': ' + [DescriptionEn]) AS [KPINameEn] FROM [velkpi].[V_KPI_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = await command2.ExecuteReaderAsync();
                tdata2.Load(sqlData2);

                string query3 = "SELECT * FROM [velkpi].[V_SOURCE_SYSTEM_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command3 = new SqlCommand(query3, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData3 = await command3.ExecuteReaderAsync();
                tdata3.Load(sqlData3);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["IdKPI"] = EncryptString(tdata1.Rows[i]["IdKPI"].ToString());
                    tdata1.Rows[i]["IdScenario"] = EncryptString(tdata1.Rows[i]["IdScenario"].ToString());
                    tdata1.Rows[i]["IdSource"] = EncryptString(tdata1.Rows[i]["IdSource"].ToString());
                }
                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
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
        public ActionResult SetNewKPIScenarios(KPIScenarioObject[] NewKPIScenario)
        {
            ErrorMessage error = new ErrorMessage();

            string my_query;

            try
            {

                for (int i = 0; i < NewKPIScenario.Length; i++)
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
                    string idkpi = DecryptString(Uri.UnescapeDataString(NewKPIScenario[i].kpisce_kpi));
                    string idsource = DecryptString(Uri.UnescapeDataString(NewKPIScenario[i].kpisce_source));
                    my_query = $"EXECUTE [velkpi].[PRC_INSERT_KPI_SCENARIO] {idkpi}, {idsource}, '{NewKPIScenario[i].kpisce_table_name}', " +
                        $"'{(NewKPIScenario[i].kpisce_column_name_date ?? "").Replace("'", "''")}', '{(NewKPIScenario[i].kpisce_column_name_shift ?? "").Replace("'", "''")}', '{(NewKPIScenario[i].kpisce_column_name_value ?? "").Replace("'", "''")}', " +
                        $"'{(NewKPIScenario[i].kpisce_filter_additional ?? "").Replace("'", "''")}', '{(NewKPIScenario[i].kpisce_parameters ?? "").Replace("'", "''")}';";

                    SqlCommand command = new SqlCommand(my_query, __Sql)
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
        public ActionResult SaveChanges(KPIScenarioObject[] ChangeKPIScenario)
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

                string idkpi = DecryptString(Uri.UnescapeDataString(ChangeKPIScenario[0].kpisce_kpi.ToString()));
                string idscenario = DecryptString(Uri.UnescapeDataString(ChangeKPIScenario[0].kpisce_id.ToString()));
                string idsource = DecryptString(Uri.UnescapeDataString(ChangeKPIScenario[0].kpisce_source.ToString()));

                string my_query = $"EXECUTE [velkpi].[PRC_UPDATE_KPI_SCENARIO] {idkpi}, {idscenario}, {idsource}, " +
                    $"'{ChangeKPIScenario[0].kpisce_table_name}', '{(ChangeKPIScenario[0].kpisce_column_name_date ?? "").Replace("'", "''")}', " +
                    $"'{(ChangeKPIScenario[0].kpisce_column_name_shift ?? "").Replace("'", "''")}', '{(ChangeKPIScenario[0].kpisce_column_name_value ?? "").Replace("'", "''")}', " +
                    $"'{(ChangeKPIScenario[0].kpisce_filter_additional ?? "").Replace("'", "''")}', '{(ChangeKPIScenario[0].kpisce_parameters ?? "").Replace("'", "''")}';  ";

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
        public ActionResult DeleteKPIScenario(string kpisce_kpi, string kpisce_id, string kpisce_source)
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

                string idkpi = DecryptString(Uri.UnescapeDataString(kpisce_kpi));
                string idscenario = DecryptString(Uri.UnescapeDataString(kpisce_id));
                string idsource = DecryptString(Uri.UnescapeDataString(kpisce_source));
                string my_query = $"EXECUTE [velkpi].[PRC_DELETE_KPI_SCENARIO] {idkpi}, {idscenario}, {idsource}; ";

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
        public ActionResult RefreshTable(string filter_kpi, string filter_source)
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

                string idkpi;
                string idsource;

                if (filter_kpi != "All")
                {
                    idkpi = DecryptString(Uri.UnescapeDataString(filter_kpi));
                }
                else
                {
                    idkpi = filter_kpi;
                }
                if (filter_source != "All")
                {
                    idsource = DecryptString(Uri.UnescapeDataString(filter_source));
                }
                else
                {
                    idsource = filter_source;
                }

                string query1;
                if (idkpi == "All" && idsource == "All")
                {
                    query1 = "SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] ORDER BY [IdKPINum] ASC;";
                }
                else if (idkpi != "All" && idsource == "All")
                {
                    query1 = "SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] WHERE [IdKPINum] = " + idkpi + " ORDER BY [IdKPINum] ASC;";
                }
                else if (idkpi == "All" && idsource != "All")
                {
                    query1 = "SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] WHERE [IdSourceNum] = " + idsource + " ORDER BY [IdKPINum] ASC;";
                }
                else
                {
                    query1 = "SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] WHERE [IdKPINum] = " + idkpi + " AND [IdSourceNum] = " + idsource + " ORDER BY [IdKPINum] ASC;";
                }

                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                string query2 = "SELECT [IdNum], [Id], [CategoryName], ([CategoryName] + ': ' + [DescriptionEs]) AS [KPINameEs], ([CategoryName] + ': ' + [DescriptionEn]) AS [KPINameEn] FROM [velkpi].[V_KPI_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = command2.ExecuteReader();
                tdata2.Load(sqlData2);

                string query3 = "SELECT * FROM [velkpi].[V_SOURCE_SYSTEM_LIST];";
                SqlCommand command3 = new SqlCommand(query3, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData3 = command3.ExecuteReader();
                tdata3.Load(sqlData3);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["IdKPI"] = EncryptString(tdata1.Rows[i]["IdKPI"].ToString());
                    tdata1.Rows[i]["IdScenario"] = EncryptString(tdata1.Rows[i]["IdScenario"].ToString());
                    tdata1.Rows[i]["IdSource"] = EncryptString(tdata1.Rows[i]["IdSource"].ToString());
                }
                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
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

            try
            {
                string query1;

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

                if (type == "source")
                {
                    query1 = "SELECT * FROM [velkpi].[V_SOURCE_SYSTEM_LIST] WHERE [Id] != -1;";
                }
                else
                {
                    query1 = "";
                }

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

        public ActionResult SaveNewItem(string source_name, string type)
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

                if (type == "source")
                {
                    my_query = $"EXECUTE [velkpi].[PRC_INSERT_SOURCE_SYSTEM] '{source_name}'; ";
                }
                else
                {
                    my_query = $"  ";
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


        public ActionResult SaveChangesSource(LittleData[] data)
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
                string idsource = DecryptString(Uri.UnescapeDataString(data[0].Id.ToString()));

                if (data[0].Type == "source")
                {
                    my_query = $"EXECUTE [velkpi].[PRC_UPDATE_SOURCE_SYSTEM] {idsource}, '{data[0].Name}'; ";
                }
                else
                {
                    my_query = $" ";
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
        public ActionResult DeleteSource(string id, string type)
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

                if (type == "source")
                {
                    my_query = $"EXECUTE [velkpi].[PRC_DELETE_SOURCE_SYSTEM] " + _id + "; ";
                }
                else
                {
                    my_query = $"  ";
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
        public ActionResult RefreshSelectKPIList()
        {
            DataTable tdata1 = new DataTable();
            DataTable tdata2 = new DataTable();

            try
            {
                string query1;
                string query2;

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

                query1 = "SELECT [Id], [CategoryName], [DescriptionEn], [DescriptionEs] FROM [velkpi].[V_KPI_LIST] WHERE [Id] != -1;";

                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                query2 = "SELECT * FROM [velkpi].[V_SOURCE_SYSTEM_LIST];";

                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = command2.ExecuteReader();
                tdata2.Load(sqlData2);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["Id"] = EncryptString(tdata1.Rows[i]["Id"].ToString());
                }

                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
                }

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

        [HttpPost]
        public ActionResult GetKPIScenarioInfo(string num1, string num2, string num3)
        {
            ErrorMessage error = new ErrorMessage();
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

                string _idkpi = DecryptString(Uri.UnescapeDataString(num1));
                string _idscenario = DecryptString(Uri.UnescapeDataString(num2));
                string _idsource = DecryptString(Uri.UnescapeDataString(num3));

                string query1 = $"SELECT * FROM [velkpi].[V_KPI_SCENARIO_LIST] WHERE [IdKPI] = {_idkpi} AND [IdScenario] = {_idscenario} AND [IdSource] = {_idsource};";
                SqlCommand command1 = new SqlCommand(query1, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData1 = command1.ExecuteReader();
                tdata1.Load(sqlData1);

                string query2 = "SELECT [IdNum], [Id], [CategoryName], ([CategoryName] + ': ' + [DescriptionEs]) AS [KPINameEs], ([CategoryName] + ': ' + [DescriptionEn]) AS [KPINameEn] FROM [velkpi].[V_KPI_LIST] ORDER BY [IdNum] ASC;";
                SqlCommand command2 = new SqlCommand(query2, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData2 = command2.ExecuteReader();
                tdata2.Load(sqlData2);

                string query3 = "SELECT * FROM [velkpi].[V_SOURCE_SYSTEM_LIST];";
                SqlCommand command3 = new SqlCommand(query3, __Sql)
                {
                    CommandTimeout = 3600
                };
                var sqlData3 = command3.ExecuteReader();
                tdata3.Load(sqlData3);

                __Sql.Close();

                for (int i = 0; i < tdata1.Rows.Count; i++)
                {
                    tdata1.Rows[i]["IdKPI"] = EncryptString(tdata1.Rows[i]["IdKPI"].ToString());
                    tdata1.Rows[i]["IdScenario"] = EncryptString(tdata1.Rows[i]["IdScenario"].ToString());
                    tdata1.Rows[i]["IdSource"] = EncryptString(tdata1.Rows[i]["IdSource"].ToString());
                }
                for (int j = 0; j < tdata2.Rows.Count; j++)
                {
                    tdata2.Rows[j]["Id"] = EncryptString(tdata2.Rows[j]["Id"].ToString());
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

                var json = JsonConvert.SerializeObject(model,
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

        public class KPIScenarioObject
        {
            public string kpisce_id { get; set; }
            public string kpisce_kpi { get; set; }
            public string kpisce_source { get; set; }
            public string kpisce_table_name { get; set; }
            public string kpisce_column_name_date { get; set; }
            public string kpisce_column_name_shift { get; set; }
            public string kpisce_column_name_value { get; set; }
            public string kpisce_filter_additional { get; set; }
            public string kpisce_parameters { get; set; }
        }

        public class LittleData
        {
            public string Id { get; set; }
            public string Name { get; set; }
            public string Type { get; set; }
        }

    }
}
