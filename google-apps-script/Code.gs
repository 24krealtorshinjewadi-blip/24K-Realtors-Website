/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 24K REALTORS — AUTOMATED GOOGLE SHEETS LEAD CAPTURE SCRIPT
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🛠️ HOW TO SETUP (FOLLOW THESE 4 STEPS):
 * 
 * 1. Open your Google Sheet: 
 *    👉 https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * 
 * 2. Click on top menu: "Extensions" (या "विस्तार") > "Apps Script".
 * 
 * 3. Delete any default code (like myFunction) and paste THIS ENTIRE FILE.
 *    Click "Save" (💾 icon).
 * 
 * 4. TO TEST DIRECTLY:
 *    - Select "testAddSampleLead" in the function dropdown at top.
 *    - Click "Run" (▶️ icon).
 *    - Click "Review Permissions" > Select your Google account.
 *    - Click "Advanced" (down below) > Click "Go to Untitled project (unsafe)".
 *    - Click "Allow".
 *    - Now check your Google Sheet — you will see headers and a sample lead!
 * 
 * 5. TO MAKE IT RECEIVE WEBSITE LEADS AUTOMATICALLY:
 *    - Click "Deploy" (blue button at top right) > "New deployment".
 *    - Click the Gear icon ⚙️ next to "Select type" > choose "Web app".
 *    - Description: 24K Realtors Leads
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (VERY IMPORTANT: must be Anyone)
 *    - Click "Deploy".
 *    - Copy the "Web app URL" (starts with https://script.google.com/macros/s/...).
 *    - Open your CRM Portal > click "⚙️ Webhook URL" > Paste the URL > Done!
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Function to initialize column headers
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

// 🧪 1-Click Test Function to verify your sheet works
function testAddSampleLead() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  setupHeaders();
  
  var now = Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
  var sampleLeadId = "LD-" + Utilities.formatDate(new Date(), "Asia/Kolkata", "yyMMddHHmmss");
  
  sheet.appendRow([
    now,
    sampleLeadId,
    "Rajesh Kumar (Test)",
    "+91 98765 43210",
    "rajesh.test@24krealtors.com",
    "BUY_RESIDENTIAL",
    "Hinjewadi Phase 1",
    "₹ 75 - 95 L",
    "NEW",
    "Website Verification Test",
    "Looking for 2 BHK luxury flat near IT Park"
  ]);
  
  Logger.log("✅ Sample lead successfully added to Google Sheet! Check your spreadsheet tab.");
}

// Webhook endpoint to catch real leads from website
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    setupHeaders();
    
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
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

// Health check endpoint
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "24K Realtors Google Sheet Webhook is live and ready to receive leads."
  })).setMimeType(ContentService.MimeType.JSON);
}
