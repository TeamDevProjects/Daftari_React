import autoTable from 'jspdf-autotable'
import { PDF } from '../../../Constants/Variables'

export const pdfGenerateTable = (pdf, position, columns, rows) => {
  let finalY = 0

  pdf.setTextColor(0, 0, 0)
  position.positionY += PDF.MARGIN.TOP_10 // 39
  pdf.text(
    `Rows count : ${(rows && rows.length) || 0} `,
    PDF.MARGIN.LEFT,
    position.positionY
  )

  position.positionY += PDF.MARGIN.TOP_5
  autoTable(pdf, {
    head: [columns],
    body: rows,
    startY: position.positionY,
    styles: {
      fontSize: 9,
      halign: 'center',
      lineWidth: 0.25, // Thickness of the border
      lineColor: [0, 0, 0], // Color of the border (black)
    },
    headStyles: {
      fillColor: [131, 125, 255],
      textColor: [255, 255, 255],
      lineWidth: 0.25, // Border width for header
      lineColor: [0, 0, 0], // Black border for header
    },
    alternateRowStyles: {
      fillColor: [226, 224, 255],
      lineWidth: 0.25,
      lineColor: [0, 0, 0],
    },
    didDrawPage: (data) => {
      // Calculate the page height dynamically
      const pageHeight = pdf.internal.pageSize.height
      finalY = data.cursor.y // Update finalY to the current cursor position

      // Add footer text
      pdf.setFontSize(10)
      pdf.text(PDF.TEXT.FOOTER, PDF.MARGIN.LEFT, finalY + 10) // Adjust position

      // Page number
      pdf.setFontSize(10)
      pdf.text('', data.settings.margin.left, pageHeight - 10) // Adjust position

      // Optional: Add page number at the bottom
      const pageCount = pdf.internal.getNumberOfPages()
      pdf.text(`${pageCount}`, data.settings.margin.left + 100, pageHeight - 10)
    },
  })
}
