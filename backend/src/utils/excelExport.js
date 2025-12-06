import ExcelJS from "exceljs";

export async function exportToExcel(transactions) {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    worksheet.columns = [
      { header: "ID", key: "id", width: 25 },
      { header: "Type", key: "type", width: 15 },
      { header: "Category", key: "category", width: 20 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Payment Method", key: "paymentMethod", width: 20 },
      { header: "Date", key: "date", width: 20 },
      { header: "Notes", key: "notes", width: 30 },
    ];

    transactions.forEach((t) => {
      worksheet.addRow({
        id: t._id.toString(),
        type: t.type,
        category: t.category,
        amount: t.amount,
        paymentMethod: t.paymentMethod,
        date: t.date.toISOString().split("T")[0],
        notes: t.notes || "",
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;

  } catch (error) {
    console.error("Excel Export Error:", error);
    throw new Error("Failed to export Excel");
  }
}
