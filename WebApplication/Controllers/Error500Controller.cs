using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Controllers
{
    public class Error500Controller : Controller
    {
        [Route("Error500")]
        [AllowAnonymous]
        public ActionResult Index()
        {

            var exceptionDetails = HttpContext.Features.Get<IExceptionHandlerPathFeature>();

            ErrorInfo error = new ErrorInfo(exceptionDetails.Error);
            int _FileLineNumber = error.FileLineNumber;
            int _FileColumnNumber = error.FileColumnNumber;
            string _Method = error.Method;
            string _FileName = error.FileName;
            string _Message = error.Message;
            string _Class = error.Class;
            string _FullMessage = error.FullMessage;
            string _StackTrace = error.StackTrace;
            HttpContext.Response.Cookies.Append("IsAuthenticated", EncryptString("false"));

            var model = new ErrorMessage()
            {
                _RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier, 
                _FileLineNumber = _FileLineNumber,
                _FileColumnNumber = _FileColumnNumber,
                _Method = _Method,
                _FileName = _FileName, 
                _Message = _Message, 
                _Class = _Class, 
                _FullMessage = _FullMessage,
                _StackTrace = _StackTrace
            };

            return View("Error500", model);
        }


        public class ErrorMessage
        {
            public string _RequestId { get; set; }
            public int _FileLineNumber { get; set; }
            public int _FileColumnNumber { get; set; }
            public string _Method { get; set; }
            public string _FileName { get; set; }
            public string _Message { get; set; }
            public string _Class { get; set; }
            public string _FullMessage { get; set; }
            public string _StackTrace { get; set; }
        }


    }
}
