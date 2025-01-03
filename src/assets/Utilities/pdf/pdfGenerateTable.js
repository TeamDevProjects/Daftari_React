import autoTable from 'jspdf-autotable'
import { PDF } from '../../../Constants/Variables'

export const pdfGenerateTable = (pdf, position, columns,rows) => {
  let finalY = 0

   pdf.setTextColor(0, 0, 0)
   position.positionY += PDF.marginTop_10 // 39
   pdf.text(
     `Rows count : ${(rows && rows.length) || 0} `,
     PDF.marginLeft,
     position.positionY
   )
   
  position.positionY += PDF.marginTop_5
  autoTable(pdf, {
    head: [columns],
    body: rows,
    startY: position.positionY,
    styles: { fontSize: 9, halign: 'center' },
    headStyles: { fillColor: [131, 125, 255], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [226, 224, 255] },
    didDrawPage: (data) => {
      // Calculate the page height dynamically
      const pageHeight = pdf.internal.pageSize.height
      finalY = data.cursor.y // Update finalY to the current cursor position

      // Add footer text
      if (PDF.footer) {
        pdf.setFontSize(10)
        pdf.text(PDF.footer, PDF.marginLeft, finalY + 10) // Adjust position
      }

      // page number
      pdf.setFontSize(10)
      pdf.text('', data.settings.margin.left, pageHeight - 10) // Adjust position

      // Optional: Add page number at the bottom
      const pageCount = pdf.internal.getNumberOfPages()
      pdf.text(`${pageCount}`, data.settings.margin.left + 100, pageHeight - 10)
    },
  })
}
