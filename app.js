const STORAGE_KEY = "jumvi_state_v2";
const LEGACY_KEYS = ["jumvi_state_v3", "jumvi_state_v1"];
const LANG_KEY = "jumvi_lang";

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));
window.__jumviDelete = async (type, id, idx) => {
  const safeId = (!id || id === "undefined") ? "" : id;
  const byId = (arr) => arr.filter((x) => String(x.id) !== String(safeId));
  const byIndex = (arr) => {
    const n = Number(idx);
    if (!Number.isFinite(n)) return arr;
    return arr.filter((_, i) => i !== n);
  };
  const getItem = (arr) => {
    if (safeId) return arr.find((x) => String(x.id) === String(safeId)) || null;
    const n = Number(idx);
    if (!Number.isFinite(n)) return null;
    return arr[n] || null;
  };
  const remove = (arr) => {
    if (!safeId) return byIndex(arr);
    const next = byId(arr);
    return next.length === arr.length ? byIndex(arr) : next;
  };
  if (type === "suppliers") state.suppliers = remove(state.suppliers);
  if (type === "invoices") {
    const item = getItem(state.invoices);
    if (item?.fileId) await deleteFile(item.fileId, { silent: true });
    state.invoices = remove(state.invoices);
  }
  if (type === "payments") {
    const item = getItem(state.payments);
    if (item?.fileId) await deleteFile(item.fileId, { silent: true });
    state.payments = remove(state.payments);
  }
  if (type === "documents") {
    const item = getItem(state.documents);
    if (item?.fileId) await deleteFile(item.fileId, { silent: true });
    state.documents = remove(state.documents);
  }
  if (type === "experiments") state.amazonOps.experiments = remove(state.amazonOps.experiments);
  if (type === "launch") state.amazonOps.launch.items = remove(state.amazonOps.launch.items);
  try {
    await saveState();
  } finally {
    renderCurrentTab();
    renderStats();
  }
};

window.__jumviDeleteFromBtn = async (btn) => {
  if (!btn) return;
  const type = btn.dataset.type || activeTab;
  const id = btn.dataset.del;
  let idx = btn.dataset.delIdx;
  if (idx === undefined || idx === "" || idx === null) {
    const row = btn.closest("tr");
    if (row && row.parentElement) {
      idx = Array.from(row.parentElement.children).indexOf(row);
    }
  }
  await window.__jumviDelete(type, id, idx);
};

const i18n = {
  tr: {
    "brand.title": "JUMVI Panel",
    "brand.subtitle": "Amazon Özel Marka Operasyonları",
    "topbar.search": "Ara...",
    "topbar.export": "Dışa aktar",
    "topbar.import": "İçe aktar",
    "topbar.clear": "Tüm veriyi sil",
    "tabs.suppliers": "Tedarikçiler",
    "tabs.invoices": "Faturalar",
    "tabs.payments": "Ödemeler",
    "tabs.documents": "Evraklar",
    "tabs.files": "Dosya Gezgini",
    "tabs.qc": "QC Performans",
    "tabs.amazon": "Amazon Ops",
    "tabs.profit": "Kârlılık",
    "kpi.suppliers": "Tedarikçi Sayısı",
    "kpi.invoices": "Fatura Sayısı",
    "kpi.payments": "Ödeme Sayısı",
    "kpi.documents": "Evrak Sayısı",
    "kpi.pending": "Ödemesi Bekleyen",
    "kpi.openBalance": "Açık bakiye: {value}",
    "kpi.openBalanceHint": "Ödenmemiş fatura toplamı",
    "kpi.total": "Toplam: {value}",
    "kpi.monthly": "Bu Ay",
    "kpi.gold": "Çeyrek Altın",
    "kpi.goldCount": "Adet",
    "kpi.goldPrice": "Çeyrek (USD): {value}",
    "kpi.goldPriceTry": "Çeyrek (TRY): {value}",
    "kpi.goldSource": "Kaynak: {value}",
    "kpi.goldSource.cap": "Kapalıçarşı",
    "kpi.goldSource.spot": "Spot (Global)",
    "kpi.goldDelta": "Günlük değişim: {value}",
    "kpi.goldCapital": "Sermaye (USD)",
    "kpi.goldExpenses": "Harcamalar (USD): {value}",
    "kpi.goldNet": "Net Bakiye (USD)",
    "kpi.goldUpdated": "Güncelleme: {value}",
    "kpi.goldNoData": "Fiyat bilgisi yok",
    "kpi.goldRefresh": "Fiyatı Yenile",
    "suppliers.title": "Tedarikçi Yönetimi",
    "suppliers.desc": "Tedarikçi portföyünüzü yönetin.",
    "suppliers.name": "Firma Adı",
    "suppliers.country": "Ülke",
    "suppliers.contact": "İlgili Kişi",
    "suppliers.email": "E-posta",
    "suppliers.notes": "Notlar",
    "suppliers.save": "Tedarikçi Kaydet",
    "invoices.title": "Faturalar",
    "invoices.desc": "Operasyonel fatura kayıtları.",
    "payments.title": "Ödemeler",
    "payments.desc": "Operasyonel ödeme takibi.",
    "documents.title": "Evraklar",
    "documents.desc": "Resmi evrak yönetimi.",
    "files.title": "Dosya Gezgini",
    "qc.title": "QC Performans",
    "profit.title": "Amazon Revenue Calculator (Birebir)",
    "profit.desc": "Amazon Revenue Calculator ile aynı mantıkta birebir kârlılık ve ROI hesabı.",
    "amazon.title": "Amazon Operasyon Araçları",
    "amazon.desc": "PPC, envanter, deney ve fiyat notları.",
    "amazon.ppc.title": "PPC Sağlık",
    "amazon.inventory.title": "Envanter Sağlığı",
    "amazon.experiments.title": "Listing Testleri",
    "amazon.brand.title": "Brand Analytics Notları",
    "amazon.pricing.title": "Fiyat Takibi",
    "amazon.launch.title": "Launch Checklist",
    "amazon.launch.add": "Görev Ekle",
    "amazon.launch.empty": "Henüz görev yok",
    "export.csv": "CSV",
    "export.xlsx": "XLSX",
    "export.json": "JSON",
    "export.summary": "Summary",
    "messages.saved": "Kaydedildi",
    "messages.deleted": "Silindi",
    "messages.unauthorized": "Yetkisiz erişim",
    "messages.error": "Bir sorun oluştu",
  },
  en: {
    "brand.title": "JUMVI Panel",
    "brand.subtitle": "Amazon Seller Dashboard",
    "topbar.search": "Search...",
    "topbar.export": "Export",
    "topbar.import": "Import",
    "topbar.clear": "Clear all",
    "tabs.suppliers": "Suppliers",
    "tabs.invoices": "Invoices",
    "tabs.payments": "Payments",
    "tabs.documents": "Documents",
    "tabs.files": "Files",
    "tabs.qc": "QC",
    "tabs.amazon": "Amazon Ops",
    "tabs.profit": "Profit",
    "kpi.suppliers": "Suppliers",
    "kpi.invoices": "Invoices",
    "kpi.payments": "Payments",
    "kpi.documents": "Documents",
    "kpi.pending": "Pending",
    "kpi.openBalance": "Open balance: {value}",
    "kpi.openBalanceHint": "Total unpaid invoice amount",
    "kpi.total": "Total: {value}",
    "kpi.monthly": "This Month",
    "kpi.gold": "Quarter Gold",
    "kpi.goldCount": "Count",
    "kpi.goldPrice": "Quarter (USD): {value}",
    "kpi.goldPriceTry": "Quarter (TRY): {value}",
    "kpi.goldSource": "Source: {value}",
    "kpi.goldSource.cap": "Kapalıçarşı",
    "kpi.goldSource.spot": "Spot (Global)",
    "kpi.goldDelta": "Daily change: {value}",
    "kpi.goldCapital": "Capital (USD)",
    "kpi.goldExpenses": "Expenses (USD): {value}",
    "kpi.goldNet": "Net Balance (USD)",
    "kpi.goldUpdated": "Updated: {value}",
    "kpi.goldNoData": "No price data",
    "kpi.goldRefresh": "Refresh Price",
    "suppliers.title": "Suppliers",
    "suppliers.desc": "Manage suppliers.",
    "suppliers.name": "Company Name",
    "suppliers.country": "Country",
    "suppliers.contact": "Contact",
    "suppliers.email": "Email",
    "suppliers.notes": "Notes",
    "suppliers.save": "Save Supplier",
    "invoices.title": "Invoices",
    "invoices.desc": "Operational invoices.",
    "payments.title": "Payments",
    "payments.desc": "Payment tracking.",
    "documents.title": "Documents",
    "documents.desc": "Document management.",
    "files.title": "File Explorer",
    "qc.title": "QC Performance",
    "profit.title": "Amazon Revenue Calculator (Exact)",
    "profit.desc": "Exact calculator logic.",
    "amazon.title": "Amazon Operations",
    "amazon.desc": "PPC, inventory, experiments, and pricing notes.",
    "amazon.ppc.title": "PPC Health",
    "amazon.inventory.title": "Inventory Health",
    "amazon.experiments.title": "Listing Experiments",
    "amazon.brand.title": "Brand Analytics Notes",
    "amazon.pricing.title": "Pricing Notes",
    "amazon.launch.title": "Launch Checklist",
    "amazon.launch.add": "Add Task",
    "amazon.launch.empty": "No tasks yet",
    "export.csv": "CSV",
    "export.xlsx": "XLSX",
    "export.json": "JSON",
    "export.summary": "Summary",
    "messages.saved": "Saved",
    "messages.deleted": "Deleted",
    "messages.unauthorized": "Unauthorized",
    "messages.error": "Something went wrong",
  }
};

let lang = localStorage.getItem(LANG_KEY) || "tr";
let activeTab = "suppliers";
let renderToken = 0;
let state = defaultState();
let fileCache = [];
let fileCacheAt = 0;
const fxCache = new Map();

const formatters = {
  currency: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }),
  number: new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }),
  datetime: new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" })
};

function t(key, vars = {}) {
  const str = i18n[lang]?.[key] || key;
  return Object.keys(vars).reduce((acc, k) => acc.replace(`{${k}}`, vars[k]), str);
}

function applyI18n() {
  $$('[data-i18n]').forEach((el) => (el.textContent = t(el.dataset.i18n)));
  $$('[data-i18n-placeholder]').forEach((el) => (el.placeholder = t(el.dataset.i18nPlaceholder)));
  document.documentElement.lang = lang;
}

function defaultState() {
  return {
    updatedAt: 0,
    suppliers: [],
    invoices: [],
    payments: [],
    documents: [],
    qcRecords: [],
    gold: { quarterCount: 20, quarterUsd: null, quarterTry: null, updatedAt: null, source: null, prevQuarterUsd: null, prevUpdatedAt: null },
    fx: { usdTry: "", tryAmount: "", usdAmount: "", mode: "usd" },
    capital: { amountUsd: "" },
    amazonOps: {
      ppc: { adSpend: "", adSales: "", totalSales: "" },
      inventory: { unitsSold90: "", avgInventory: "", ipi: "" },
      experiments: [],
      brand: { keywords: "", notes: "" },
      pricing: { targetPrice: "", minProfit: "", currentPrice: "", notes: "" },
      launch: { items: [] }
    },
    revenueCalc: {
      price: "",
      amazonFees: "",
      amazonFeePercent: "15",
      amazonFeeMode: "percent",
      fbaFulfillment: "",
      storage: "",
      inbound: "",
      productCost: "",
      tacosPercent: "",
      qty: 100,
      refundPercent: "",
      ultPrice: "",
      ultCost: "",
      ultCommission: "15",
      ultQty: "100",
      ultStock: "250",
      ultAds: "",
      ultRefund: "3.00",
      ultTax: "0.00",
      ultFx: "43.5"
    }
  };
}

async function loadState() {
  const local = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  const legacy = LEGACY_KEYS.map((k) => {
    try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; }
  }).find(Boolean);
  const remote = await fetchRemoteState().catch(() => null);
  const candidates = [remote, local, legacy].filter(Boolean).map(migrateState);
  if (candidates.length) {
    const updatedAt = (s) => Number(s.updatedAt || 0);
    const hasUpdatedAt = candidates.some((c) => updatedAt(c) > 0);
    const score = (s) => (s.suppliers.length + s.invoices.length + s.payments.length + s.documents.length + s.qcRecords.length);
    const base = hasUpdatedAt
      ? candidates.reduce((best, cur) => (updatedAt(cur) > updatedAt(best) ? cur : best), defaultState())
      : candidates.reduce((best, cur) => (score(cur) > score(best) ? cur : best), defaultState());
    state = defaultState();
    state.updatedAt = updatedAt(base) || Date.now();
    state.suppliers = Array.isArray(base.suppliers) ? base.suppliers : [];
    state.invoices = Array.isArray(base.invoices) ? base.invoices : [];
    state.payments = Array.isArray(base.payments) ? base.payments : [];
    state.documents = Array.isArray(base.documents) ? base.documents : [];
    state.qcRecords = Array.isArray(base.qcRecords) ? base.qcRecords : [];
    state.gold = base.gold || defaultState().gold;
    state.revenueCalc = base.revenueCalc || defaultState().revenueCalc;
  } else {
    state = defaultState();
  }
  syncWiseRefs();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function saveState() {
  syncWiseRefs();
  state.updatedAt = Date.now();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  try {
    await fetch("/panel/api/state", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state)
    });
  } catch {}
}

async function fetchRemoteState() {
  const res = await fetch("/panel/api/state");
  if (!res.ok) return null;
  const data = await res.json();
  return data?.state || null;
}

function migrateState(raw) {
  const safe = raw && typeof raw === "object" ? raw : {};
  // If this is the newer unified records model, map it back
  if (Array.isArray(safe.records)) {
    const mapped = defaultState();
    mapped.suppliers = Array.isArray(safe.suppliers) ? safe.suppliers : [];
    mapped.gold = safe.gold || mapped.gold;
    mapped.revenueCalc = safe.revenueCalc || mapped.revenueCalc;
    safe.records.forEach((r) => {
      if (r.type === "invoice") mapped.invoices.push({
        id: r.id,
        supplierId: r.supplier_id,
        number: r.note || "",
        date: r.date,
        amountUsd: r.amount || 0,
        amountOriginal: r.amount || 0,
        amountCurrency: r.currency || "USD",
        status: r.status || "open",
        fileId: r.attachments?.[0]?.key || null,
        wiseRefMatch: r.wiseRefMatch || null
      });
      if (r.type === "payment") mapped.payments.push({
        id: r.id,
        invoiceId: r.invoiceId || null,
        date: r.date,
        amountUsd: r.amount || 0,
        amountOriginal: r.amount || 0,
        amountCurrency: r.currency || "USD",
        wiseRef: r.wiseRef || "",
        fileId: r.attachments?.[0]?.key || null
      });
      if (r.type === "doc") mapped.documents.push({
        id: r.id,
        title: r.note || "",
        date: r.date,
        invoiceId: r.invoiceId || null,
        fileId: r.attachments?.[0]?.key || null
      });
      if (r.type === "qc") mapped.qcRecords.push({
        id: r.id,
        invoiceId: r.invoiceId || null,
        qcVideoFileId: r.attachments?.[0]?.key || null,
        videoOk: r.videoOk || false,
        multiOk: r.multiOk || false,
        score: r.score || 0
      });
    });
    return mapped;
  }
  return {
    suppliers: Array.isArray(safe.suppliers) ? safe.suppliers : [],
    invoices: Array.isArray(safe.invoices) ? safe.invoices : [],
    payments: Array.isArray(safe.payments) ? safe.payments : [],
    documents: Array.isArray(safe.documents) ? safe.documents : [],
    qcRecords: Array.isArray(safe.qcRecords) ? safe.qcRecords : [],
    gold: safe.gold || defaultState().gold,
    amazonOps: safe.amazonOps || defaultState().amazonOps,
    revenueCalc: safe.revenueCalc || defaultState().revenueCalc
  };
}

function syncWiseRefs() {
  if (!state.invoices.length || !state.payments.length) return;
  state.invoices.forEach((inv) => { inv.wiseRefMatch = null; });
  state.payments.forEach((p) => {
    if (p.invoiceId) {
      const inv = state.invoices.find((i) => i.id === p.invoiceId);
      if (inv && p.wiseRef) inv.wiseRefMatch = p.wiseRef;
      return;
    }
    if (!p.wiseRef) return;
    const match = state.invoices.find((i) => i.number && i.number === p.wiseRef);
    if (match) {
      p.invoiceId = match.id;
      match.wiseRefMatch = p.wiseRef;
    }
  });
  state.invoices.forEach((inv) => {
    const totalPaid = state.payments
      .filter((p) => p.invoiceId === inv.id)
      .reduce((sum, p) => sum + (p.amountUsd || 0), 0);
    if (totalPaid >= (inv.amountUsd || 0) && inv.amountUsd) inv.status = "paid";
  });
}

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2);
}

function parseMoney(val) {
  const cleaned = String(val ?? "").replace(/[^\d.,-]/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function formatMoneyInput(val) {
  const n = parseMoney(val);
  if (!Number.isFinite(n)) return "";
  const hasDecimals = Math.abs(n % 1) > 0;
  return new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2
  }).format(n);
}

function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function qcStatus(score) {
  if (score >= 70) return "pass";
  if (score >= 40) return "rework";
  return "fail";
}

function qcStatusLabel(status) {
  if (lang === "tr") {
    if (status === "pass") return "Geçti";
    if (status === "rework") return "Revize";
    return "Kaldı";
  }
  if (status === "pass") return "Pass";
  if (status === "rework") return "Rework";
  return "Fail";
}

function normalizeCategoryId(id) {
  return id || "misc";
}

function showMsg(msg, type = "ok") {
  const el = $("#globalMsg");
  if (!el) return;
  el.textContent = msg;
  el.className = `msg show ${type}`;
  setTimeout(() => el.classList.remove("show"), 1800);
}

async function refreshFiles(force = false) {
  const now = Date.now();
  if (!force && fileCache.length && now - fileCacheAt < 60000) return fileCache;
  const res = await fetch("/panel/api/list");
  if (!res.ok) return fileCache;
  fileCache = await res.json();
  fileCacheAt = now;
  return fileCache;
}

async function getFxRate(date) {
  if (!date) return null;
  if (fxCache.has(date)) return fxCache.get(date);
  const res = await fetch(`/panel/api/fx?date=${encodeURIComponent(date)}`);
  if (!res.ok) return null;
  const data = await res.json();
  fxCache.set(date, data.rate);
  return data.rate;
}

async function refreshGoldPrice() {
  const res = await fetch("/panel/api/gold");
  if (!res.ok) return null;
  const data = await res.json();
  const prevQuarterUsd = state.gold.quarterUsd || null;
  const prevUpdatedAt = state.gold.updatedAt || null;
  state.gold = {
    quarterCount: state.gold.quarterCount || 0,
    quarterUsd: data.quarterUsd || null,
    quarterTry: data.quarterTry || null,
    updatedAt: new Date().toISOString(),
    source: data.source || null,
    prevQuarterUsd,
    prevUpdatedAt
  };
  await saveState();
  renderStats();
}

function renderStats() {
  const suppliersCount = state.suppliers.length;
  const invoicesCount = state.invoices.length;
  const paymentsCount = state.payments.length;
  const documentsCount = state.documents.length;
  const invoiceTotal = state.invoices.reduce((sum, i) => sum + (i.amountUsd || 0), 0);
  const paymentTotal = state.payments.reduce((sum, p) => sum + (p.amountUsd || 0), 0);
  const monthlyInvoiceTotal = invoiceTotal;
  const monthlyPaymentTotal = paymentTotal;
  const openInvoices = state.invoices.filter((i) => i.status !== "paid");
  const openBalanceUsd = openInvoices.reduce((sum, inv) => {
    const paid = state.payments.filter((p) => p.invoiceId === inv.id).reduce((s, p) => s + (p.amountUsd || 0), 0);
    return sum + Math.max(0, (inv.amountUsd || 0) - paid);
  }, 0);
  const pendingCount = openInvoices.filter((inv) => {
    const paid = state.payments.filter((p) => p.invoiceId === inv.id).reduce((s, p) => s + (p.amountUsd || 0), 0);
    return (inv.amountUsd || 0) - paid > 0;
  }).length;
  const maxCount = Math.max(1, suppliersCount, invoicesCount, paymentsCount, documentsCount, pendingCount);
  const maxMoney = Math.max(1, invoiceTotal, paymentTotal, monthlyInvoiceTotal, openBalanceUsd);
  const pct = (value, max) => Math.min(100, Math.round((value / max) * 100));

  const goldQuarterCount = state.gold.quarterCount || 0;
  const quarterUsd = state.gold.quarterUsd || 0;
  const quarterTry = state.gold.quarterTry || 0;
  const goldCapitalUsd = goldQuarterCount * quarterUsd;
  const netBalanceUsd = goldCapitalUsd - paymentTotal;
  const fxUsdTry = parseMoney(state.fx?.usdTry || "") || (quarterTry && quarterUsd ? (quarterTry / quarterUsd) : 0);
  const fxMode = state.fx?.mode || "usd";
  const fxTryAmount = parseMoney(state.fx?.tryAmount || "");
  const fxUsdAmount = parseMoney(state.fx?.usdAmount || "");
  const fxUsdReadonly = "";
  const fxTryReadonly = "";
  const capitalUsd = parseMoney(state.capital?.amountUsd || "");
  const capitalTry = fxUsdTry ? capitalUsd * fxUsdTry : 0;
  const prevQuarterUsd = state.gold.prevQuarterUsd;
  const deltaUsd = typeof prevQuarterUsd === "number" && prevQuarterUsd > 0 ? (quarterUsd - prevQuarterUsd) : null;
  const deltaPct = deltaUsd !== null && prevQuarterUsd ? (deltaUsd / prevQuarterUsd) * 100 : null;
  const sourceLabel = state.gold.source === "kapalicarsi" ? t("kpi.goldSource.cap") : state.gold.source === "spot" ? t("kpi.goldSource.spot") : "";
  const updatedLabel = state.gold.updatedAt ? t("kpi.goldUpdated", { value: formatters.datetime.format(new Date(state.gold.updatedAt)) }) : t("kpi.goldNoData");
  const deltaLabel = deltaUsd !== null
    ? `${deltaUsd >= 0 ? "+" : ""}${formatters.currency.format(deltaUsd)} (${deltaPct >= 0 ? "+" : ""}${formatters.number.format(deltaPct)}%)`
    : "—";

  const html = `
    <div class="kpi-card">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.suppliers")}</div>
        <span class="kpi-icon">T</span>
      </div>
      <div class="kpi-value">${formatters.number.format(suppliersCount)}</div>
      <div class="kpi-spark"><span style="width:${pct(suppliersCount, maxCount)}%"></span></div>
    </div>
    <div class="kpi-card accent">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.invoices")}</div>
        <span class="kpi-icon">F</span>
      </div>
      <div class="kpi-value">${formatters.number.format(invoicesCount)}</div>
      <div class="kpi-sub">${t("kpi.total", { value: formatters.currency.format(invoiceTotal) })}</div>
      <div class="kpi-mini" data-tooltip="${t("kpi.openBalanceHint")}">${t("kpi.openBalance", { value: formatters.currency.format(openBalanceUsd) })}</div>
      <div class="kpi-spark"><span style="width:${pct(openBalanceUsd, maxMoney)}%"></span></div>
    </div>
    <div class="kpi-card accent">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.payments")}</div>
        <span class="kpi-icon">Ö</span>
      </div>
      <div class="kpi-value">${formatters.number.format(paymentsCount)}</div>
      <div class="kpi-sub">${t("kpi.total", { value: formatters.currency.format(paymentTotal) })}</div>
      <div class="kpi-spark"><span style="width:${pct(paymentTotal, maxMoney)}%"></span></div>
    </div>
    <div class="kpi-card">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.documents")}</div>
        <span class="kpi-icon">E</span>
      </div>
      <div class="kpi-value">${formatters.number.format(documentsCount)}</div>
      <div class="kpi-spark"><span style="width:${pct(documentsCount, maxCount)}%"></span></div>
    </div>
    <div class="kpi-card">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.monthly")}</div>
        <span class="kpi-icon">₺</span>
      </div>
      <div class="kpi-value">${formatters.currency.format(monthlyInvoiceTotal)}</div>
      <div class="kpi-sub">${t("kpi.total", { value: formatters.currency.format(monthlyPaymentTotal) })}</div>
      <div class="kpi-spark"><span style="width:${pct(monthlyInvoiceTotal, maxMoney)}%"></span></div>
    </div>
    <div class="kpi-card warning accent">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.pending")}</div>
        <span class="kpi-icon">⏳</span>
      </div>
      <div class="kpi-value">${formatters.number.format(pendingCount)}</div>
      <div class="kpi-spark"><span style="width:${pct(pendingCount, maxCount)}%"></span></div>
    </div>
    <div class="kpi-card gold span-2 accent">
      <div class="kpi-head">
        <div class="kpi-label">${t("kpi.gold")}</div>
        <button class="btn btn-xs" id="goldRefresh">${t("kpi.goldRefresh")}</button>
      </div>
      <div class="kpi-row">
        <label class="kpi-mini">${t("kpi.goldCount")}</label>
        <input class="kpi-input" id="goldCount" type="number" min="0" step="1" value="${goldQuarterCount}" />
      </div>
      <div class="kpi-sub">${t("kpi.goldPrice", { value: formatters.currency.format(quarterUsd || 0) })}</div>
      <div class="kpi-mini kpi-delta ${deltaUsd > 0 ? "up" : deltaUsd < 0 ? "down" : ""}">${t("kpi.goldDelta", { value: deltaLabel })}</div>
      ${quarterTry ? `<div class="kpi-mini">${t("kpi.goldPriceTry", { value: formatters.number.format(quarterTry) })}</div>` : ""}
      ${sourceLabel ? `<div class="kpi-mini">${t("kpi.goldSource", { value: sourceLabel })}</div>` : ""}
      <div class="kpi-value">${formatters.currency.format(goldCapitalUsd)}</div>
      <div class="kpi-sub">${t("kpi.goldExpenses", { value: formatters.currency.format(paymentTotal) })}</div>
      <div class="kpi-value kpi-net">${formatters.currency.format(netBalanceUsd)}</div>
      <div class="kpi-mini">${updatedLabel}</div>
    </div>
    <div class="kpi-card accent fx-card">
      <div class="kpi-label">Kur Çevirici</div>
      <div class="kpi-row">
        <label class="kpi-mini">USD</label>
        <input class="kpi-input" id="fxUsdAmount" type="text" inputmode="decimal" value="${state.fx?.usdAmount || ""}" ${fxUsdReadonly} />
        <button class="btn btn-xs" id="fxSwap" type="button" title="Döndür">⇄</button>
      </div>
      <div class="kpi-row">
        <label class="kpi-mini">TRY</label>
        <input class="kpi-input" id="fxTryAmount" type="text" inputmode="decimal" value="${state.fx?.tryAmount || ""}" ${fxTryReadonly} />
      </div>
      <div class="kpi-sub">1$ ≈ ₺${fxUsdTry ? formatters.number.format(fxUsdTry) : "—"}</div>
    </div>
    <div class="kpi-card accent">
      <div class="kpi-label">Sermayem</div>
      <div class="kpi-row">
        <label class="kpi-mini">USD</label>
        <input class="kpi-input" id="capitalUsd" type="text" inputmode="decimal" value="${state.capital?.amountUsd || ""}" />
      </div>
      <div class="calc-wrap" id="capitalCalcWrap">
        <input class="kpi-input calc-display" id="capitalCalc" type="text" inputmode="decimal" placeholder="Örn: 1200+350-25" />
        <div class="calc-grid">
          ${["7","8","9","/","4","5","6","*","1","2","3","-","0",".","C","+","⌫"].map((b) => `<button type="button" class="btn calc-btn" data-calc="${b}">${b}</button>`).join("")}
          <button type="button" class="btn btn-primary calc-eq" data-calc="=">=</button>
        </div>
      </div>
      <div class="kpi-sub">₺${capitalTry ? formatters.number.format(capitalTry) : "—"}</div>
    </div>
  `;
  const statsEl = $("#stats");
  if (statsEl) statsEl.innerHTML = html;

  const goldInput = $("#goldCount");
  if (goldInput) {
    goldInput.oninput = async () => {
      state.gold.quarterCount = Number(goldInput.value) || 0;
      await saveState();
      renderStats();
    };
  }
  const goldRefresh = $("#goldRefresh");
  if (goldRefresh) goldRefresh.onclick = () => refreshGoldPrice(true);

  const fxTryInput = $("#fxTryAmount");
  const fxUsdInput = $("#fxUsdAmount");
  const fxSwap = $("#fxSwap");
  const fxSave = debounce(() => saveState(), 250);
  let fxActive = state.fx?.mode || "usd";
  let fxSyncing = false;

  const setFxMode = (mode) => {
    fxActive = mode;
    state.fx.mode = mode;
  };

  const syncFromUsd = () => {
    if (!fxUsdInput || !fxTryInput) return;
    const rate = parseMoney(state.fx.usdTry || "") || fxUsdTry || 0;
    const usdVal = parseMoney(fxUsdInput.value);
    if (!fxUsdInput.value.trim()) {
      fxTryInput.value = "";
      state.fx.tryAmount = "";
      return;
    }
    if (rate > 0) {
      const tryVal = usdVal * rate;
      fxTryInput.value = tryVal ? formatMoneyInput(tryVal) : "";
      state.fx.tryAmount = fxTryInput.value;
    }
  };

  const syncFromTry = () => {
    if (!fxUsdInput || !fxTryInput) return;
    const rate = parseMoney(state.fx.usdTry || "") || fxUsdTry || 0;
    const tryVal = parseMoney(fxTryInput.value);
    if (!fxTryInput.value.trim()) {
      fxUsdInput.value = "";
      state.fx.usdAmount = "";
      return;
    }
    if (rate > 0) {
      const usdVal = tryVal / rate;
      fxUsdInput.value = usdVal ? formatMoneyInput(usdVal) : "";
      state.fx.usdAmount = fxUsdInput.value;
    }
  };

  if (fxSwap) {
    fxSwap.onclick = () => {
      setFxMode(fxActive === "usd" ? "try" : "usd");
      // Swap displayed values so user sees direction change
      const prevUsd = fxUsdInput ? fxUsdInput.value : "";
      const prevTry = fxTryInput ? fxTryInput.value : "";
      if (fxUsdInput) fxUsdInput.value = prevTry;
      if (fxTryInput) fxTryInput.value = prevUsd;
      state.fx.usdAmount = fxUsdInput?.value || "";
      state.fx.tryAmount = fxTryInput?.value || "";
      fxSave();
    };
  }
  if (fxTryInput) {
    fxTryInput.onfocus = () => setFxMode("try");
    fxTryInput.oninput = () => {
      if (fxSyncing) return;
      fxSyncing = true;
      setFxMode("try");
      state.fx.tryAmount = fxTryInput.value;
      syncFromTry();
      fxSyncing = false;
      fxSave();
    };
    fxTryInput.onblur = () => {
      if (!fxTryInput.value.trim()) return;
      fxTryInput.value = formatMoneyInput(fxTryInput.value);
      state.fx.tryAmount = fxTryInput.value;
      fxSave();
    };
  }
  if (fxUsdInput) {
    fxUsdInput.onfocus = () => setFxMode("usd");
    fxUsdInput.oninput = () => {
      if (fxSyncing) return;
      fxSyncing = true;
      setFxMode("usd");
      state.fx.usdAmount = fxUsdInput.value;
      syncFromUsd();
      fxSyncing = false;
      fxSave();
    };
    fxUsdInput.onblur = () => {
      if (!fxUsdInput.value.trim()) return;
      fxUsdInput.value = formatMoneyInput(fxUsdInput.value);
      state.fx.usdAmount = fxUsdInput.value;
      fxSave();
    };
  }
  const capitalInput = $("#capitalUsd");
  if (capitalInput) {
    const saveCapital = debounce(() => saveState(), 250);
    capitalInput.oninput = () => {
      state.capital.amountUsd = capitalInput.value;
      saveCapital();
    };
    capitalInput.onblur = async () => {
      if (!capitalInput.value.trim()) return;
      capitalInput.value = formatMoneyInput(capitalInput.value);
      state.capital.amountUsd = capitalInput.value;
      await saveState();
      renderStats();
    };
  }

  const calcInput = $("#capitalCalc");
  const calcWrap = $("#capitalCalcWrap");
  if (calcWrap && calcInput) {
    const safeEval = (expr) => {
      const cleaned = String(expr ?? "").replace(/,/g, ".").replace(/[^0-9+\-*/().\s]/g, "");
      if (!cleaned.trim()) return null;
      if (!/^[0-9+\-*/().\s]+$/.test(cleaned)) return null;
      try {
        // eslint-disable-next-line no-new-func
        const val = Function(`"use strict"; return (${cleaned})`)();
        return Number.isFinite(val) ? val : null;
      } catch {
        return null;
      }
    };
    calcWrap.querySelectorAll("[data-calc]").forEach((btn) => {
      btn.onmousedown = (e) => e.preventDefault();
      btn.onclick = async () => {
        const v = btn.dataset.calc;
        if (v === "C") {
          calcInput.value = "";
          return;
        }
        if (v === "⌫") {
          calcInput.value = calcInput.value.slice(0, -1);
          return;
        }
        if (v === "=") {
          const result = safeEval(calcInput.value);
          if (result === null) {
            showMsg("Geçersiz işlem", "error");
            return;
          }
          const formatted = formatMoneyInput(result);
          calcInput.value = formatted;
          if (capitalInput) {
            capitalInput.value = formatted;
            state.capital.amountUsd = formatted;
            await saveState();
            renderStats();
          }
          return;
        }
        calcInput.value += v;
      };
    });
    calcInput.onkeydown = async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const result = safeEval(calcInput.value);
        if (result === null) {
          showMsg("Geçersiz işlem", "error");
          return;
        }
        const formatted = formatMoneyInput(result);
        calcInput.value = formatted;
        if (capitalInput) {
          capitalInput.value = formatted;
          state.capital.amountUsd = formatted;
          await saveState();
          renderStats();
        }
      }
    };
  }
}

function renderCurrentTab() {
  const panel = $("#mainPanel");
  if (!panel) return;
  panel.innerHTML = "";
  if (activeTab === "suppliers") renderSuppliers(panel);
  if (activeTab === "invoices") renderInvoices(panel);
  if (activeTab === "payments") renderPayments(panel);
  if (activeTab === "documents") renderDocuments(panel);
  if (activeTab === "files") renderFiles(panel);
  if (activeTab === "qc") renderQC(panel);
  if (activeTab === "amazon") renderAmazon(panel);
  if (activeTab === "profit") renderProfit(panel);
}

function renderSuppliers(panel) {
  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("suppliers.title")}</h2>
        <p>${t("suppliers.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <form class="panel-card" id="supplierForm">
            <div class="field"><label>${t("suppliers.name")}</label><input id="supName" required></div>
            <div class="field"><label>${t("suppliers.country")}</label><input id="supCountry"></div>
            <div class="field"><label>${t("suppliers.contact")}</label><input id="supContact"></div>
            <div class="field"><label>${t("suppliers.email")}</label><input id="supEmail"></div>
            <div class="field"><label>${t("suppliers.notes")}</label><textarea id="supNotes"></textarea></div>
            <button class="btn btn-primary" type="submit">${t("suppliers.save")}</button>
          </form>
        </div>
        <div class="panel-main">
          <div class="table-wrap accent-table">
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>${t("suppliers.name")}</th><th>${t("suppliers.contact")}</th><th>${t("suppliers.email")}</th><th>İşlem</th>
                </tr>
              </thead>
              <tbody>
                ${state.suppliers.map((s, idx) => `
                  <tr>
                    <td>${s.id}</td>
                    <td>${s.name}</td>
                    <td>${s.contact || ""}</td>
                    <td>${s.email || ""}</td>
                    <td><button type="button" class="btn btn-danger" data-type="suppliers" data-del="${s.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $("#supplierForm").onsubmit = async (e) => {
    e.preventDefault();
    const supplier = {
      id: uid(),
      name: $("#supName").value.trim(),
      country: $("#supCountry").value.trim(),
      contact: $("#supContact").value.trim(),
      email: $("#supEmail").value.trim(),
      notes: $("#supNotes").value.trim()
    };
    if (!supplier.name) return;
    state.suppliers.push(supplier);
    await saveState();
    showMsg(t("messages.saved"));
    renderCurrentTab();
  };

  const supplierTable = panel.querySelector(".table-wrap");
  if (supplierTable) {
    supplierTable.onclick = async (e) => {
      const btn = e.target.closest("button[data-del]");
      if (!btn) return;
      state.suppliers = state.suppliers.filter((s) => s.id !== btn.dataset.del);
      await saveState();
      showMsg(t("messages.deleted"));
      renderCurrentTab();
    };
  }
}

function renderInvoices(panel) {
  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("invoices.title")}</h2>
        <p>${t("invoices.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <form class="panel-card" id="invoiceForm">
            <div class="field"><label>Tedarikçi *</label>
              <select id="invSupplier">${state.suppliers.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Fatura No</label><input id="invNo"></div>
            <div class="field"><label>Tarih</label><input type="date" id="invDate"></div>
            <div class="field"><label>Tutar</label><input id="invAmount" type="text" inputmode="decimal"></div>
            <div class="field"><label>Para Birimi</label><select id="invCurrency"><option>USD</option><option>TRY</option></select></div>
            <div class="field"><label>USD Tutar</label><input id="invUsd" type="text" readonly></div>
            <div class="field"><label>Kur (TRY→USD)</label><input id="invFx" type="text" readonly></div>
            <div class="field"><label>Belge (PDF/PNG/JPG)</label><input id="invFile" type="file"></div>
            <button class="btn btn-primary" type="submit">Faturayı Kaydet</button>
          </form>
        </div>
        <div class="panel-main">
          <div class="table-wrap accent-table">
            <table>
              <thead>
                <tr><th>No</th><th>Tedarikçi</th><th>Tutar</th><th>Durum</th><th>Wise</th><th>Belge</th><th>İşlem</th></tr>
              </thead>
              <tbody>
                ${state.invoices.map((i, idx) => `
                  <tr>
                    <td>${i.number || "-"}</td>
                    <td>${supplierName(i.supplierId)}</td>
                    <td>${formatters.currency.format(i.amountUsd || 0)}</td>
                    <td>${i.status || "open"}</td>
                    <td>${i.wiseRefMatch || (state.payments.some((p) => p.invoiceId === i.id) ? "Eşleşti" : "-")}</td>
                    <td>${i.fileId ? `<button class="btn" data-view="${i.fileId}">Görüntüle</button>` : "-"}</td>
                    <td><button type="button" class="btn btn-danger" data-type="invoices" data-del="${i.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $("#invAmount").oninput = async () => {
    const amt = parseMoney($("#invAmount").value);
    const cur = $("#invCurrency").value;
    const date = $("#invDate").value;
    if (cur === "TRY" && date) {
      const rate = await getFxRate(date);
      if (rate) {
        $("#invFx").value = rate.toFixed(4);
        $("#invUsd").value = (amt * rate).toFixed(2);
      }
    } else {
      $("#invFx").value = "";
      $("#invUsd").value = amt.toFixed(2);
    }
  };
  $("#invCurrency").onchange = () => $("#invAmount").dispatchEvent(new Event("input"));
  $("#invDate").onchange = () => $("#invAmount").dispatchEvent(new Event("input"));

  $("#invoiceForm").onsubmit = async (e) => {
    e.preventDefault();
    const amount = parseMoney($("#invAmount").value);
    const currency = $("#invCurrency").value;
    const date = $("#invDate").value || new Date().toISOString().slice(0,10);
    let fxRate = null;
    let amountUsd = amount;
    if (currency === "TRY") {
      fxRate = await getFxRate(date);
      if (!fxRate) return showMsg(t("messages.error"));
      amountUsd = amount * fxRate;
    }
    let fileId = null;
    const file = $("#invFile").files[0];
    if (file) {
      const uploaded = await uploadFile(file, "invoice", "");
      if (uploaded) fileId = uploaded.key;
    }
    state.invoices.push({
      id: uid(),
      supplierId: $("#invSupplier").value,
      number: $("#invNo").value,
      date,
      amountOriginal: amount,
      amountCurrency: currency,
      amountUsd,
      fxRate,
      status: "open",
      fileId
    });
    await saveState();
    showMsg(t("messages.saved"));
    renderCurrentTab();
    renderStats();
  };

  $$('button[data-view]').forEach((btn) => {
    btn.onclick = () => openFile(btn.dataset.view);
  });
  const invoiceTable = panel.querySelector(".table-wrap");
  if (invoiceTable) {
    invoiceTable.onclick = async (e) => {
      const btn = e.target.closest("button[data-del]");
      if (!btn) return;
      state.invoices = state.invoices.filter((i) => i.id !== btn.dataset.del);
      await saveState();
      renderCurrentTab();
      renderStats();
    };
  }
}

function renderPayments(panel) {
  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("payments.title")}</h2>
        <p>${t("payments.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <form class="panel-card" id="paymentForm">
            <div class="field"><label>İlgili Fatura</label>
              <select id="payInvoice"><option value="">Genel Ödeme</option>${state.invoices.map((i) => `<option value="${i.id}">${i.number || i.id}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Tutar</label><input id="payAmount" type="text" inputmode="decimal"></div>
            <div class="field"><label>Para Birimi</label><select id="payCurrency"><option>USD</option><option>TRY</option></select></div>
            <div class="field"><label>USD Tutar</label><input id="payUsd" type="text" readonly></div>
            <div class="field"><label>Kur (TRY→USD)</label><input id="payFx" type="text" readonly></div>
            <div class="field"><label>Tarih</label><input type="date" id="payDate"></div>
            <div class="field"><label>Wise Referans</label><input id="payWise"></div>
            <div class="field"><label>Dekont (PDF/PNG/JPG)</label><input id="payFile" type="file"></div>
            <button class="btn btn-primary" type="submit">Ödemeyi Kaydet</button>
          </form>
        </div>
        <div class="panel-main">
          <div class="table-wrap accent-table">
            <table>
              <thead>
                <tr><th>Tarih</th><th>Fatura</th><th>Tutar</th><th>Wise</th><th>Eşleşme</th><th>Belge</th><th>İşlem</th></tr>
              </thead>
              <tbody>
                ${state.payments.map((p, idx) => `
                  <tr>
                    <td>${p.date || ""}</td>
                    <td>${p.invoiceId ? (state.invoices.find(i => i.id === p.invoiceId)?.number || "-") : "Genel"}</td>
                    <td>${formatters.currency.format(p.amountUsd || 0)}</td>
                    <td>${p.wiseRef || "-"}</td>
                    <td>${p.invoiceId ? "Eşleşti" : "Bekliyor"}</td>
                    <td>${p.fileId ? `<button class="btn" data-view="${p.fileId}">Görüntüle</button>` : "-"}</td>
                    <td><button type="button" class="btn btn-danger" data-type="payments" data-del="${p.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $("#payAmount").oninput = async () => {
    const amt = parseMoney($("#payAmount").value);
    const cur = $("#payCurrency").value;
    const invoiceId = $("#payInvoice").value;
    const invoiceDate = invoiceId ? (state.invoices.find((i) => i.id === invoiceId)?.date || "") : "";
    const date = invoiceDate || $("#payDate").value;
    if (cur === "TRY" && date) {
      const rate = await getFxRate(date);
      if (rate) {
        $("#payFx").value = rate.toFixed(4);
        $("#payUsd").value = (amt * rate).toFixed(2);
      }
    } else {
      $("#payFx").value = "";
      $("#payUsd").value = amt.toFixed(2);
    }
  };
  $("#payCurrency").onchange = () => $("#payAmount").dispatchEvent(new Event("input"));
  $("#payDate").onchange = () => $("#payAmount").dispatchEvent(new Event("input"));
  $("#payInvoice").onchange = () => $("#payAmount").dispatchEvent(new Event("input"));

  $("#paymentForm").onsubmit = async (e) => {
    e.preventDefault();
    const amount = parseMoney($("#payAmount").value);
    const currency = $("#payCurrency").value;
    const invoiceId = $("#payInvoice").value || null;
    const invoiceDate = invoiceId ? (state.invoices.find((i) => i.id === invoiceId)?.date || "") : "";
    const date = $("#payDate").value || invoiceDate || new Date().toISOString().slice(0,10);
    let fxRate = null;
    let amountUsd = amount;
    if (currency === "TRY") {
      fxRate = await getFxRate(date);
      if (!fxRate) return showMsg(t("messages.error"));
      amountUsd = amount * fxRate;
    }
    let fileId = null;
    const file = $("#payFile").files[0];
    if (file) {
      const uploaded = await uploadFile(file, "payment", "");
      if (uploaded) fileId = uploaded.key;
    }
    state.payments.push({
      id: uid(),
      invoiceId,
      date,
      amountOriginal: amount,
      amountCurrency: currency,
      amountUsd,
      fxRate,
      wiseRef: $("#payWise").value,
      fileId
    });
    await saveState();
    showMsg(t("messages.saved"));
    renderCurrentTab();
    renderStats();
  };

  $$('button[data-view]').forEach((btn) => btn.onclick = () => openFile(btn.dataset.view));
}

function renderDocuments(panel) {
  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("documents.title")}</h2>
        <p>${t("documents.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <form class="panel-card" id="docForm">
            <div class="field"><label>Başlık</label><input id="docTitle"></div>
            <div class="field"><label>Tarih</label><input type="date" id="docDate"></div>
            <div class="field"><label>İlgili Fatura</label>
              <select id="docInvoice"><option value="">-</option>${state.invoices.map((i) => `<option value="${i.id}">${i.number || i.id}</option>`).join("")}</select>
            </div>
            <div class="field"><label>Belge</label><input id="docFile" type="file"></div>
            <button class="btn btn-primary" type="submit">Evrak Kaydet</button>
          </form>
        </div>
        <div class="panel-main">
          <div class="table-wrap">
            <table>
              <thead>
                <tr><th>Başlık</th><th>Tarih</th><th>Fatura</th><th>Belge</th><th>İşlem</th></tr>
              </thead>
              <tbody>
                ${state.documents.map((d, idx) => `
                  <tr>
                    <td>${d.title || "-"}</td>
                    <td>${d.date || ""}</td>
                    <td>${d.invoiceId ? (state.invoices.find(i => i.id === d.invoiceId)?.number || "-") : "-"}</td>
                    <td>${d.fileId ? `<button class="btn" data-view="${d.fileId}">Görüntüle</button>` : "-"}</td>
                    <td><button type="button" class="btn btn-danger" data-type="documents" data-del="${d.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $("#docForm").onsubmit = async (e) => {
    e.preventDefault();
    let fileId = null;
    const file = $("#docFile").files[0];
    if (file) {
      const uploaded = await uploadFile(file, "doc", "");
      if (uploaded) fileId = uploaded.key;
    }
    state.documents.push({
      id: uid(),
      title: $("#docTitle").value,
      date: $("#docDate").value,
      invoiceId: $("#docInvoice").value || null,
      fileId
    });
    await saveState();
    showMsg(t("messages.saved"));
    renderCurrentTab();
    renderStats();
  };

  $$('button[data-view]').forEach((btn) => btn.onclick = () => openFile(btn.dataset.view));
}

async function renderFiles(panel) {
  const files = await refreshFiles();
  panel.innerHTML = `
    <div class="section">
      <div class="section-header"><h2>${t("files.title")}</h2></div>
      <div class="table-wrap accent-table">
        <table>
          <thead><tr><th>Ad</th><th>Kategori</th><th>Tarih</th><th>İşlem</th></tr></thead>
          <tbody>
            ${files.map((f) => `
              <tr>
                <td>${f.name}</td>
                <td>${f.category || "-"}</td>
                <td>${f.date || ""}</td>
                <td>
                  <button class="btn" data-view="${f.key}">Görüntüle</button>
                  <button class="btn btn-danger" data-del-file="${f.key}">Sil</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      </div>
    </div>
  `;
  $$('button[data-view]').forEach((btn) => btn.onclick = () => openFile(btn.dataset.view));
  $$('button[data-del-file]').forEach((btn) => btn.onclick = () => deleteFile(btn.dataset.delFile));
}

function renderQC(panel) {
  const filter = $("#qcFilter")?.value || "all";
  const list = state.qcRecords.filter((q) => {
    const status = q.status || qcStatus(q.score || 0);
    if (filter === "all") return true;
    if (filter === "pass") return status === "pass";
    if (filter === "fail") return status === "fail";
    if (filter === "rework") return status === "rework";
    return true;
  });
  panel.innerHTML = `
    <div class="section">
      <div class="section-header"><h2>${t("qc.title")}</h2></div>
      <div class="panel-grid">
        <div class="panel-side">
          <form class="panel-card" id="qcForm">
            <div class="field"><label>Fatura</label><select id="qcInvoice">${state.invoices.map((i) => `<option value="${i.id}">${i.number || i.id}</option>`).join("")}</select></div>
            <div class="field"><label>Video (MP4/MOV)</label><input id="qcVideo" type="file"></div>
            <div class="field"><label>Fotoğraflar</label><input id="qcPhotos" type="file" multiple></div>
            <div class="field"><label>SLA (1-2 gün)</label><input id="qcSlaOk" type="checkbox"></div>
            <div class="field"><label>Video 6-8 dk</label><input id="qcVideoOk" type="checkbox"></div>
            <div class="field"><label>Multi-angle</label><input id="qcMultiOk" type="checkbox"></div>
            <button class="btn btn-primary" type="submit">Kaydet</button>
          </form>
        </div>
        <div class="panel-main">
          <div class="panel-card" style="margin-bottom:12px">
            <div class="field">
              <label>Filtre</label>
              <select id="qcFilter">
                <option value="all">Tümü</option>
                <option value="pass">Pass</option>
                <option value="rework">Rework</option>
                <option value="fail">Fail</option>
              </select>
            </div>
          </div>
          <div class="table-wrap accent-table">
            <table>
              <thead><tr><th>Fatura</th><th>Video OK</th><th>Multi OK</th><th>Skor</th><th>Durum</th></tr></thead>
              <tbody>
                ${list.map((q) => `
                  <tr>
                    <td>${state.invoices.find(i => i.id === q.invoiceId)?.number || "-"}</td>
                    <td>${q.videoOk ? "✅" : "—"}</td>
                    <td>${q.multiOk ? "✅" : "—"}</td>
                    <td>${q.score}</td>
                    <td>${qcStatusLabel(q.status || qcStatus(q.score || 0))}</td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  $("#qcForm").onsubmit = async (e) => {
    e.preventDefault();
    const invoiceId = $("#qcInvoice").value;
    const videoFile = $("#qcVideo").files[0];
    let videoFileId = null;
    if (videoFile) {
      const uploaded = await uploadFile(videoFile, "qc", invoiceId);
      if (uploaded) videoFileId = uploaded.key;
    }
    const photoFiles = Array.from($("#qcPhotos").files || []);
    const photoIds = [];
    for (const f of photoFiles) {
      const up = await uploadFile(f, "qc", invoiceId);
      if (up?.key) photoIds.push(up.key);
    }
    const slaOk = $("#qcSlaOk").checked;
    const score = (slaOk ? 40 : 0) + ($("#qcVideoOk").checked ? 30 : 0) + ($("#qcMultiOk").checked ? 30 : 0);
    const status = qcStatus(score);
    state.qcRecords.push({
      id: uid(),
      invoiceId,
      qcVideoFileId: videoFileId,
      qcPhotoFileIds: photoIds,
      slaOk,
      videoOk: $("#qcVideoOk").checked,
      multiOk: $("#qcMultiOk").checked,
      score,
      status
    });
    await saveState();
    showMsg(t("messages.saved"));
    renderCurrentTab();
  };
  const qcFilter = $("#qcFilter");
  if (qcFilter) {
    qcFilter.value = filter;
    qcFilter.onchange = renderCurrentTab;
  }
}

function renderAmazon(panel) {
  const ops = state.amazonOps || defaultState().amazonOps;
  const ppc = ops.ppc || { adSpend: "", adSales: "", totalSales: "" };
  const inv = ops.inventory || { unitsSold90: "", avgInventory: "", ipi: "" };
  const brand = ops.brand || { keywords: "", notes: "" };
  const pricing = ops.pricing || { targetPrice: "", minProfit: "", currentPrice: "", notes: "" };
  const experiments = ops.experiments || [];
  const launch = ops.launch || { items: [] };

  const adSpend = parseMoney(ppc.adSpend);
  const adSales = parseMoney(ppc.adSales);
  const totalSales = parseMoney(ppc.totalSales);
  const acos = adSales > 0 ? (adSpend / adSales) * 100 : 0;
  const roas = adSpend > 0 ? (adSales / adSpend) : 0;
  const tacos = totalSales > 0 ? (adSpend / totalSales) * 100 : 0;

  const unitsSold90 = parseMoney(inv.unitsSold90);
  const avgInventory = parseMoney(inv.avgInventory);
  const sellThrough = avgInventory > 0 ? (unitsSold90 / avgInventory) : 0;

  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("amazon.title")}</h2>
        <p>${t("amazon.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <div class="panel-card">
            <div class="field"><label>Ad Spend ($)</label><input id="ppcSpend" value="${ppc.adSpend}" inputmode="decimal"></div>
            <div class="field"><label>Ad Sales ($)</label><input id="ppcSales" value="${ppc.adSales}" inputmode="decimal"></div>
            <div class="field"><label>Total Sales ($)</label><input id="ppcTotal" value="${ppc.totalSales}" inputmode="decimal"></div>
          </div>
          <div class="panel-card" style="margin-top:16px">
            <div class="field"><label>90 Gün Satış Adedi</label><input id="invSold" value="${inv.unitsSold90}" inputmode="decimal"></div>
            <div class="field"><label>Ortalama Stok</label><input id="invAvg" value="${inv.avgInventory}" inputmode="decimal"></div>
            <div class="field"><label>IPI (manuel)</label><input id="invIpi" value="${inv.ipi}"></div>
          </div>
        </div>
        <div class="panel-main">
          <div class="panel-card accent">
            <div class="kpi-label">${t("amazon.ppc.title")}</div>
            <div class="kpi-value">ACoS %${formatters.number.format(acos)}</div>
            <div class="kpi-sub">ROAS ${formatters.number.format(roas)} • TACoS %${formatters.number.format(tacos)}</div>
          </div>
          <div class="kpi-grid" style="margin-top:16px">
            <div class="kpi-card accent"><div class="kpi-label">${t("amazon.inventory.title")}</div><div class="kpi-value">${formatters.number.format(sellThrough)}x</div><div class="kpi-sub">Sell-through (90g)</div></div>
            <div class="kpi-card accent"><div class="kpi-label">IPI</div><div class="kpi-value">${inv.ipi || "—"}</div><div class="kpi-sub">Manuel giriş</div></div>
          </div>

          <div class="panel-card" style="margin-top:16px">
            <div class="section-header" style="padding:0 0 12px;border:none">
              <h2 style="font-size:14px;margin:0">${t("amazon.experiments.title")}</h2>
            </div>
            <div class="panel-grid" style="grid-template-columns: 1fr 1fr; padding:0; gap:12px;">
              <div class="field"><label>Test Adı</label><input id="expName"></div>
              <div class="field"><label>Başlangıç</label><input id="expStart" type="date"></div>
              <div class="field"><label>Bitiş</label><input id="expEnd" type="date"></div>
              <div class="field"><label>Kazanan</label><input id="expWinner"></div>
              <div class="field" style="grid-column: span 2;"><label>Not</label><input id="expNote"></div>
            </div>
            <button class="btn btn-primary" id="expAdd" style="margin-top:8px">Ekle</button>
            <div class="table-wrap accent-table" style="margin-top:12px">
              <table>
                <thead><tr><th>Test</th><th>Tarih</th><th>Kazanan</th><th>Not</th><th>İşlem</th></tr></thead>
                <tbody>
                  ${experiments.map((e) => `
                    <tr>
                      <td>${e.name}</td>
                      <td>${e.start || "-"} → ${e.end || "-"}</td>
                      <td>${e.winner || "-"}</td>
                      <td>${e.note || "-"}</td>
                      <td><button type="button" class="btn btn-danger" data-type="experiments" data-del="${e.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
            </div>
          </div>

          <div class="panel-grid" style="grid-template-columns: 1fr 1fr; padding:0; gap:16px; margin-top:16px;">
            <div class="panel-card">
              <div class="kpi-label">${t("amazon.brand.title")}</div>
              <div class="field"><label>Top Keywords (virgülle)</label><input id="brandKeywords" value="${brand.keywords}"></div>
              <div class="field"><label>Notlar</label><textarea id="brandNotes">${brand.notes}</textarea></div>
            </div>
            <div class="panel-card">
              <div class="kpi-label">${t("amazon.pricing.title")}</div>
              <div class="field"><label>Hedef Fiyat</label><input id="priceTarget" value="${pricing.targetPrice}" inputmode="decimal"></div>
              <div class="field"><label>Minimum Kâr</label><input id="priceMin" value="${pricing.minProfit}" inputmode="decimal"></div>
              <div class="field"><label>Mevcut Fiyat</label><input id="priceCurrent" value="${pricing.currentPrice}" inputmode="decimal"></div>
              <div class="field"><label>Not</label><textarea id="priceNotes">${pricing.notes}</textarea></div>
            </div>
          </div>
          <div class="panel-card accent" style="margin-top:16px">
            <div class="section-header" style="padding:0 0 12px;border:none">
              <h2 style="font-size:14px;margin:0">${t("amazon.launch.title")}</h2>
            </div>
            <div class="panel-grid" style="grid-template-columns: 1fr 120px; padding:0; gap:12px;">
              <div class="field"><label>Görev</label><input id="launchTitle"></div>
              <div class="field"><label>Hedef</label><input id="launchDue" type="date"></div>
            </div>
            <button class="btn btn-primary" id="launchAdd" style="margin-top:8px">${t("amazon.launch.add")}</button>
            <div class="table-wrap accent-table" style="margin-top:12px">
              <table>
                <thead><tr><th>Durum</th><th>Görev</th><th>Hedef</th><th>İşlem</th></tr></thead>
                <tbody>
                  ${launch.items.length ? launch.items.map((item) => `
                    <tr>
                      <td><input type="checkbox" data-launch-toggle="${item.id}" ${item.done ? "checked" : ""}></td>
                      <td>${item.title}</td>
                      <td>${item.due || "-"}</td>
                      <td><button type="button" class="btn btn-danger" data-type="launch" data-del="${item.id || ""}" data-del-idx="${idx}" onclick="window.__jumviDeleteFromBtn(this)">Sil</button></td>
                    </tr>
                  `).join("") : `<tr><td colspan="4">${t("amazon.launch.empty")}</td></tr>`}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  const bind = (id, path) => {
    const el = $(id);
    if (!el) return;
    el.oninput = async () => {
      const [group, key] = path;
      state.amazonOps[group][key] = el.value;
      await saveState();
      renderCurrentTab();
    };
  };
  bind("#ppcSpend", ["ppc", "adSpend"]);
  bind("#ppcSales", ["ppc", "adSales"]);
  bind("#ppcTotal", ["ppc", "totalSales"]);
  bind("#invSold", ["inventory", "unitsSold90"]);
  bind("#invAvg", ["inventory", "avgInventory"]);
  bind("#invIpi", ["inventory", "ipi"]);
  bind("#brandKeywords", ["brand", "keywords"]);
  bind("#brandNotes", ["brand", "notes"]);
  bind("#priceTarget", ["pricing", "targetPrice"]);
  bind("#priceMin", ["pricing", "minProfit"]);
  bind("#priceCurrent", ["pricing", "currentPrice"]);
  bind("#priceNotes", ["pricing", "notes"]);

  const launchAdd = $("#launchAdd");
  if (launchAdd) {
    launchAdd.onclick = async () => {
      const title = $("#launchTitle").value.trim();
      if (!title) return;
      const due = $("#launchDue").value;
      state.amazonOps.launch.items.push({ id: uid(), title, due, done: false });
      await saveState();
      renderCurrentTab();
    };
  }
  $$('input[data-launch-toggle]').forEach((el) => {
    el.onchange = async () => {
      const item = state.amazonOps.launch.items.find((i) => i.id === el.dataset.launchToggle);
      if (item) item.done = el.checked;
      await saveState();
      renderCurrentTab();
    };
  });
  // launch delete handled globally

  const addBtn = $("#expAdd");
  if (addBtn) {
    addBtn.onclick = async () => {
      const exp = {
        id: uid(),
        name: $("#expName").value.trim(),
        start: $("#expStart").value,
        end: $("#expEnd").value,
        winner: $("#expWinner").value.trim(),
        note: $("#expNote").value.trim()
      };
      if (!exp.name) return;
      state.amazonOps.experiments.push(exp);
      await saveState();
      renderCurrentTab();
    };
  }
  // experiments delete handled globally
}

function renderProfit(panel) {
  const calc = state.revenueCalc;
  const price = parseMoney(calc.price);
  const productCost = parseMoney(calc.productCost);
  const feePercentRaw = String(calc.amazonFeePercent ?? "").trim();
  let feePercent = parseMoney(feePercentRaw);
  if (!feePercentRaw) feePercent = 15;
  const amazonFees = price > 0 ? (price * (feePercent / 100)) : 0;
  const fba = parseMoney(calc.fbaFulfillment) || 0;
  const storage = parseMoney(calc.storage) || 0;
  const inbound = parseMoney(calc.inbound) || 0;
  const extraFee = 1;
  const tacos = parseMoney(calc.tacosPercent);
  const qty = Number(calc.qty) || 0;
  const refund = parseMoney(calc.refundPercent);

  const unitCost = productCost + amazonFees + fba + storage + inbound + extraFee;
  const unitProfitBeforeAds = price - unitCost;
  const revenue = price * qty;
  const adSpend = revenue * (tacos / 100);
  const adsPerUnit = qty > 0 ? adSpend / qty : 0;
  const unitProfit = unitProfitBeforeAds - adsPerUnit;
  const netProfit = unitProfit * qty;
  const netProfitAfterRefund = netProfit * (1 - refund / 100);
  const netMargin = revenue > 0 ? (netProfitAfterRefund / revenue) * 100 : 0;
  const roi = productCost > 0 ? (unitProfit / productCost) * 100 : 0;
  const breakEven = price > 0 ? (unitProfitBeforeAds / price) * 100 : 0;

  const ultPrice = parseMoney(calc.ultPrice);
  const ultCost = parseMoney(calc.ultCost);
  const ultCommission = parseMoney(calc.ultCommission);
  const ultQty = parseMoney(calc.ultQty);
  const ultStock = parseMoney(calc.ultStock);
  const ultAds = parseMoney(calc.ultAds);
  const ultRefund = parseMoney(calc.ultRefund);
  const ultTax = parseMoney(calc.ultTax);
  const ultFx = parseMoney(calc.ultFx);

  const ultRevenue = ultPrice * ultQty;
  const ultCommissionCost = ultRevenue * (ultCommission / 100);
  const ultAdsPerUnit = ultQty > 0 ? (ultAds / ultQty) : 0;
  const ultUnitProfit = ultPrice - (ultCost + (ultPrice * (ultCommission / 100)) + ultAdsPerUnit);
  const ultNetProfit = (ultUnitProfit * ultQty) - (ultRevenue * (ultRefund / 100)) - (ultRevenue * (ultTax / 100));
  const ultNetMargin = ultRevenue > 0 ? (ultNetProfit / ultRevenue) * 100 : 0;
  const ultTacos = ultRevenue > 0 ? (ultAds / ultRevenue) * 100 : 0;
  const ultInventoryDays = ultQty > 0 ? Math.round(ultStock / (ultQty / 30)) : 0;
  const ultBreakEven = (ultPrice - ultCost - (ultPrice * (ultCommission / 100))) > 0
    ? Math.ceil(ultAds / (ultPrice - ultCost - (ultPrice * (ultCommission / 100))))
    : 0;
  const ultGoalPct = Math.round((ultNetProfit / 3000) * 100);

  panel.innerHTML = `
    <div class="section">
      <div class="section-header">
        <h2>${t("profit.title")}</h2>
        <p>${t("profit.desc")}</p>
      </div>
      <div class="panel-grid">
        <div class="panel-side">
          <div class="panel-card">
            <div class="field"><label>Satış fiyatı</label><input id="pPrice" value="${calc.price}"></div>
            <div class="field"><label>Ürün maliyeti</label><input id="pCost" value="${calc.productCost}"></div>
            <div class="field"><label>TACoS %</label><input id="pTacos" value="${calc.tacosPercent}"></div>
            <div class="field"><label>Aylık satış</label><input id="pQty" value="${calc.qty}"></div>
            <div class="field"><label>İade %</label><input id="pRefund" value="${calc.refundPercent}"></div>
          </div>
        </div>
        <div class="panel-main">
          <div class="panel-card">
            <div class="kpi-label">Aylık Net Kâr</div>
            <div class="kpi-value">${formatters.currency.format(netProfitAfterRefund)}</div>
            <div class="kpi-sub">Net marj %${formatters.number.format(netMargin)}</div>
          </div>
          <div class="kpi-grid" style="margin-top:16px">
            <div class="kpi-card"><div class="kpi-label">Birim Kâr</div><div class="kpi-value">${formatters.currency.format(unitProfit)}</div></div>
            <div class="kpi-card"><div class="kpi-label">Net Marj</div><div class="kpi-value">%${formatters.number.format(netMargin)}</div></div>
            <div class="kpi-card"><div class="kpi-label">ROI</div><div class="kpi-value">%${formatters.number.format(roi)}</div></div>
            <div class="kpi-card"><div class="kpi-label">Break-even ACoS</div><div class="kpi-value">%${formatters.number.format(breakEven)}</div></div>
          </div>

          <!-- JUMVI ULTIMATE kaldırıldı -->
        </div>
      </div>
    </div>
  `;

  const bind = (id, key) => {
    const el = $(id);
    if (!el) return;
    const debouncedSave = debounce(() => saveState(), 250);
    el.oninput = () => {
      state.revenueCalc[key] = el.value;
      debouncedSave();
    };
    el.onchange = () => renderCurrentTab();
    el.onblur = () => renderCurrentTab();
  };
  bind("#pPrice", "price");
  bind("#pCost", "productCost");
  bind("#pTacos", "tacosPercent");
  bind("#pQty", "qty");
  bind("#pRefund", "refundPercent");
  // Ultimate inputs removed
}

async function uploadFile(file, category, relatedId) {
  const form = new FormData();
  form.append("file", file);
  form.append("category", category);
  form.append("relatedId", relatedId || "");
  const res = await fetch("/panel/api/upload", { method: "POST", body: form });
  if (!res.ok) return null;
  return await res.json();
}

async function openFile(key) {
  try {
    let res = await fetch(`/panel/api/file-url/${encodeURIComponent(key)}`);
    if (res.status === 401 || res.status === 403) {
      const pin = prompt("Dosya PIN gir");
      if (!pin) return;
      res = await fetch(`/panel/api/file-url/${encodeURIComponent(key)}?pin=${encodeURIComponent(pin)}`);
    }
    if (!res.ok) {
      showMsg(t("messages.unauthorized"), "error");
      return;
    }
    const data = await res.json().catch(() => null);
    if (data?.url) window.open(data.url, "_blank");
    else showMsg(t("messages.error"), "error");
  } catch {
    showMsg(t("messages.error"), "error");
  }
}

async function deleteFile(key, opts = {}) {
  if (!opts.silent && !confirm("Dosya silinsin mi?")) return;
  try {
    let res = await fetch(`/panel/api/file/${encodeURIComponent(key)}`, { method: "DELETE" });
    if (res.status === 401 || res.status === 403) {
      const pin = prompt("Dosya PIN gir");
      if (!pin) return;
      res = await fetch(`/panel/api/file/${encodeURIComponent(key)}?pin=${encodeURIComponent(pin)}`, { method: "DELETE" });
    }
    if (!res.ok) {
      showMsg(t("messages.error"), "error");
      return;
    }
    fileCache = fileCache.filter((f) => f.key !== key);
    fileCacheAt = 0;
    showMsg(t("messages.deleted"));
    renderCurrentTab();
  } catch {
    showMsg(t("messages.error"), "error");
  }
}

function setupTabs() {
  $$(".tab").forEach((tab) => {
    tab.onclick = () => {
      activeTab = tab.dataset.tab;
      $$(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderCurrentTab();
    };
  });
}

function setupMenu() {
  $("#exportMenuBtn").onclick = () => $("#exportMenu").classList.toggle("open");
  $("#exportMenu").onclick = (e) => {
    const type = e.target.dataset.export;
    if (!type) return;
    if (type === "csv") exportCsv();
    if (type === "xlsx") exportXlsx();
    if (type === "json") exportJson();
    if (type === "summary") exportSummary();
    $("#exportMenu").classList.remove("open");
  };
  $("#importBtn").onclick = importData;
  $("#clearBtn").onclick = async () => {
    if (!confirm("Tüm veriler silinsin mi?")) return;
    state = defaultState();
    await saveState();
    renderStats();
    renderCurrentTab();
  };
  $("#langSelect").value = lang;
  $("#langSelect").onchange = (e) => {
    lang = e.target.value;
    localStorage.setItem(LANG_KEY, lang);
    applyI18n();
    renderStats();
    renderCurrentTab();
  };
}

function exportCsv() {
  const headers = ["ID","Type","Supplier","Date","Amount","Currency","Status","Note"];
  const lines = [headers.join(",")];
  const rows = [...state.invoices.map(i => ({
    id: i.id, type: "invoice", supplier: supplierName(i.supplierId), date: i.date, amount: i.amountUsd, currency: "USD", status: i.status, note: i.number
  })), ...state.payments.map(p => ({
    id: p.id, type: "payment", supplier: supplierName(state.invoices.find(i => i.id === p.invoiceId)?.supplierId), date: p.date, amount: p.amountUsd, currency: "USD", status: "completed", note: p.wiseRef
  }))];
  rows.forEach((r) => {
    lines.push([r.id, r.type, r.supplier, r.date, r.amount, r.currency, r.status, r.note].map(csvEscape).join(","));
  });
  downloadBlob(new Blob([lines.join("\n")], { type: "text/csv" }), "records.csv");
}

function exportJson() {
  downloadBlob(new Blob([JSON.stringify(state, null, 2)], { type: "application/json" }), "jumvi_state.json");
}

function exportXlsx() {
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.suppliers), "Suppliers");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.invoices), "Invoices");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.payments), "Payments");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.documents), "Documents");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(state.qcRecords), "QC");
  const ops = state.amazonOps || defaultState().amazonOps;
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([ops.ppc]), "Amazon_PPC");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([ops.inventory]), "Amazon_Inventory");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ops.experiments || []), "Amazon_Experiments");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([ops.brand]), "Amazon_BrandNotes");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([ops.pricing]), "Amazon_Pricing");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(ops.launch?.items || []), "Amazon_Launch");
  XLSX.writeFile(wb, "jumvi_export.xlsx");
}

function exportSummary() {
  const ops = state.amazonOps || defaultState().amazonOps;
  const summary = {
    suppliers: state.suppliers.length,
    invoices: state.invoices.length,
    payments: state.payments.length,
    documents: state.documents.length,
    amazonOps: {
      experiments: ops.experiments?.length || 0,
      launchTasks: ops.launch?.items?.length || 0
    }
  };
  downloadBlob(new Blob([JSON.stringify(summary, null, 2)], { type: "application/json" }), "summary.json");
}

function csvEscape(val) {
  const str = String(val ?? "");
  if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
  return str;
}

function downloadBlob(blob, filename) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

async function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".json,.csv";
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const text = await file.text();
    if (file.name.endsWith(".json")) {
      const data = JSON.parse(text);
      state = migrateState(data);
      await saveState();
      renderStats();
      renderCurrentTab();
    } else {
      showMsg("CSV import sınırlı", "error");
    }
  };
  input.click();
}

function supplierName(id) {
  const s = state.suppliers.find((x) => x.id === id);
  return s ? s.name : "-";
}

window.addEventListener("load", async () => {
  await loadState();
  applyI18n();
  setupTabs();
  setupMenu();
  renderStats();
  renderCurrentTab();
  const panel = $("#mainPanel");
  if (panel) {
    panel.addEventListener("click", async (e) => {
      const delBtn = e.target.closest("button[data-del]");
      if (!delBtn) return;
      e.preventDefault();
      const id = delBtn.dataset.del;
      const idx = delBtn.dataset.delIdx;
      const type = delBtn.dataset.type || activeTab;
      await window.__jumviDelete(type, id, idx);
    });
  }
});
