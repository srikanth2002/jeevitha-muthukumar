/**
 * Jeevitha / Muthukumar invitation: public wishes for Google Sheets.
 * HOW TO: Make a new Google Sheet, Extensions > Apps Script, paste this entire
 * file, Save; Deploy > New deployment > Web app > Execute as Me,
 * Access: Anyone. Copy the Web App's /exec URL into VITE_WISHES_SCRIPT_URL.
 * Messages are public. In the Wishes sheet set Approved to NO to hide one.
 */
var WISHES_SHEET = 'Wishes';
var HEADERS = ['ID', 'CreatedAt', 'Name', 'Message', 'Approved'];
var MAX_VISIBLE = 150;
var MAX_SCAN = 400;

function getWishSheet_() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Bind this script to a Google Sheet first.');
  var sheet = spreadsheet.getSheetByName(WISHES_SHEET);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(WISHES_SHEET);
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 270);
    sheet.setColumnWidth(2, 200);
    sheet.setColumnWidth(3, 170);
    sheet.setColumnWidth(4, 480);
    sheet.setColumnWidth(5, 110);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
  }
  return sheet;
}

function normalize_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}
function sheetSafe_(value) {
  return /^[=+@\-]/.test(value) ? "'" + value : value;
}
function stripCellPrefix_(value) {
  return String(value || '').replace(/^'(?=[=+@\-])/, '');
}
function jsonResponse_(data, callback) {
  var payload = JSON.stringify(data).replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  var cb = String(callback || '');
  if (/^__invitationWishesCallback\d+$/.test(cb)) {
    return ContentService.createTextOutput(cb + '(' + payload + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
function listWishes_() {
  var sheet = getWishSheet_();
  var last = sheet.getLastRow();
  if (last < 2) return [];
  var first = Math.max(2, last - MAX_SCAN + 1);
  var values = sheet.getRange(first, 1, last - first + 1, 5).getValues();
  var list = [];
  for (var i = values.length - 1; i >= 0; i--) {
    var row = values[i];
    if (String(row[4]).toUpperCase() !== 'YES') continue;
    var when = row[1] instanceof Date ? row[1].toISOString() : String(row[1] || '');
    list.push({ id: String(row[0]), createdAt: when, name: stripCellPrefix_(row[2]), message: stripCellPrefix_(row[3]) });
    if (list.length >= MAX_VISIBLE) break;
  }
  return list;
}
function doGet(e) {
  try {
    return jsonResponse_({ ok: true, wishes: listWishes_() }, e && e.parameter && e.parameter.callback);
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) }, e && e.parameter && e.parameter.callback);
  }
}
function doPost(e) {
  var params = (e && e.parameter) || {};
  try {
    if (params.action !== 'wish') return jsonResponse_({ ok: false, error: 'Unknown action' }, '');
    if (String(params.website || '').trim() !== '') return jsonResponse_({ ok: false, error: 'Invalid request' }, '');
    var id = normalize_(params.id, 80);
    var name = normalize_(params.name, 40);
    var msg = normalize_(params.message, 220);
    if (!/^w-\d{13}-[a-z0-9]{5,12}$/.test(id) || name.length < 2 || msg.length < 6 || /https?:\/\/|www\./i.test(msg)) {
      return jsonResponse_({ ok: false, error: 'Invalid wish' }, '');
    }
    var lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return jsonResponse_({ ok: false, error: 'Please retry later' }, '');
    try {
      var sheet = getWishSheet_();
      var last = sheet.getLastRow();
      var start = Math.max(2, last - 80);
      if (last >= start) {
        var recent = sheet.getRange(start, 1, last - start + 1, 4).getValues();
        for (var i = 0; i < recent.length; i++) {
          if (String(recent[i][0]) === id) return jsonResponse_({ ok: true, duplicate: true }, '');
          if (String(recent[i][2]).toLowerCase() === sheetSafe_(name).toLowerCase() && String(recent[i][3]) === sheetSafe_(msg)) {
            return jsonResponse_({ ok: false, error: 'Duplicate wish' }, '');
          }
        }
      }
      sheet.appendRow([id, new Date(), sheetSafe_(name), sheetSafe_(msg), 'YES']);
    } finally { lock.releaseLock(); }
    return jsonResponse_({ ok: true }, '');
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) }, '');
  }
}

// Run this manually in the Apps Script editor once to initialize and authorize.
function setup() {
  getWishSheet_();
  Logger.log('Wishes sheet ready. Deploy the web app next.');
}
