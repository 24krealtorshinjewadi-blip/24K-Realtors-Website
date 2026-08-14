/**
 * ═══════════════════════════════════════════════════════════════════════════
 * 24K REALTORS — AUTOMATED GOOGLE SHEETS LEAD CAPTURE SCRIPT
 * Spreadsheet: https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * ═══════════════════════════════════════════════════════════════════════════
 * 
 * 🛠️ HOW TO USE:
 * 
 * 1. Open your Google Sheet: 
 *    👉 https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit
 * 
 * 2. Click on top menu: "Extensions" (विस्तार) > "Apps Script".
 * 
 * 3. Delete existing text and paste THIS ENTIRE FILE.
 *    Click "Save" (💾 icon).
 * 
 * 4. TO INSERT 4 SAMPLE LEADS INSTANTLY:
 *    - Select function "addMultipleSampleLeads" in the top dropdown.
 *    - Click "Run" (▶️).
 *    - (If prompted: Click "Review Permissions" > "Advanced" > "Go to ... (unsafe)" > "Allow").
 *    - Open your Google Sheet to see 4 professionally formatted leads!
 * 
 * 5. TO CONNECT LIVE WITH WEBSITE:
 *    - Click "Deploy" > "New deployment".
 *    - Select Type: "Web app" (⚙️ icon).
 *    - Execute as: "Me", Who has access: "Anyone".
 *    - Click Deploy, Copy Web app URL, and paste it in your CRM Portal > "⚙️ Webhook URL".
 * ═══════════════════════════════════════════════════════════════════════════
 */

// Function to setup Golden headers with proper styling & column widths
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
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
    "Assigned RM",
    "Source",
    "Inquiry Notes & Details"
  ];
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  
  // Format header row styling: Gold background & Bold Dark Navy text
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#D4AF37");
  headerRange.setFontColor("#070F1E");
  headerRange.setFontWeight("bold");
  headerRange.setFontSize(10);
  headerRange.setFontFamily("Montserrat");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  
  sheet.setRowHeight(1, 36);
  sheet.setFrozenRows(1);
  
  // Set optimal column widths
  sheet.setColumnWidth(1, 150); // Timestamp
  sheet.setColumnWidth(2, 110); // Lead ID
  sheet.setColumnWidth(3, 170); // Name
  sheet.setColumnWidth(4, 140); // Phone
  sheet.setColumnWidth(5, 200); // Email
  sheet.setColumnWidth(6, 140); // Requirement
  sheet.setColumnWidth(7, 150); // Location
  sheet.setColumnWidth(8, 130); // Budget
  sheet.setColumnWidth(9, 110); // Status
  sheet.setColumnWidth(10, 130); // Assigned RM
  sheet.setColumnWidth(11, 140); // Source
  sheet.setColumnWidth(12, 300); // Notes
}

// 🧪 Function to add 4 realistic sample Pune real estate leads
function addMultipleSampleLeads() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  // Initialize headers
  setupHeaders();
  
  var sampleLeads = [
    [
      "2026-08-14 11:30:00",
      "LD-26081401",
      "Amit Deshmukh",
      "+91 98230 45678",
      "amit.deshmukh@tcs.com",
      "BUY_RESIDENTIAL",
      "Baner Corridor",
      "₹ 1.35 - 1.65 Cr",
      "QUALIFIED",
      "Jyoti Dhale",
      "Website Portal",
      "Interested in 3 BHK near High Street. Prefers higher floor with 2 covered parkings."
    ],
    [
      "2026-08-14 12:45:00",
      "LD-26081402",
      "Priya Nair",
      "+91 97654 32190",
      "priya.nair@infosys.com",
      "BUY_RESIDENTIAL",
      "Hinjewadi Phase 1",
      "₹ 75 - 95 L",
      "SITE_VISIT",
      "Rahul Joshi",
      "E-Brochure Download",
      "Downloaded Shapoorji Joyville brochure. Site visit scheduled for Saturday 4 PM."
    ],
    [
      "2026-08-14 14:15:00",
      "LD-26081403",
      "Vikramaditya Singhania",
      "+91 99887 76655",
      "vikram.singhania@corp.in",
      "BUY_LUXURY",
      "Wakad - Highway",
      "₹ 2.10 - 2.80 Cr",
      "NEGOTIATION",
      "Jyoti Dhale",
      "Direct WhatsApp",
      "Looking for 4 BHK Penthouse. Ready for token booking if floor plan matches."
    ],
    [
      "2026-08-14 16:00:00",
      "LD-26081404",
      "Dr. Sneha Kulkarni",
      "+91 91234 56780",
      "sneha.kulkarni@health.org",
      "INVESTMENT",
      "Kharadi Corridor",
      "₹ 85 L - 1.10 Cr",
      "NEW",
      "Pooja Patil",
      "Google Search Ads",
      "Looking for rental yield investment near EON IT Park. Needs RERA verification details."
    ]
  ];
  
  for (var i = 0; i < sampleLeads.length; i++) {
    sheet.appendRow(sampleLeads[i]);
  }
  
  // Format data rows
  var lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    var dataRange = sheet.getRange(2, 1, lastRow - 1, 12);
    dataRange.setFontFamily("Montserrat");
    dataRange.setFontSize(9);
    dataRange.setVerticalAlignment("middle");
  }
  
  Logger.log("✅ 4 realistic sample leads successfully added to Google Sheet!");
}

// 🧪 1-Click Single Test Function
function testAddSampleLead() {
  addMultipleSampleLeads();
}

// Webhook endpoint to catch live website leads
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
    var name = data.name || "Anonymous Visitor";
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
    var assignedRm = data.assignedAgentName || "Jyoti Dhale";
    var source = data.source || "Website Portal";
    var notes = data.notes || data.sub || "";
    
    // Append row to sheet
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
      assignedRm,
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
