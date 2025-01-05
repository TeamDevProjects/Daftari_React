/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'
import { pdfGenerateSupplierTransactionInfo } from './pdf/pdfGenerateSupplierTransactionInfo'

export const generateSupplierTransactionPDF = (
  storeName,
  title,
  gave,
  got,balance,
  columns,
  rows,
  supplierName,
  supplierPhone
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
  pdfGenerateSupplierTransactionInfo(
    pdf,
    position,
    gave,
    got,
    balance,
    supplierName,
    supplierPhone
  )

  //================[ Table & Footer ]====================
  pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
