namespace WebApplication.Models
{
    public class GlobalDataModel
    {
        public class UserInformation
        {
            public string? odatacontext { get; set; }
            public string? displayName { get; set; }
            public string? givenName { get; set; }
            public string? jobTitle { get; set; }
            public string? surname { get; set; }
            public string? userPrincipalName { get; set; }
            public string? id { get; set; }
        }
        public class login_data
        {
            [System.ComponentModel.DefaultValue(null)]
            public string code { get; set; }
            [System.ComponentModel.DefaultValue(null)]
            public string state { get; set; }
            [System.ComponentModel.DefaultValue(false)]
            public bool IsAuthenticated { get; set; }
        }
        public class OAuth
        {
            public string Authorization_Endpoint { get; set; }
            public string Token_Endpoint { get; set; }
            public string Client_Id { get; set; }
            public string Client_Secret { get; set; }
            public string Redirect_Uri { get; set; }
            public string Scope { get; set; }
            public string Api_Endpoint { get; set; }
        }
        /*
        public class UserView
        {
            public login_data _login_data { get; set; }
            public UserInformation _UserInformation { get; set; }
        }
        */
    }
}
