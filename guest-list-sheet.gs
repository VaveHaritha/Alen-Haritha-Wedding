/**
 * Haritha & Alen — guest lists for the wedding invite.
 *
 * Every RSVP and performance sign-up from the invite is saved into two Google Sheets:
 *   Engagement (Wed 20 Jan)  → ENGAGEMENT_SHEET_ID
 *   Wedding (Mon 25 Jan)     → WEDDING_SHEET_ID
 *
 * Setup (once):
 *   1. Open the engagement sheet › Extensions › Apps Script, paste this whole file, save.
 *   2. Pick "setUpBothSheets" in the toolbar and click Run. Allow access when Google asks.
 *      This creates the RSVPs, Performances and Summary tabs in both sheets.
 *   3. Deploy › New deployment › Web app (Execute as: Me, Who has access: Anyone).
 *   4. Copy the web-app link (ends in /exec) into sheetUrl near the top of the script in index.html.
 *
 * Each sheet keeps three tabs up to date:
 *   RSVPs        one row per guest (a guest who answers again updates their own row)
 *   Performances one row per performance entry for that celebration
 *   Summary      live totals
 */

const ENGAGEMENT_SHEET_ID = '1Rp2A9WMjJJA_rP4f6B7WEuoib_D-goDVsEB5HgDN75A';
const WEDDING_SHEET_ID    = '1EHgcVLnmE22-EwDFFdFvVIrcaxRSdGLk-HWDR7jLtws';

const RSVP_HEADERS = ['Last updated', 'Name', 'Side', 'Answer', 'Guests', 'Phone', 'Note', 'Times answered'];
const PERFORM_HEADERS = ['Received', 'Name', 'Side', 'Celebration', 'Performance', 'Performers', 'Idea', 'Phone'];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const eng = open_(ENGAGEMENT_SHEET_ID, 'Engagement (Wed 20 Jan)');
    const wed = open_(WEDDING_SHEET_ID, 'Wedding (Mon 25 Jan)');

    if (data.type === 'perform') {
      const ev = String(data.event || '').toLowerCase();
      const row = [new Date(), clean_(data.name), clean_(data.side), clean_(data.event), clean_(data.kind), clean_(data.count), clean_(data.idea), clean_(data.phone)];
      if (ev.indexOf('engagement') === 0 || ev.indexOf('both') === 0) eng.getSheetByName('Performances').appendRow(row);
      if (ev.indexOf('wedding') === 0 || ev.indexOf('both') === 0) wed.getSheetByName('Performances').appendRow(row);
    } else {
      if (data.eng) saveRsvp_(eng.getSheetByName('RSVPs'), data, data.eng);
      if (data.wed) saveRsvp_(wed.getSheetByName('RSVPs'), data, data.wed);
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json_({ ok: true, message: 'Guest lists are connected.' });
}

/** Run this once from the Apps Script editor to allow access and create the tabs in both sheets. */
function setUpBothSheets() {
  open_(ENGAGEMENT_SHEET_ID, 'Engagement (Wed 20 Jan)');
  open_(WEDDING_SHEET_ID, 'Wedding (Mon 25 Jan)');
}

function open_(id, label) {
  const ss = SpreadsheetApp.openById(id);
  setUp_(ss, label);
  return ss;
}

function saveRsvp_(sh, d, answer) {
  const name = clean_(d.name), side = clean_(d.side);
  const guests = d.guests === '6 or more' ? 6 : Number(d.guests) || 0;
  const key = (name + '|' + side).toLowerCase().replace(/\s+/g, ' ');
  const last = sh.getLastRow();
  if (last > 1) {
    const rows = sh.getRange(2, 1, last - 1, RSVP_HEADERS.length).getValues();
    for (let i = 0; i < rows.length; i++) {
      const k = (String(rows[i][1]) + '|' + String(rows[i][2])).toLowerCase().replace(/\s+/g, ' ');
      if (k === key) {
        const times = (Number(rows[i][7]) || 1) + 1;
        sh.getRange(i + 2, 1, 1, RSVP_HEADERS.length).setValues([[new Date(), name, side, clean_(answer), guests, clean_(d.phone) || rows[i][5], clean_(d.note) || rows[i][6], times]]);
        return;
      }
    }
  }
  sh.appendRow([new Date(), name, side, clean_(answer), guests, clean_(d.phone), clean_(d.note), 1]);
}

function setUp_(ss, label) {
  let r = ss.getSheetByName('RSVPs');
  if (!r) {
    const sheets = ss.getSheets();
    r = sheets.length === 1 && sheets[0].getLastRow() === 0 ? sheets[0].setName('RSVPs') : ss.insertSheet('RSVPs');
    r.appendRow(RSVP_HEADERS); styleHeader_(r, RSVP_HEADERS.length);
  }
  let p = ss.getSheetByName('Performances');
  if (!p) { p = ss.insertSheet('Performances'); p.appendRow(PERFORM_HEADERS); styleHeader_(p, PERFORM_HEADERS.length); }
  let s = ss.getSheetByName('Summary');
  if (!s) {
    s = ss.insertSheet('Summary', 0);
    s.getRange('A1:B1').setValues([['', label]]);
    s.getRange('A2:A6').setValues([['Coming (replies)'], ['Coming (total people)'], ["Can't make it"], ['Not sure yet'], ['Total replies']]);
    s.getRange('B2:B6').setFormulas([
      ['=COUNTIF(RSVPs!D2:D,"Yes*")'],
      ['=SUMIF(RSVPs!D2:D,"Yes*",RSVPs!E2:E)'],
      ['=COUNTIF(RSVPs!D2:D,"Sorry*")'],
      ['=COUNTIF(RSVPs!D2:D,"Not sure*")'],
      ['=COUNTA(RSVPs!B2:B)']
    ]);
    s.getRange('A8').setValue('Performance entries');
    s.getRange('B8').setFormula('=COUNTA(Performances!B2:B)');
    s.getRange('A1:B1').setFontWeight('bold').setBackground('#FBDCE3');
    s.getRange('A2:A8').setFontWeight('bold');
    s.setColumnWidths(1, 2, 220);
  }
}

function styleHeader_(sh, n) {
  sh.getRange(1, 1, 1, n).setFontWeight('bold').setBackground('#F5D98F');
  sh.setFrozenRows(1);
  sh.setColumnWidths(1, n, 170);
}

function clean_(v) {
  // keep values as plain text so nothing typed by a guest becomes a formula
  const s = v == null ? '' : String(v).trim().slice(0, 500);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
