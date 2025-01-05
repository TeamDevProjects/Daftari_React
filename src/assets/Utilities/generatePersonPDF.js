/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGeneratePersonInfo } from './pdf/pdfGeneratePersonInfo'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'

export const generatePersonPDF = (
  storeName,
  title,
  gave,
  got,
  balance,
  columns,
  rows
) => {
  if (!rows) return

  const pdf = new jsPDF()

  let position = {
    positionY: 0,
  }
  //===============[  Logo  ]====================
  pdfGenerateLogo(pdf, position, storeName)

  //===============[ Header ]====================
  pdfGenerateHeader(pdf, position, title)

  //===============[PDF Info]====================
  pdfGeneratePersonInfo(pdf, position, gave, got, balance)

  //================[ Table & Footer ]====================
  pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
