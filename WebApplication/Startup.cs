using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Localization;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Options;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Net;
using System.Reflection;
using WebApplication.Models;

namespace WebApplication
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        internal static IConfiguration Configuration { get; private set; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //services.AddAuthentication(OpenIdConnectDefaults.AuthenticationScheme)
            //        .AddMicrosoftIdentityWebApp(
            //    options =>
            //    {
            //        Configuration.Bind("AzureAd", options);
            //        options.Events = new OpenIdConnectEvents();
            //    });

            //services.AddControllersWithViews(options =>
            //{
            //    var policy = new AuthorizationPolicyBuilder()
            //        .RequireAuthenticatedUser()
            //        .Build();
            //    options.Filters.Add(new AuthorizeFilter(policy));
            //});
            //services.AddRazorPages()
            //     .AddMicrosoftIdentityUI();

            services.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            
            services.AddSingleton<LanguageService>();
            //services.AddScoped<LanguageService>();

            services.AddLocalization(options => options.ResourcesPath = "Resources");

            services.AddMvc()
                .AddViewLocalization()
                .AddDataAnnotationsLocalization(options =>
                {
                    options.DataAnnotationLocalizerProvider = (type, factory) =>
                    {

                        var assemblyName = new AssemblyName(typeof(ShareResource).GetTypeInfo().Assembly.FullName);

                        return factory.Create("ShareResource", assemblyName.Name);

                    };

                });



            services.Configure<RequestLocalizationOptions>(
                options =>
                {
                    var supportedCultures = new List<CultureInfo>
                        {
                            //new CultureInfo("es-ES"),
                            new CultureInfo("en-US"),
                        };

                    options.DefaultRequestCulture = new RequestCulture(culture: "en-US", uiCulture: "en-US");

                    options.SupportedCultures = supportedCultures;
                    options.SupportedUICultures = supportedCultures;
                    options.RequestCultureProviders.Insert(0, new QueryStringRequestCultureProvider());

                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                
                app.UseExceptionHandler(errorApp =>
                {
                    errorApp.Run(async context =>
                    {
                        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                        context.Response.ContentType = "text/html";

                        await context.Response.WriteAsync("<html lang=\"en\">\r\n");
                        await context.Response.WriteAsync("<head>\r\n");
                        await context.Response.WriteAsync("<link rel=\"icon\" type=\"image/png\" href=\"/favicon.png\" />\r\n");
                        await context.Response.WriteAsync("<link href='https://fonts.googleapis.com/css?family=Poppins' rel='stylesheet'>\r\n");
                        await context.Response.WriteAsync("<link href=\"/css/main.css\" rel=\"stylesheet\">\r\n");
                        await context.Response.WriteAsync("</head>\r\n");
                        await context.Response.WriteAsync("<body style=\"padding: 20px;color: #343a40;text-align: center;\">\r\n");

                        var exceptionHandlerPathFeature =
                            context.Features.Get<IExceptionHandlerPathFeature>();

                        if (exceptionHandlerPathFeature?.Error is FileNotFoundException)
                        {
                            await context.Response.WriteAsync("File error thrown!<br><br>\r\n");
                        }
                        else
                        {
                            ErrorInfo error = new ErrorInfo(exceptionHandlerPathFeature.Error);
                            string RequestId = Activity.Current?.Id;
                            int _FileLineNumber = error.FileLineNumber;
                            int _FileColumnNumber = error.FileColumnNumber;
                            string _Method = error.Method;
                            string _MethodFullName = error.MethodFullName;
                            string _FileName = error.FileName;
                            string _Message = error.Message;
                            string _Class = error.Class;
                            string _FullMessage = error.FullMessage;
                            string _StackTrace = error.StackTrace;
                            await context.Response.WriteAsync("<div class=\"cover-container\"><div class=\"cover\" style=\"display: flex;\"><img src=\"/images/Logo Gointegrear v1.png\" style=\"margin: 20px 0; margin-left: auto;margin-right: auto;width: 150px;\"></div></div>");
                            await context.Response.WriteAsync("<h1 class=\"text-primary\">Error code " + context.Response.StatusCode + "</h1>");
                            if (context.Response.StatusCode == 500)
                            {
                                await context.Response.WriteAsync("<h2 class=\"text-primary\" style=\"font-size: 1.5rem;\">This page does not work<br>" + context.Request.Host + " cannot process this request at this time.</h2><br>");
                            }
                            else
                            {
                                await context.Response.WriteAsync("<h2 class=\"text-primary\" style=\"font-size: 1.5rem;\">An error occurred while processing your request.</h2><br>");
                            }
                            
                            if (!string.IsNullOrEmpty(RequestId))
                            {
                                await context.Response.WriteAsync("<p style=\"text-align: left;\"><strong>Request ID:</strong> <code>" + RequestId + "</code></p>");
                            }
                            await context.Response.WriteAsync("<p style=\"text-align: left;\">" + (string.Format("The method {0}: {1}", _MethodFullName, _Message)) + "</p>");
                            //await context.Response.WriteAsync("<p style=\"text-align: left;\">" + _FullMessage + "</p>");
                            await context.Response.WriteAsync("<p style=\"text-align: left;\">" + (string.Format("At line {0} column {1} in {2} ", _FileLineNumber, _FileColumnNumber, _Method)) + "<br><br>");
                            await context.Response.WriteAsync("<span id=\"more\" style=\"display: none;\">" + _StackTrace + "</span></p>");
                            await context.Response.WriteAsync("<p style=\"text-align: left;\"><button onclick=\"showFunction()\" id=\"showBtn\" style=\"border: 1px solid #3f6ad8;font-size: 12px;color: #3f6ad8;background-color: #b02c2c00;\">Show StackTrace</button></p><br>");
                            await context.Response.WriteAsync("<a href=\"/\">Home</a><br>\r\n");

                            await context.Response.WriteAsync("<script>" +
                                "function showFunction() { " +
                                    "var moreText = document.getElementById(\"more\"); " +
                                    "var btnText = document.getElementById(\"showBtn\");  " +
                                    "if (btnText.innerHTML === \"Hide\") { " +
                                        "btnText.innerHTML = \"Show StackTrace\";  " +
                                        "moreText.style.display = \"none\"; " +
                                    "} else { " +
                                        "btnText.innerHTML = \"Hide\";  " +
                                        "moreText.style.display = \"inline\"; " +
                                    "} " +
                                "} " +
                                "</script>");
                            await context.Response.WriteAsync("</body></html>\r\n");
                            await context.Response.WriteAsync(new string(' ', 512)); // IE padding
                        }
                        
                        
                    });
                });
                //app.UseStatusCodePages();
                app.UseHsts();
                
            }

            //app.UseDeveloperExceptionPage();

            var locOptions = app.ApplicationServices.GetService<IOptions<RequestLocalizationOptions>>();
            app.UseRequestLocalization(locOptions.Value);

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            //app.UseAuthentication();
            //app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });
        }
    }
}
