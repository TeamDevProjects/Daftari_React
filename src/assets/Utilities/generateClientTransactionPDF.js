/* eslint-disable no-unused-vars */
import jsPDF from 'jspdf'
import { pdfGenerateLogo } from './pdf/pdfGenerateLogo'
import { pdfGenerateHeader } from './pdf/pdfGenerateHeader'
import { pdfGenerateTable } from './pdf/pdfGenerateTable'
import { pdfGenerateClientTransactionInfo } from './pdf/pdfGenerateClientTransactionInfo'

export const generateClientTransactionPDF = (title, give, get, columns, rows,clientName,clientPhone) => {
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
   pdfGenerateClientTransactionInfo(pdf, position, give, get,clientName,clientPhone)
 
   //================[ Table & Footer ]====================
   pdfGenerateTable(pdf, position, columns, rows)

  // Save the PDF
  pdf.save(`${title.replace(/\s+/g, '_')}.pdf`)
}
