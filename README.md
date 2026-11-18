# WebAppDimension

WebAppDimension es una aplicación web ASP.NET Core que administra dimensiones operativas y vincula, autentica y muestra reportes de Microsoft Power BI. La interfaz consulta SQL Server para obtener los reportes configurados y los incorpora dentro de la aplicación para usuarios en inglés o español.

## Funcionalidades

- Inicio de sesión mediante Microsoft Entra ID/OAuth.
- Catálogo de reportes, módulos, escenarios, procesos, equipos, categorías y unidades de medida.
- Vinculación de reportes de Power BI mediante identificadores de workspace y reporte.
- Obtención de tokens de incrustación y visualización con el SDK JavaScript de Power BI.
- Administración de usuarios y preferencias de idioma.

## Reportes de Power BI

Los reportes se consultan desde SQL Server y deben incluir el identificador del workspace (`GroupId`) y el identificador del reporte (`ReportId`) para el idioma correspondiente. `Report/GetAccessToken` solicita a Microsoft un token de aplicación y genera la configuración de incrustación usada por [Report/Index.cshtml](WebApplication/Views/Report/Index.cshtml).
