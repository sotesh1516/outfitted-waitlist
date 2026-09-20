function doGet(event) {
  try {
    var callback = String(event.parameter.callback || '');

    if (!/^[A-Za-z_$][\w$]*$/.test(callback)) {
      return ContentService.createTextOutput('Invalid callback.');
    }

    var email = String(event.parameter.email || '').trim().toLowerCase();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return response(callback, { ok: false, message: 'Invalid email address.' });
    }

    var properties = PropertiesService.getScriptProperties();
    var spreadsheetId = properties.getProperty('SPREADSHEET_ID');
    var sheetName = properties.getProperty('SHEET_NAME') || 'Sheet1';
    var spreadsheet = spreadsheetId
      ? SpreadsheetApp.openById(spreadsheetId)
      : SpreadsheetApp.getActiveSpreadsheet();

    if (!spreadsheet) {
      return response(callback, {
        ok: false,
        message: 'Set SPREADSHEET_ID in Apps Script properties, then deploy a new version.'
      });
    }

    var sheet = spreadsheet && spreadsheet.getSheetByName(sheetName);

    if (!sheet) {
      return response(callback, {
        ok: false,
        message: 'Sheet tab not found. Check SHEET_NAME in Apps Script properties.'
      });
    }

    var emails = sheet.getRange(2, 2, Math.max(sheet.getLastRow() - 1, 1), 1)
      .getValues()
      .flat()
      .map(function (value) { return String(value).trim().toLowerCase(); });

    if (emails.indexOf(email) !== -1) {
      return response(callback, { ok: true, duplicate: true, message: "You're already on the list—we've got you." });
    }

    sheet.appendRow([new Date(), email]);
    return response(callback, { ok: true, message: "You're on the list. We'll keep you posted." });
  } catch (error) {
    console.error(error);
    return response(String(event.parameter.callback || ''), {
      ok: false,
      message: 'Could not save signup. Check the Sheet ID, tab name, and web app permissions.'
    });
  }
}

function response(callback, body) {
  return ContentService
    .createTextOutput(callback + '(' + JSON.stringify(body) + ');')
    .setMimeType(ContentService.MimeType.JAVASCRIPT);
}