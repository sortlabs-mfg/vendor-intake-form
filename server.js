// ┌─────────────────────────────────────────────────────────────────────┐
// │  VENDOR INTAKE — BACKEND SERVER                                    │
// │                                                                     │
// │  This server does one thing: receives form submissions and          │
// │  appends them as new rows to your existing Vendor_Layout.xlsx.      │
// │                                                                     │
// │  The vendor never sees the Excel file. They only see the form.     │
// │                                                                     │
// │  To start:  node server.js                                         │
// │  Runs on:   http://localhost:3001                                  │
// └─────────────────────────────────────────────────────────────────────┘

const express = require("express");
const cors = require("cors");
const ExcelJS = require("exceljs");
const path = require("path");

const app = express();
const PORT = 3001;

// ─── CONFIGURATION ──────────────────────────────────────────────────
// Point this to your actual Vendor_Layout.xlsx file.
// Use the full path to wherever you keep the master file.
const EXCEL_FILE = path.join(__dirname, "Vendor_Layout.xlsx");

// ─── MIDDLEWARE ──────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── COLUMN MAPPING ─────────────────────────────────────────────────
// This maps the form's capability keys to the correct Excel column.
// Columns A–AH are the original layout. AI–AQ are the new financial columns.
// Column numbers are 1-based (A=1, B=2, etc.)

const CAPABILITY_COLUMNS = {
  fedex: 8,        // H
  ups: 9,          // I
  amz: 10,         // J
  controls: 11,    // K
  elec: 12,        // L
  mech: 13,        // M
  cutSteel: 14,    // N
  staLad: 15,      // O
  plat: 16,        // P
  hrail: 17,       // Q
  chu01: 18,       // R
  slide13: 19,     // S
  drive: 20,       // T
  tail: 21,        // U
  nosHit: 22,      // V
  intWeld: 23,     // W
  intBltd: 24,     // X
  chuteSteel: 25,  // Y
  chutePlastic: 26,// Z
  fab: 27,         // AA
  mach: 28,        // AB
  burnLsr: 29,     // AC
  burnPlas: 30,    // AD
  paintPwdr: 31,   // AE
  paintWet: 32,    // AF
  dist: 33,        // AG
};

// ─── SUBMIT ENDPOINT ────────────────────────────────────────────────
app.post("/api/submit", async (req, res) => {
  try {
    const f = req.body;

    // Load the existing workbook
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(EXCEL_FILE);
    const sheet = workbook.getWorksheet("Sheet1") || workbook.worksheets[0];

    // Find the next empty row (start after row 3 which is headers)
    let nextRow = 4;
    while (sheet.getCell(nextRow, 1).value !== null && sheet.getCell(nextRow, 1).value !== undefined) {
      nextRow++;
    }

    // Write vendor info (columns A–G)
    sheet.getCell(nextRow, 1).value = f.category || "";      // A: CATEGORY
    sheet.getCell(nextRow, 2).value = f.vendor || "";         // B: VENDOR
    sheet.getCell(nextRow, 3).value = f.type || "";           // C: TYPE
    sheet.getCell(nextRow, 4).value = f.location || "";       // D: LOCATION
    sheet.getCell(nextRow, 5).value = f.contact || "";        // E: CONTACT
    sheet.getCell(nextRow, 6).value = f.phone || "";          // F: PHONE #
    sheet.getCell(nextRow, 7).value = f.region || "";         // G: REGION

    // Write capability X marks (columns H–AG)
    const caps = f.capabilities || [];
    for (const [key, col] of Object.entries(CAPABILITY_COLUMNS)) {
      sheet.getCell(nextRow, col).value = caps.includes(key) ? "X" : "";
    }

    // Write comments (column AH = 34)
    sheet.getCell(nextRow, 34).value = f.comments || "";

    // ─── NEW FINANCIAL COLUMNS ──────────────────────────────────
    // These extend the spreadsheet beyond the original layout.
    // If the headers don't exist yet, we add them on the first submission.

    const financialHeaders = [
      { col: 35, group: "FINANCIAL", header: "EIN / TAX ID" },
      { col: 36, group: "",          header: "DUNS #" },
      { col: 37, group: "",          header: "PAYMENT TERMS" },
      { col: 38, group: "",          header: "CURRENCY" },
      { col: 39, group: "",          header: "MIN ORDER ($)" },
      { col: 40, group: "",          header: "LEAD TIME (WKS)" },
      { col: 41, group: "",          header: "INS COVERAGE" },
      { col: 42, group: "",          header: "ANNUAL REV ($)" },
      { col: 43, group: "",          header: "SUBMIT DATE" },
    ];

    // Add financial headers if they're not there yet
    if (!sheet.getCell(3, 35).value) {
      for (const h of financialHeaders) {
        if (h.group) sheet.getCell(2, h.col).value = h.group;
        sheet.getCell(3, h.col).value = h.header;
      }
    }

    // Write financial data
    sheet.getCell(nextRow, 35).value = f.ein || "";
    sheet.getCell(nextRow, 36).value = f.duns || "";
    sheet.getCell(nextRow, 37).value = f.paymentTerms || "";
    sheet.getCell(nextRow, 38).value = f.currency || "";
    sheet.getCell(nextRow, 39).value = f.minOrder || "";
    sheet.getCell(nextRow, 40).value = f.leadTime || "";
    sheet.getCell(nextRow, 41).value = f.insurance || "";
    sheet.getCell(nextRow, 42).value = f.annualRevenue || "";
    sheet.getCell(nextRow, 43).value = new Date().toISOString().slice(0, 10);

    // Save the workbook
    await workbook.xlsx.writeFile(EXCEL_FILE);

    console.log(`✓ Vendor "${f.vendor}" added to row ${nextRow}`);
    res.json({ success: true, row: nextRow });

  } catch (err) {
    console.error("Error writing to Excel:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── HEALTH CHECK ───────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", file: EXCEL_FILE });
});

// ─── START ──────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n  Vendor intake server running on http://localhost:${PORT}`);
  console.log(`  Writing to: ${EXCEL_FILE}\n`);
});
