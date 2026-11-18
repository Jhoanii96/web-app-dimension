//using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace WebApplication.Models
{
    public class LanguageService
    {
        //private readonly IStringLocalizer _localizer;
        static SqlConnection __Sql;
        public DataTable tdata1;
        public List<LanguageList> rows = new List<LanguageList>();
        internal string culturename = string.Empty;

        //public LanguageService(IStringLocalizerFactory factory)
        public LanguageService(IHttpContextAccessor httpContextAccessor)
        {
            /*
            var type = typeof(ShareResource);
            var assemblyName = new AssemblyName(type.GetTypeInfo().Assembly.FullName);
            _localizer = factory.Create("SharedResource", assemblyName.Name);
            */

            if (httpContextAccessor.HttpContext.Request.Cookies[CookieRequestCultureProvider.DefaultCookieName] != null)
            {
                var cookievalue = httpContextAccessor.HttpContext.Request.Cookies[CookieRequestCultureProvider.DefaultCookieName];
                culturename = cookievalue.Split("|")[0].Replace("c=", "");
            }
            else
            {
                culturename = "en-US";
            }

            //throw new OutOfMemoryException();
            //throw new IndexOutOfRangeException();
            //throw new ArgumentNullException();
            //throw new Exception("this is a test");
            // object m = null;
            // string s = m.ToString();

            DataBaseConnection SqlClass = new DataBaseConnection();
            __Sql = SqlClass.getConnection();

            tdata1 = new DataTable();

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
            string query1 = $"SELECT [VariableName], [ValueName], [CultureName] FROM [velkpi].[V_SHARED_RESOURCES_LANGUAGES_LIST];";
            SqlCommand command1 = new SqlCommand(query1, __Sql)
            {
                CommandTimeout = 3600
            };
            var sqlData1 = command1.ExecuteReader();
            tdata1.Load(sqlData1);

            rows.Clear();
            rows = tdata1.AsEnumerable().Select(row => new LanguageList
            {
                VariableName = row.Field<string>("VariableName"),
                ValueName = row.Field<string>("ValueName"),
                CultureName = row.Field<string>("CultureName")
            }).ToList();

            //var rows2 = rows.

            /*
            MemoryStream ms = new MemoryStream();
            XmlWriterSettings xws = new XmlWriterSettings();
            xws.OmitXmlDeclaration = true;
            xws.Indent = true;

            using (XmlWriter xw = XmlWriter.Create(ms, xws))
            {
                XDocument doc = new XDocument(
                 new XElement("Tidrans",
                  new XElement("tidkod", "role"),
                  new XElement("datum", "date"),
                  new XElement("timmar", "hours")
                 )
                );
                doc.WriteTo(xw);
            }
            ms.Position = 0;
            */

        }

        //public LocalizedString Getkey(string key)
        //{
        //    return FindKey(key);
        //}

        public string Getkey(string key)
        {
            string value;
            if (rows.Count > 0)
            {
                if (rows.Any(item => item.VariableName == key && item.CultureName == culturename))
                {
                    value = rows.Find(item => item.VariableName == key && item.CultureName == culturename).ValueName;
                }
                else
                {
                    value = key;
                }
            }
            else
            {
                value = key;
            }
            return value;
        }

        public class LanguageList
        {
            public string VariableName { get; set; }
            public string ValueName { get; set; }
            public string CultureName { get; set; }
        }

    }

}
