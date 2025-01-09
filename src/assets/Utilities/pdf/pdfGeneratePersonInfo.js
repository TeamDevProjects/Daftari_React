import { PDF } from '../../../Constants/Variables'

export const pdfGeneratePersonInfo = (pdf, position, gave, got, balance) => {
  pdf.setTextColor(15, 81, 50)
  position.positionY += PDF.MARGIN.TOP_10 // 33
  pdf.text(
    `${PDF.TEXT.I_GOT}   : $ ${got}`,
    PDF.MARGIN.LEFT,
    position.positionY
  )

  pdf.setTextColor(132, 32, 41)
  position.positionY += PDF.MARGIN.TOP_7 // 30
  pdf.text(
    `${PDF.TEXT.I_GAVE} : $ ${gave}`,
    PDF.MARGIN.LEFT,
    position.positionY
  )

  position.positionY += PDF.MARGIN.TOP_7 // 36
  if (balance < 0) {
    pdf.setTextColor(132, 32, 41)
    pdf.text(
      `${PDF.TEXT.GLOBAL_BALANCE} : $ ${got || 0}`,
      PDF.MARGIN.LEFT,
      position.positionY
    )
  } else {
    pdf.setTextColor(15, 81, 50)
    pdf.text(
      `${PDF.TEXT.GLOBAL_BALANCE} : $ ${balance || 0}`,
      PDF.MARGIN.LEFT,
      position.positionY
    )
  }
}
