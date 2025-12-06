import PDFDocument from "pdfkit";

export function generatePDF(transactions, res) {
  try {
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=transactions.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Expense Tracker - Transactions Report", { align: "center" });
    doc.moveDown(2);

    doc.fontSize(12);
    doc.text("Type", 40, doc.y, { width: 80 });
    doc.text("Category", 120, doc.y, { width: 100 });
    doc.text("Amount", 220, doc.y, { width: 80 });
    doc.text("Payment", 300, doc.y, { width: 100 });
    doc.text("Date", 400, doc.y, { width: 120 });
    doc.moveDown();

    doc.moveTo(40, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown();

    
    transactions.forEach((t) => {
      doc.fontSize(10);
      doc.text(t.type, 40, doc.y, { width: 80 });
      doc.text(t.category, 120, doc.y, { width: 100 });
      doc.text(t.amount.toString(), 220, doc.y, { width: 80 });
      doc.text(t.paymentMethod, 300, doc.y, { width: 100 });
      doc.text(t.date.toISOString().split("T")[0], 400, doc.y, { width: 120 });
      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    console.error("PDF Export Error:", error);
    throw new Error("Failed to export PDF");
  }
}
