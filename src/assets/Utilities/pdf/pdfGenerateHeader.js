import { PDF } from '../../../Constants/Variables'
import { centerLine } from './centerLine'
import { handelDateTimeFormate } from '../../../lib/date'

export const pdfGenerateHeader = (pdf, position, title) => {
  const pageWidth = pdf.internal.pageSize.width
  const dateOfNowText = `Generated on: ${handelDateTimeFormate(new Date())}`

  // config Line (border)
  pdf.setLineWidth(0.3) // Set border line width
  pdf.setDrawColor(100, 92, 255) // Set color to black

  position.positionY += PDF.MARGIN.TOP_5 // 10
  pdf.line(
    PDF.MARGIN.LEFT,
    position.positionY,
    pageWidth - PDF.MARGIN.TOP_10,
    position.positionY
  )

  pdf.setFontSize(14)
  pdf.setTextColor(0, 0, 0)
  position.positionY += PDF.MARGIN.TOP_7 // 17
  pdf.text(
    title,
    centerLine(pdf.getTextWidth(title), pageWidth),
    position.positionY
  )

  pdf.setFontSize(10)
  position.positionY += PDF.MARGIN.TOP_7 // 24
  pdf.text(
    dateOfNowText,
    centerLine(pdf.getTextWidth(dateOfNowText), pageWidth),
    position.positionY
  )

  // Bottom border x1 y1 x2 y2
  position.positionY += PDF.MARGIN.TOP_3 // 27
  pdf.line(
    PDF.MARGIN.LEFT,
    position.positionY,
    pageWidth - PDF.MARGIN.TOP_10,
    position.positionY
  )
}
