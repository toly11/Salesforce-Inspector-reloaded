# How to

## Use Sf Inspector with a connected app

---

If you enabled "API client whitelisting", Sf Inspector may not work anymore.
To secure the extension usage, you can use a auth flow to get an access token linked to a connected app.

1. Create a connected app.
2. Set permissions and callback url. (chrome-extension://chromeExtensionId/data-export.html?host=mysandboxHost&)

   > **Warning**
   > Don't forget to replace "chromeExtensionId" and "mysandboxHost" with you current extension id and org domain
   > <img alt="Connected App" src="https://github.com/tprouvot/Chrome-Salesforce-inspector/blob/master/docs/screenshots/connectedApp.png?raw=true" height="300">

3. Get Consumer Key and save it in the export page

   <img alt="Client Id" src="https://github.com/tprouvot/Chrome-Salesforce-inspector/blob/master/docs/screenshots/clientId.png?raw=true" height="300">

4. Refresh page and generate new token

   <img alt="Generate Token" src="https://github.com/tprouvot/Chrome-Salesforce-inspector/blob/master/docs/screenshots/generateAccessToken.png?raw=true" width="300">

## Migrate saved queries from legacy extension to Salesforce Inspector Reloaded

1. Open data export page on legacy extension
   <img alt="Inspect legacy" src="../assets/images/how-to/inspect-legacy.png?raw=true" height="300">
2. Get saved queries from "insextSavedQueryHistory" property
   <img alt="Inspect legacy" src="../assets/images/how-to/query-history.png?raw=true" height="300">
3. Open it in VS Code, you should have a JSON like this one:

   ```json
   [
     { "query": "select Id from Contact limit 10", "useToolingApi": false },
     { "query": "select Id from Account limit 10", "useToolingApi": false }
   ]
   ```

   From there you have two options

   Import the queries by adding a label for each one with the label in query property suffixed by ":"
   ie.

   ```json
   [
     {
       "query": "Contacts:select Id from Contact limit 10",
       "useToolingApi": false
     },
     {
       "query": "Accounts:select Id from Account limit 10",
       "useToolingApi": false
     }
   ]
   ```

Re-import this json in the new extension (with the same key "insextSavedQueryHistory")

## Define a CSV separator

Add a new property "csvSeparator" containing the needed separator for CSV files

   <img alt="Update csv separator" src="../assets/images/how-to/csv-separator.png?raw=true" height="300">
