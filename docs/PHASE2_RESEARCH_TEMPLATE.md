# 24K Realtors — Phase 2: Property Research Template
## Hinjewadi Phase 1/2/3 & Mahalunge — Master Data Collection

**Instructions:**
- Sources ko follow karo: MahaRERA (Level 1) → Developer Website → Housing.com/99acres/MagicBricks
- RERA number EXACTLY copy karo — koi modification nahi
- Price ke saath date mandatory hai
- Agar verify nahi hua → "Not publicly verified" likhna

---

## RESEARCH SOURCES (Bookmark These)

| Source | URL | Purpose |
|---|---|---|
| **MahaRERA** | https://maharera.maharashtra.gov.in | RERA number, status, promoter, completion date |
| **Housing.com** | https://housing.com/in/buy/searches/hinjewadi-pune | Price, config, status |
| **99acres** | https://www.99acres.com/property-in-hinjewadi-pune | Price, current status |
| **MagicBricks** | https://www.magicbricks.com/property-for-sale/residential-real-estate?proptype=Multistorey-Apartment&cityName=Pune&Area=Hinjewadi | Price, floor plans |
| **Square Yards** | https://www.squareyards.com/real-estate/pune/hinjewadi | Verified listings |

---

## MAHARERA SEARCH STEPS

1. Go to: https://maharera.maharashtra.gov.in/
2. Click: "Search Project" (under Citizen Services)
3. District: **Pune**
4. Promoter: (Leave blank or enter developer name)
5. Keyword: "Hinjewadi" OR project name
6. Note: **MahaRERA Registration No.**, Promoter Name, Status, Completion Date

---

## PROJECT RESEARCH SHEET

### FORMAT — Fill One Row Per Project

```
Project Name (as marketed):
Canonical Name (your decision):
Alias Names (if any):

LOCATION
Phase (actual verified): Hinjewadi Phase 1 / Phase 2 / Phase 3 / Mahalunge / Unknown
Full Address (from RERA):
PIN Code:

DEVELOPER
Developer Name (official):
Developer Parent Company:
Developer Website:

RERA
RERA Registered: Yes / No
RERA Number (exact from MahaRERA):
RERA Promoter Name (exact from MahaRERA):
RERA Status (from MahaRERA): New Project / Extended / Lapsed / Revoked
RERA Registration Date:
RERA Completion Date:
MahaRERA URL:

STATUS
Project Status: READY_TO_MOVE / UNDER_CONSTRUCTION / NEW_LAUNCH / UPCOMING / COMPLETED
Launch Year:
Possession Date (verified):
Source:

SIZE
Total Units:
Total Towers:
Total Floors:
Land Area (acres):
Source:

CONFIGURATION
BHK Types: 1BHK / 2BHK / 2.5BHK / 3BHK / 4BHK / Duplex / Penthouse
Min Carpet Area (sqft):
Max Carpet Area (sqft):
Source:

PRICE
Starting Price:
Price Range:
Price Per Sqft:
Source (e.g., Housing.com):
Date Checked: 2026-08-25

AMENITIES (verified only — source required)
- Swimming Pool: Yes/No | Source:
- Clubhouse: Yes/No | Source:
- Gym: Yes/No | Source:
- Children Play Area: Yes/No | Source:
- EV Charging: Yes/No | Source:
- Power Backup: Yes/No | Source:
- Security: Yes/No | Source:

CONFIDENCE
Overall: HIGH / MEDIUM / LOW / UNVERIFIED
Reason:

NOTES / CONFLICTS
```

---

## KNOWN MAJOR PROJECTS TO RESEARCH (Starting List)

### HINJEWADI PHASE 1
- [ ] Kolte Patil Life Republic
- [ ] Nyati Eternity
- [ ] Nyati Empress
- [ ] Rohan Kritika
- [ ] Kumar Parth
- [ ] Rachana Sampark

### HINJEWADI PHASE 2
- [ ] Godrej 24 (alias: Godrej Twenty4)
- [ ] Bramha Corp Evara
- [ ] Signature Global Titanium
- [ ] Godrej Infinity
- [ ] Pristine Prolife
- [ ] Kolte Patil Ivy Estate

### HINJEWADI PHASE 3
- [ ] Kumar Pinakin
- [ ] Nyati Elan
- [ ] Paranjape Blue Ridge
- [ ] Ganga Aria
- [ ] Majestique Marbella

### MAHALUNGE
- [ ] Nanded City (large township — multiple RERA projects)
- [ ] Soleil Mahalunge
- [ ] Casagrand Supremus

---

## DUPLICATE DETECTION LOG

| Name Found | Canonical Name | Reason for Duplicate |
|---|---|---|
| Godrej Twenty4 | Godrej 24 | Same project, different marketing name |
| (add more here) | | |

---

## DATA QUALITY NOTES

- If RERA number shows "RERA-PUN-PRM-PENDING" → mark as NOT RERA registered
- If price not found → write "Not publicly verified"  
- If only one source found → mark confidence as LOW
- If two+ credible sources → mark confidence as MEDIUM or HIGH

---

## COLUMN MAPPING → DATABASE

| Research Field | Database Field |
|---|---|
| Canonical Name | `canonical_name` |
| RERA Number (exact) | `rera_number` |
| MahaRERA URL | `rera_source_url` |
| Date Checked | `price_last_verified` / `last_verified_at` |
| Project Status | `project_status` (must match enum) |
| Confidence | `confidence_level` (must match enum) |
