# 24K Realtors — Google Sheets & Excel Lead Sync Guide

## 📌 Overview
Is guide ke zariye aapka **24K Realtors** portal aur backend **Google Sheets** (`https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit`) ke sath real-time me synchronize rehta hai. Isse company ke sare employees aur sales agents bina kisi rukawat ke live leads dekh aur manage kar sakte hain.

---

## ⚡ Setup in 3 Simple Steps (1 Minute Setup)

### Step 1: Open Google Sheets
1. Apne Google Sheet link par jaayein:  
   👉 [Open 24K Realtors Master Google Sheet](https://docs.google.com/spreadsheets/d/1Reu4yjYVHLY0DRgDN52dz9OP55wgGEWGDdPH_zvuQLM/edit?usp=sharing)
2. Menu me **Extensions** > **Apps Script** par click karein.

### Step 2: Paste Google Apps Script
1. Jo editor open hoga, usme existing code ko delete karein.
2. File [`google-apps-script/Code.gs`](file:///f:/24K%20Real%20Estate%20JAVA/google-apps-script/Code.gs) ka pura code copy karke paste karein.
3. Save icon (💾) par click karein.

### Step 3: Deploy as Web App
1. Top-right me **Deploy** > **New deployment** par click karein.
2. Select type: **Web app** (⚙️ icon).
3. Settings set karein:
   - **Execute as:** `Me` (Aapka Google Account)
   - **Who has access:** `Anyone`
4. **Deploy** button click karein aur permission grant karein.
5. Jo **Web app URL** milega (e.g. `https://script.google.com/macros/s/.../exec`), use copy karein.
6. Vercel dashboard me environment variable add karein:
   - Key: `VITE_GOOGLE_SHEET_WEBHOOK_URL`
   - Value: `<Your copied Web app URL>`

---

## 🛠️ Features Available in Employee CRM:

1. **📊 1-Click Master Sheet Access:**
   CRM header me direct "Master Google Sheet ↗" button hai, jisse agent bina email dhundhe seedhe live sheet open kar sakta hai.

2. **📥 1-Click Export to Excel:**
   Kisi bhi filter ke leads (New, Qualified, Hinjewadi, Wakad) ko 1 click me formatted `.csv` Excel file me download kar sakte hain.

3. **📤 Import Leads from CSV:**
   Agar kisi agent ke paas pehle se Excel me 100 leads hain, to wo "Import CSV" button par click karke copy-paste se database me bulk import kar sakta hai.

4. **🔄 Real-Time Sync DB:**
   Website se aane wali sari leads backend PostgreSQL database + Local Storage CRM + Google Sheets me parallel secure rehti hain.
