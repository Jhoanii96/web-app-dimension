using System;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication.Models
{

    public class DataBaseConnection
    {
        #region Variables
        readonly string connectionString = $"Server={Startup.Configuration["Database_Server_Name"]}; " +
            $"Initial Catalog={Startup.Configuration["Database_Catalog_Name"]}; " +
            $"User ID={Startup.Configuration["Database_User_Id"]}; " +
            $"Password={Startup.Configuration["Database_Password"]}; " +
            $"Connection Timeout=120;";
        private SqlConnection _sql;
        #endregion

        #region Constructor
        public DataBaseConnection()
        {
            //var connection_string = Startup.Configuration["Connection_Strings"];
            _sql = new SqlConnection(connectionString);
            using (var cmd = new SqlCommand())
            {
                cmd.CommandTimeout = 10;
            }
        }
        #endregion

        #region Class
        public SqlConnection getConnection()
        {
            return _sql;
        }

        public DataTable getReportList()
        {
            _sql = new SqlConnection(connectionString);
            DataTable tdata1 = new DataTable();

            bool loop_attempts = true;
            int num_attempts = 0;
            do
            {
                try
                {
                    if (_sql != null && _sql.State == ConnectionState.Closed)
                    {
                        _sql.Open();
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
            string query1 = "SELECT * FROM [velkpi].[V_REPORT_APPS_LIST] WHERE [IdModule] = 2;";
            SqlCommand command1 = new SqlCommand(query1, _sql)
            {
                CommandTimeout = 3600
            };
            var sqlData1 = command1.ExecuteReader();
            tdata1.Load(sqlData1);

            _sql.Close();

            return tdata1;
        }


        public DataTable getLanguageList()
        {
            _sql = new SqlConnection(connectionString);
            DataTable tdata1 = new DataTable();

            bool loop_attempts = true;
            int num_attempts = 0;
            do
            {
                try
                {
                    if (_sql != null && _sql.State == ConnectionState.Closed)
                    {
                        _sql.Open();
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
            string query1 = "SELECT [NativeName], [CultureName] FROM [velkpi].[V_LANGUAGES_LIST] WHERE [IsEnabled] = 1 ORDER BY [IdNum] ASC;";
            SqlCommand command1 = new SqlCommand(query1, _sql)
            {
                CommandTimeout = 3600
            };
            var sqlData1 = command1.ExecuteReader();
            tdata1.Load(sqlData1);

            _sql.Close();

            return tdata1;
        }

        #endregion

    }

}
