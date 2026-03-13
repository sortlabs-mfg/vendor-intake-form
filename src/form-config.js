// ┌─────────────────────────────────────────────────────────────────────┐
// │  VENDOR INTAKE FORM — CONFIGURATION FILE                          │
// │                                                                     │
// │  Edit this file to change what appears on the form.                │
// │  You do NOT need to touch vendor-intake-form.jsx at all.           │
// │                                                                     │
// │  After making changes, save this file. If your dev server is       │
// │  running (npm start), the browser will refresh automatically.      │
// └─────────────────────────────────────────────────────────────────────┘


// ─── STEP 1: VENDOR CATEGORIES ──────────────────────────────────────
// To add a category: type it in quotes inside the "items" list.
// To remove one: delete it from the list.
// To add a new group: copy an existing object and change title + items.

export const CAT_GROUPS = [
  { title: "Systems & Integration", items: ["INTEGRATOR", "SORTERS", "CONVEYOR", "CURVES", "MEZZANINE"] },
  { title: "Components & Parts",    items: ["COMPONENTS", "CHUTES", "BOM", "BELTING", "MOTOR", "PUL/ROL", "BEARINGS", "UHMW", "HDWR", "AIR/HYDR"] },
  { title: "Electrical",            items: ["ELEC"] },
  { title: "Raw Materials",         items: ["STEEL", "GRATING"] },
  { title: "Services",              items: ["FABRICATION", "MACHINING", "PAINT", "LABOR", "RENTALS"] },
  { title: "Logistics",             items: ["FREIGHT", "FREIGHT - INT'L", "FREIGHT - HEAVY", "FREIGHT - POWER"] },
];


// ─── STEP 2: VENDOR INFO DROPDOWNS ─────────────────────────────────

export const VENDOR_TYPES = [
  "Manufacturer", "Distributor", "Service Provider",
  "Contract Manufacturer", "Raw Material Supplier",
];

export const REGIONS = [
  "Northeast", "Southeast", "Midwest", "Southwest",
  "West", "National", "International",
];


// ─── STEP 3: CAPABILITIES TOGGLES ──────────────────────────────────
// "key" = internal ID (no spaces). "label" = what the vendor sees.

export const CUSTOMERS = [
  { key: "fedex",    label: "FedEx" },
  { key: "ups",      label: "UPS" },
  { key: "amz",      label: "Amazon" },
];

export const INSTALL = [
  { key: "controls", label: "Controls" },
  { key: "elec",     label: "Electrical" },
  { key: "mech",     label: "Mechanical" },
];

export const BOM_ITEMS = [
  { key: "cutSteel", label: "Cut Steel" },
  { key: "staLad",   label: "STA / LAD" },
  { key: "plat",     label: "PLAT" },
  { key: "hrail",    label: "HRAIL" },
  { key: "chu01",    label: "CHU-01" },
  { key: "slide13",  label: "SLIDE-13" },
];

export const COMP = [
  { key: "drive",    label: "Drive" },
  { key: "tail",     label: "Tail" },
  { key: "nosHit",   label: "NOS / HIT" },
  { key: "intWeld",  label: "INT (Weld)" },
  { key: "intBltd",  label: "INT (BLTD)" },
];

export const CHUTES_ITEMS = [
  { key: "chuteSteel",   label: "Steel" },
  { key: "chutePlastic", label: "Plastic" },
];

export const MFG_CAPABILITIES = [
  { key: "fab",       label: "Fabrication" },
  { key: "mach",      label: "Machining" },
  { key: "burnLsr",   label: "Burn (Laser)" },
  { key: "burnPlas",  label: "Burn (Plasma)" },
  { key: "paintPwdr", label: "Paint (Powder)" },
  { key: "paintWet",  label: "Paint (Wet)" },
  { key: "dist",      label: "Distribution" },
];

// Controls which groups appear and in what order.
export const CAPABILITY_GROUPS = [
  { label: "Customers",        items: CUSTOMERS },
  { label: "Install",          items: INSTALL },
  { label: "BOM",              items: BOM_ITEMS },
  { label: "Components",       items: COMP },
  { label: "Chutes",           items: CHUTES_ITEMS },
  { label: "Mfg Capabilities", items: MFG_CAPABILITIES },
];


// ─── STEP 4: FINANCIAL DROPDOWNS ────────────────────────────────────

export const PAYMENT_TERMS = [
  "Net 15", "Net 30", "Net 45", "Net 60", "Net 90",
  "COD", "Prepaid", "2/10 Net 30",
];

export const CURRENCIES = [
  "USD", "CAD", "EUR", "GBP", "CNY", "JPY", "MXN",
];


// ─── SERVER URL ─────────────────────────────────────────────────────
// Local development: http://localhost:3001
// After deploying to Railway, change this to your Railway URL, e.g.:
//   https://vendor-intake-production.up.railway.app

export const API_URL = "https://vendor-intake-server-production.up.railway.app";
