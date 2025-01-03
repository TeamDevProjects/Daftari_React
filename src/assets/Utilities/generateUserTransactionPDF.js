/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'
import { pdfGenerateUserTransactionInfo } from './pdf/pdfGenerateUserTransactionInfo'

export const generateUserTransactionPDF = (
  title,
  give,
  get,
  columns,
  rows,
  userName,
  userPhone
) => {
  if (!rows) return

  const pdf = new jsPDF()

  let position = {
    positionY: 0,
  }

  //===============[  Logo  ]====================
  pdfGenerateLogo(pdf, position)

  //===============[ Header ]====================
  pdfGenerateHeader(pdf, position, title)

  //===============[PDF Info]====================
  pdfGenerateUserTransactionInfo(pdf, position, give, get,userName,userPhone)

  //================[ Table & Footer ]====================
  pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
