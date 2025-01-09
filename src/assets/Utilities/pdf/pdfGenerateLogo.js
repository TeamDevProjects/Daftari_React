/* eslint-disable no-undef */
import { PDF } from '../../../Constants/Variables'

export const pdfGenerateLogo = (pdf, position, storeName) => {
  const pageWidth = pdf.internal.pageSize.width
  const storeNamePosition =
    pageWidth - pdf.getTextWidth(storeName) - PDF.MARGIN.LEFT

  pdf.setFontSize(18)
  pdf.setTextColor(209, 231, 221)
  position.positionY += PDF.MARGIN.TOP_10 // 17
  pdf.setFont('helvetica', 'bold') // Use "helvetica" font with "bold" style

  pdf.text(`${PDF.TEXT.APP_LOGO}`, PDF.MARGIN.LEFT, position.positionY)

  //-- storeName
  pdf.setFontSize(10)
  pdf.setTextColor(0, 0, 0)
  pdf.text(
    `${PDF.TEXT.STORE} : ${storeName}`,
    storeNamePosition,
    position.positionY
  )
}
