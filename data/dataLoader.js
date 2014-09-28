function dataLoader() {
  // Load a blank page and then inject the HTML to work around https://bugzilla.mozilla.org/show_bug.cgi?id=792479
  // An empty string as URL loads about:blank synchronously
  var popupWin;
  if (window.unsafeWindow && window.XPCNativeWrapper) {
    // Firefox
    // Use unsafeWindow to work around https://bugzilla.mozilla.org/show_bug.cgi?id=996069
    popupWin = new XPCNativeWrapper(unsafeWindow.open('', '', 'width=850,height=800'));
  } else {
    // Chrome
    popupWin = open('', '', 'width=850,height=800');
  }
  var document = popupWin.document;
  document.head.innerHTML = '\
  <title>Data Loader</title>\
  <style>\
  body {\
    font-family: Arial, Helvetica, sans-serif;\
    font-size: 11px;\
  }\
  textarea {\
    display:block;\
    width: 100%;\
    resize: vertical;\
  }\
  #query {\
    height: 4em;\
  }\
  #data {\
    height:10em;\
  }\
  </style>\
  ';

  document.body.innerHTML = '\
  <h1>Query</h1>\
  <textarea id="query">select Id from Account</textarea>\
  <button id="export-btn">Export</button>\
  <h1>Data</h1>\
  <input type=radio name="data-format" checked id="data-format-excel"> Excel\
  <input type=radio name="data-format"> CSV\
  <textarea id="data"></textarea>\
  ';
  function csvEncode(text) {
    return "\"" + text.replace("\"", "\"\"") + "\"";
  }
  document.querySelector("#export-btn").addEventListener("click", function() {
    document.querySelector("#export-btn").disabled = true;
    document.querySelector("#data").value = "Exporting...";
    var query = document.querySelector("#query").value;
    var separator = document.querySelector("#data-format-excel").checked ? "\t" : ",";
    var records = [];
    askSalesforce('/services/data/v31.0/query/?q=' + encodeURIComponent(query)).then(function queryHandler(responseText) {
      var data = JSON.parse(responseText);
      var text = "";
      records = records.concat(data.records);
      if (!data.done) {
        document.querySelector("#data").value = "Exporting... Completed " +records.length + " of " + data.totalSize + " records.";
        return askSalesforce(data.nextRecordsUrl).then(queryHandler);
      }
      if (records.length == 0) {
        text += "Zero records returned";
      } else {
        var header = records[0];
        var firstField = true;
        for (var field in header) {
          if (field == "attributes") {
            continue;
          }
          if (firstField) {
            firstField = false;
          } else {
            text += separator;
          }
          text += csvEncode(field);
        }
        text += "\r\n";
        for (var i = 0; i < records.length; i++) {
          var record = records[i];
          var firstField = true;
          for (var field in record) {
            if (field == "attributes") {
              continue;
            }
            if (firstField) {
              firstField = false;
            } else {
              text += separator;
            }
            text += csvEncode(record[field] || "");
          }
          text += "\r\n";
        }
      }
      return text;
    }, function(xhr) {
      if (!xhr || xhr.readyState != 4) {
        throw xhr; // Not an HTTP error response
      }
      var data = JSON.parse(xhr.responseText);
      var text = "=== ERROR ===\n";
      for (var i = 0; i < data.length; i++) {
        text += data[i].message + "\n";
      }
      return text;
    }).then( function(text) {
      document.querySelector("#data").value = text;
      document.querySelector("#export-btn").disabled = false;
    }, function(error) {
      document.querySelector("#data").value = "UNEXPECTED EXCEPTION:" + error;
      document.querySelector("#export-btn").disabled = false;
    });
  });
}