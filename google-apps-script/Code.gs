/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 24K REALTORS — AUTOMATED GOOGLE SHEETS LEAD CAPTURE SCRIPT
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * HOW TO SETUP (1-MINUTE GUIDE):
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * 2. Click on "Extensions" > "Apps Script".
 * 3. Delete any code in the editor and paste THIS ENTIRE FILE.
 * 4. Click "Save" (💾).
 * 5. Click "Deploy" > "New deployment".
 * 6. Select type: "Web app".
 * 7. Configuration:
 *    - Description: "24K Realtors Lead Webhook"
 *    - Execute as: "Me" (your Google account)
 *    - Who has access: "Anyone"
 * 8. Click "Deploy" and Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 * 9. In your CRM or Vercel Environment Variables:
 *    Add VITE_GOOGLE_SHEET_WEBHOOK_URL = <Your Web app URL>
 * ═══════════════════════════════════════════════════════════════════════════
 */

function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  if (sheet.getLastRow() === 0) {
    var headers = [
      "Timestamp",
      "Lead ID",
      "Customer Name",
      "Phone Number",
      "Email Address",
      "Requirement Type",
      "Location Corridor",
      "Budget Range",
      "Status",
      "Source",
      "Inquiry Notes & Details"
    ];
    
    sheet.appendRow(headers);
    
    // Format header styling: Gold background & Bold text
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground("#D4AF37");
    headerRange.setFontColor("#070F1E");
    headerRange.setFontWeight("bold");
    headerRange.setFontFamily("Montserrat");
    headerRange.setHorizontalAlignment("center");
    
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeaders();
    
    var data = {};
    if (e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e.parameter) {
      data = e.parameter;
    }
    
    var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var leadId = data.id || "LD-" + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyMMddHHmmss");
    var name = data.name || "Anonymous";
    var phone = data.phone || "N/A";
    var email = data.email || "N/A";
    var reqType = data.requirementType || "BUY_RESIDENTIAL";
    var location = data.preferredLocation || data.location || "Hinjewadi";
    
    var budgetStr = "Flexible";
    if (data.budgetMin && data.budgetMax) {
      budgetStr = "₹ " + (data.budgetMin / 100000).toFixed(0) + " - " + (data.budgetMax / 100000).toFixed(0) + " L";
    } else if (data.budget) {
      budgetStr = data.budget;
    }
    
    var status = data.status || "NEW";
    var source = data.source || "Website Portal";
    var notes = data.notes || "";
    
    // Append row
    sheet.appendRow([
      now,
      leadId,
      name,
      phone,
      email,
      reqType,
      location,
      budgetStr,
      status,
      source,
      notes
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Lead successfully recorded in Google Sheets",
      leadId: leadId
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "24K Realtors Google Sheet Webhook is live and ready to receive leads."
  })).setMimeType(ContentService.MimeType.JSON);
}
