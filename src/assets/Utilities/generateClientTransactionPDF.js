/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'
import { pdfGenerateClientTransactionInfo } from './pdf/pdfGenerateClientTransactionInfo'
// import { RalewayBase64 } from '../fonts/RalewayBase64'

export const generateClientTransactionPDF = (
  storeName,
  title,
  gave,
  got,
  balance,
  columns,
  rows,
  clientName,
  clientPhone
) => {
  if (!rows) return

  const pdf = new jsPDF()
  // Add the Raleway font to jsPDF from Base64
  // pdf.addFileToVFS('Raleway-Regular.ttf', RalewayBase64) // Add font to VFS
  // pdf.addFont('Raleway-Regular.ttf', 'Raleway', 'normal') // Register the font with jsPDF

  // Set the font to Raleway
  // pdf.setFont('Raleway')

  let position = {
    positionY: 0,
  }

  //===============[  Logo  ]====================
  pdfGenerateLogo(pdf, position, storeName) // 0 = 10

  //===============[ Header ]====================
  pdfGenerateHeader(pdf, position, title) // 10 => 20

  //===============[PDF Info]====================
  pdfGenerateClientTransactionInfo(
    pdf,
    position,
    gave,
    got,
    balance,
    clientName,
    clientPhone
  )

  //================[ Table & Footer ]====================
  pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
