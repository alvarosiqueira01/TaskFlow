/**
 * Generic, schema-agnostic JSON -> CSV conversion. Used for exporting the
 * completed tasks report because GET /reports/completed defines no
 * response schema in the API contract — the payload shape is unknown at
 * build time, so this utility deliberately makes no assumption about
 * specific field names.
 */
export function convertJsonToCsv(payload: unknown): string {
  const rows = normalizeToRows(payload);

  if (rows.length === 0) {
    return '';
  }

  const headers = Array.from(
    rows.reduce((keys, row) => {
      Object.keys(row).forEach((key) => keys.add(key));
      return keys;
    }, new Set<string>())
  );

  const headerLine = headers.map(escapeCsvValue).join(',');
  const dataLines = rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(','));

  return [headerLine, ...dataLines].join('\r\n');
}

function normalizeToRows(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) {
    return payload.map((item) => (isPlainObject(item) ? item : { value: item }));
  }
  if (isPlainObject(payload)) {
    return [payload];
  }
  if (payload === null || payload === undefined) {
    return [];
  }
  return [{ value: payload }];
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function escapeCsvValue(value: unknown): string {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
  if (/[",\r\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

export function downloadCsv(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
