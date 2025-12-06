import { Parser } from "json2csv";

export function exportToCSV(data, fields) {
  try {
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(data);
    return csv;
  } catch (error) {
    console.error("CSV Export Error:", error);
    throw new Error("Failed to generate CSV");
  }
}
