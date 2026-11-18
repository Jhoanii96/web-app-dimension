using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Models
{
    public class OAuthServiceAttribute : Attribute, IAuthorizationFilter
    {
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            try
            {
                string UserPrincipalName = DecryptString(context.HttpContext.Request.Cookies["UserPrincipalName"]);
                string IdNumModule = DecryptString(context.HttpContext.Request.Cookies["IdNumModule"]);
                //string Surname = context.HttpContext.Request.Cookies["Surname"];
                string Id = DecryptString(context.HttpContext.Request.Cookies["Id"]);

                if (string.IsNullOrEmpty(UserPrincipalName) || string.IsNullOrEmpty(Id) || string.IsNullOrEmpty(IdNumModule))
                {
                    context.HttpContext.Response.Cookies.Append("IdNumModule", EncryptString("-1"));
                    context.Result = new RedirectToActionResult("Index", "Login", null);
                }
                else
                {
                    bool isAuthenticated = Convert.ToBoolean(DecryptString(context.HttpContext.Request.Cookies["IsAuthenticated"]));
                    //var ActualController = context.RouteData.Values["controller"].ToString();
                    if (!isAuthenticated)
                    {
                        //context.Result = new RedirectToActionResult("Index", ActualController, null);
                        context.Result = new RedirectToActionResult("Index", "Login", null);
                    }
                }

            }
            catch (Exception)
            {
                //context.Result = new RedirectToActionResult("Index", ActualController, null);
                context.Result = new RedirectToActionResult("Index", "Login", null);
            }

        }

    }
}
