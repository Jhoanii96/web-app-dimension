# WebAppDimension

WebAppDimension es una aplicación web ASP.NET Core que administra dimensiones operativas y vincula, autentica y muestra reportes de Microsoft Power BI. La interfaz consulta SQL Server para obtener los reportes configurados y los incorpora dentro de la aplicación para usuarios en inglés o español.

## Funcionalidades

- Inicio de sesión mediante Microsoft Entra ID/OAuth.
- Catálogo de reportes, módulos, escenarios, procesos, equipos, categorías y unidades de medida.
- Vinculación de reportes de Power BI mediante identificadores de workspace y reporte.
- Obtención de tokens de incrustación y visualización con el SDK JavaScript de Power BI.
- Administración de usuarios y preferencias de idioma.

## Requisitos

- .NET SDK 5.0.
- Acceso a una base de datos SQL Server.
- Una aplicación registrada en Microsoft Entra ID con permisos OAuth y para la API de Power BI.
- Acceso al workspace y a los reportes configurados en Power BI.

## Configuración

Copie [appsettings.example.json](WebApplication/appsettings.example.json) a `WebApplication/appsettings.json` y complete los valores reales:

- `OAuth_Authorization_Endpoint` y `OAuth_Token_Endpoint`: endpoints de Microsoft Entra ID.
- `OAuth_Client_Id` y `OAuth_Client_Secret`: credenciales OAuth de la aplicación.
- `OAuth_Redirect_Uri`: URI de callback registrada para `/authentication/login-callback`.
- `PowerBI_Tenant_Id`, `PowerBI_Client_Id` y `PowerBI_Client_Secret`: credenciales usadas para obtener tokens de Power BI.
- `Database_Server_Name`, `Database_Catalog_Name`, `Database_User_Id` y `Database_Password`: conexión SQL Server.

No confirme secretos reales en Git. Para entornos locales use variables de entorno o User Secrets; para Azure configure los valores como variables de configuración de la aplicación.

Ejemplo de User Secrets:

```powershell
dotnet user-secrets set "PowerBI_Client_Secret" "<secret>" --project WebApplication
dotnet user-secrets set "Database_Password" "<password>" --project WebApplication
dotnet user-secrets set "OAuth_Client_Secret" "<secret>" --project WebApplication
```

## Compilación y ejecución

Desde la raíz del repositorio:

```powershell
dotnet restore WebApplicationDimension.sln
dotnet build WebApplicationDimension.sln
dotnet run --project WebApplication/WebApplication.csproj
```

La aplicación usa el puerto configurado en `WebApplication/Properties/launchSettings.json`. Use HTTPS y confirme que el callback OAuth coincide con `OAuth_Redirect_Uri`.

## Reportes de Power BI

Los reportes se consultan desde SQL Server y deben incluir el identificador del workspace (`GroupId`) y el identificador del reporte (`ReportId`) para el idioma correspondiente. `Report/GetAccessToken` solicita a Microsoft un token de aplicación y genera la configuración de incrustación usada por [Report/Index.cshtml](WebApplication/Views/Report/Index.cshtml).
