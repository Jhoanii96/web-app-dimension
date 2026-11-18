using System;
using System.Diagnostics;
using System.Runtime.CompilerServices;

namespace WebApplication.Models
{
    public class ErrorInfo
    {
        public int FileLineNumber { get; set; }
        public int FileColumnNumber { get; set; }
        public string Method { get; set; }
        public string MethodFullName { get; set; }
        public string FileName { get; set; }
        public string Message { get; set; }
        public string Class { get; set; }
        public string FullMessage { get; set; }
        public string StackTrace { get; set; }

        public ErrorInfo(Exception exception)
        {
            StackTrace st = new StackTrace(exception, true);
            StackFrame stackFrame = st.GetFrame(st.FrameCount - 1);
            string error_details = string.Format("At line {0} column {1} in {2}: {3} {4}{3}{5}  ",
               stackFrame.GetFileLineNumber(), stackFrame.GetFileColumnNumber(),
               stackFrame.GetMethod(), Environment.NewLine, stackFrame.GetFileName(),
               exception.Message);

            if (stackFrame.GetFileLineNumber() == 0)
            {
                stackFrame = st.GetFrame(0);
                error_details = string.Format("At line {0} column {1} in {2}: {3} {4}{3}{5}  ",
                   stackFrame.GetFileLineNumber(), stackFrame.GetFileColumnNumber(),
                   stackFrame.GetMethod(), Environment.NewLine, stackFrame.GetFileName(),
                   exception.Message);

                this.FileLineNumber = stackFrame.GetFileLineNumber();
                this.FileColumnNumber = stackFrame.GetFileColumnNumber();
                this.Method = stackFrame.GetMethod().Name;
                this.MethodFullName = stackFrame.GetMethod().DeclaringType.FullName;
                this.FileName = stackFrame.GetFileName();
                this.Message = exception.Message;
                this.Class = stackFrame.GetMethod().DeclaringType.Name;
                this.FullMessage = error_details;
                this.StackTrace = exception.StackTrace;
            }
            else
            {
                this.FileLineNumber = stackFrame.GetFileLineNumber();
                this.FileColumnNumber = stackFrame.GetFileColumnNumber();
                this.Method = stackFrame.GetMethod().Name;
                this.MethodFullName = stackFrame.GetMethod().DeclaringType.FullName;
                this.FileName = stackFrame.GetFileName();
                this.Message = exception.Message;
                this.Class = stackFrame.GetMethod().DeclaringType.Name;
                this.FullMessage = error_details;
                this.StackTrace = exception.StackTrace;
            }
            
            // number = 0; // no need for this - the default is 0
        }

    }
}
