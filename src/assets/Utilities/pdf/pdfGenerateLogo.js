/* eslint-disable no-undef */
import { PDF } from '../../../Constants/Variables'

export const pdfGenerateLogo = (pdf, position) => {
  pdf.setTextColor(209, 231, 221)
  pdf.setFontSize(18)
  position.positionY += PDF.marginTop_10 // 17
  pdf.setFont('helvetica', 'bold') // Use "helvetica" font with "bold" style

  pdf.text(`Daftari`, PDF.marginLeft, position.positionY)
}
