/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'
import { pdfGenerateClientTransactionInfo } from './pdf/pdfGenerateClientTransactionInfo'

export const generateClientTransactionPDF = (storeName,title, gave, got,balance, columns, rows,clientName,clientPhone) => {
 if (!rows) return
 
   const pdf = new jsPDF()
 
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
     balance,clientName,
     clientPhone
   )
 
   //================[ Table & Footer ]====================
   pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
