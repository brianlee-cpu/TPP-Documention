/**
 * Remarks store for the eMAX Field Mapping docs page.
 *
 * Paste this into Extensions > Apps Script of the Google Sheet, set the script
 * property EDIT_KEY, and deploy as a Web app (Execute as: Me, Who has access: Anyone).
 * The page reads remarks with GET and saves one remark per POST.
 *
 * Sheet "Remarks": Key | Remark | UpdatedBy | UpdatedAt
 * Key = "<tableId>|<field>", e.g. "t-sales-header|InvoiceDate".
 */
const SHEET_NAME = 'Remarks';

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(['Key', 'Remark', 'UpdatedBy', 'UpdatedAt']);
    sh.setFrozenRows(1);
  }
  return sh;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Stops a remark starting with = + - @ from being run as a spreadsheet formula.
function plain_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

// GET: every remark, keyed by field.
function doGet() {
  const sh = sheet_();
  const rows = sh.getLastRow() > 1 ? sh.getRange(2, 1, sh.getLastRow() - 1, 4).getValues() : [];
  const remarks = {};
  rows.forEach(function (r) {
    if (r[0] && String(r[1]) !== '') {
      remarks[String(r[0])] = {
        text: String(r[1]),
        by: String(r[2] || ''),
        at: r[3] instanceof Date ? r[3].toISOString() : String(r[3] || '')
      };
    }
  });
  return json_({ ok: true, remarks: remarks });
}

// POST {key, text, by, editKey}: add, change or (empty text) remove one remark.
function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: 'Bad request' }); }

  const editKey = PropertiesService.getScriptProperties().getProperty('EDIT_KEY');
  if (!editKey || body.editKey !== editKey) return json_({ ok: false, error: 'Wrong edit key' });

  const key = String(body.key || '').slice(0, 200);
  const text = String(body.text || '').trim().slice(0, 5000);
  const by = String(body.by || '').trim().slice(0, 100);
  if (!/^t-[a-z-]+\|.+/.test(key)) return json_({ ok: false, error: 'Bad key' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const last = sh.getLastRow();
    const keys = last > 1 ? sh.getRange(2, 1, last - 1, 1).getValues().map(function (r) { return String(r[0]); }) : [];
    const i = keys.indexOf(key);
    if (i >= 0) {
      if (text) sh.getRange(i + 2, 2, 1, 3).setValues([[plain_(text), plain_(by), new Date()]]);
      else sh.deleteRow(i + 2);
    } else if (text) {
      sh.appendRow([key, plain_(text), plain_(by), new Date()]);
    }
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}
