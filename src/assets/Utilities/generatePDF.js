import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const generatePDF = (title, subtitle, columns, rows, footer) => {
  if (!rows) return

  const doc = new jsPDF()
  let finalY = 0 // Track the end position of the table

  // Add title
  doc.setFontSize(18)
  doc.text(title, 14, 20)

  // Add subtitle
  if (subtitle) {
    doc.setFontSize(12)
    doc.text(subtitle, 14, 30)
  }

  // Add table
  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: subtitle ? 40 : 30,
    styles: { fontSize: 10, halign: 'center' },
    headStyles: { fillColor: [22, 160, 133], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    didDrawPage: (data) => {
      // Calculate the page height dynamically
      const pageHeight = doc.internal.pageSize.height
      finalY = data.cursor.y // Update finalY to the current cursor position

      // Add footer text
      if (footer) {
        doc.setFontSize(10)
        doc.text(footer, 14, finalY + 10) // Adjust position
      }

      // page number
      doc.setFontSize(10)
      doc.text('', data.settings.margin.left, pageHeight - 10) // Adjust position

      // Optional: Add page number at the bottom
      const pageCount = doc.internal.getNumberOfPages()
      doc.text(
        `Page ${pageCount}`,
        data.settings.margin.left + 100,
        pageHeight - 10
      )
    },
  })

  // Save the PDF
  doc.save(`${title.replace(/\s+/g, '_')}.pdf`)
}