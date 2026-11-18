using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Threading;

namespace WebApplication.Controllers
{
    public class LanguageController : Controller
    {
        public IActionResult Index(string language)
        {
            if (!string.IsNullOrEmpty(language))
            {
                Thread.CurrentThread.CurrentCulture = CultureInfo.CreateSpecificCulture(language);
                Thread.CurrentThread.CurrentUICulture = new CultureInfo(language);
            }
            HttpContext.Response.Cookies.Append("Language", language);
            return View();
        }

        public IActionResult RegenerateResource()
        {
            return View();
        }
    }
}
