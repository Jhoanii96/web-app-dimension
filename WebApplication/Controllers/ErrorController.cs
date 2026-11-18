using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebApplication.Models;
using static WebApplication.Models.EncryptDecryptService;

namespace WebApplication.Controllers
{
    public class ErrorController : Controller
    {

        
        public ActionResult Index(string RequestId, int FileLineNumber, int FileColumnNumber, string Method, string FileName, string Message, string Class, string FullMessage, string StackTrace)
        {

            var model = new ErrorMessage()
            {
                _RequestId = RequestId, 
                _FileLineNumber = FileLineNumber,
                _FileColumnNumber = FileColumnNumber,
                _Method = Method,
                _FileName = FileName, 
                _Message = Message, 
                _Class = Class, 
                _FullMessage = FullMessage,
                _StackTrace = StackTrace 
            };

            return View(model);
        }
        /*
        [Route("Error")]
        [AllowAnonymous]
        public IActionResult Error()
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

            return View("Error", model);
        }
        */

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
