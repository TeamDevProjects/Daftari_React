import { PDF } from '../../../Constants/Variables'

export const pdfGenerateSupplierTransactionInfo = (
  pdf,
  position,
  give,
  get,
  supplierName,
  supplierPhone
) => {
  const pageWidth = pdf.internal.pageSize.width
  const pageMeddle = pageWidth / 2
  pdf.setTextColor(132, 32, 41)
  position.positionY += PDF.marginTop_10 // 30
  pdf.text(`I Give  : ${give}`, PDF.marginLeft, position.positionY)

  pdf.setTextColor(0, 0, 0)
  pdf.text(`supplier : ${supplierName}`, pageMeddle, position.positionY)

  //---------------------------------------
  pdf.setTextColor(15, 81, 50)
  position.positionY += PDF.marginTop_7 // 33
  pdf.text(`I Get   : ${get}`, PDF.marginLeft, position.positionY)

  pdf.setTextColor(0, 0, 0)
  pdf.text(`Phone  : ${supplierPhone}`, pageMeddle, position.positionY)
  //--------------------------------------
  position.positionY += PDF.marginTop_7 // 36
  const total = give - get
  if (total < 0) {
    pdf.setTextColor(15, 81, 50)
    pdf.text(`Balance  : ${get || 0}`, PDF.marginLeft, position.positionY)
  } else {
    pdf.setTextColor(132, 32, 41)
    pdf.text(
      `Balance  : ${give - get || 0}`,
      PDF.marginLeft,
      position.positionY
    )
  }
}
