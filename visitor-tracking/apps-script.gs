/**
 * VISITOR TRACKING — Google Apps Script
 * ──────────────────────────────────────
 * This script receives a POST from your portfolio page and logs the visit
 * into two Google Sheets tabs: "Recruiters" and "Non-Recruiters".
 *
 * COLUMNS: sno | date | time | timezone
 *
 * HOW TO DEPLOY  (takes ~5 minutes)
 * ──────────────────────────────────
 * 1. Open Google Sheets → create a new spreadsheet, name it "Portfolio Visitors"
 * 2. In the spreadsheet, go to  Extensions → Apps Script
 * 3. Delete any existing code and paste ALL of this file
 * 4. Save (Ctrl+S)
 * 5. Click  Deploy → New deployment
 *      Type:      Web app
 *      Execute as: Me
 *      Who has access: Anyone
 * 6. Click Deploy → Authorize when prompted
 * 7. Copy the Web app URL (looks like https://script.google.com/macros/s/AKfy.../exec)
 * 8. Open  assets/js/main.js  in your portfolio and paste that URL into:
 *         var SCRIPT_URL = "PASTE_HERE";
 * 9. Commit & push — done!
 *
 * NOTE: Each time you change this script you must create a NEW deployment
 *       (Deploy → New deployment) or the old version will keep running.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Helper — get or create a sheet tab with the right headers
// ─────────────────────────────────────────────────────────────────────────────
function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(["sno", "date", "time", "timezone"]);

    // Style the header row
    var headerRange = sheet.getRange(1, 1, 1, 4);
    headerRange.setFontWeight("bold");
    headerRange.setBackground("#1a1a2e");
    headerRange.setFontColor("#ffffff");
    sheet.setFrozenRows(1);

    // Column widths
    sheet.setColumnWidth(1, 60);   // sno
    sheet.setColumnWidth(2, 110);  // date
    sheet.setColumnWidth(3, 100);  // time
    sheet.setColumnWidth(4, 220);  // timezone
  }
  return sheet;
}

// ─────────────────────────────────────────────────────────────────────────────
// doPost — called by the portfolio's fetch()
// ─────────────────────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var type     = (e.parameter.type     || "unknown").toLowerCase();
    var date     = e.parameter.date     || "";
    var time     = e.parameter.time     || "";
    var timezone = e.parameter.timezone || "Unknown";

    var ss        = SpreadsheetApp.getActiveSpreadsheet();
    var sheetName = (type === "recruiter") ? "Recruiters" : "Non-Recruiters";
    var sheet     = getOrCreateSheet(ss, sheetName);

    // sno = number of existing data rows (excluding header)
    var sno = Math.max(sheet.getLastRow() - 1, 0) + 1;

    sheet.appendRow([sno, date, time, timezone]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: "ok", sno: sno }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// doGet — quick health check (open the web app URL in browser to test)
// ─────────────────────────────────────────────────────────────────────────────
function doGet() {
  var ss       = SpreadsheetApp.getActiveSpreadsheet();
  var rSheet   = ss.getSheetByName("Recruiters");
  var nrSheet  = ss.getSheetByName("Non-Recruiters");

  var rCount  = rSheet  ? Math.max(rSheet.getLastRow()  - 1, 0) : 0;
  var nrCount = nrSheet ? Math.max(nrSheet.getLastRow() - 1, 0) : 0;

  var html = HtmlService.createHtmlOutput(
    "<h2>Portfolio Visitor Tracker</h2>" +
    "<p><b>Recruiters:</b> " + rCount + "</p>" +
    "<p><b>Non-Recruiters:</b> " + nrCount + "</p>" +
    "<p><b>Total:</b> " + (rCount + nrCount) + "</p>"
  );
  return html;
}
