/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePDF } from '../../assets/Utilities/generatePDF'

const PdfReportGenerator = ({ title, subtitle, columns, rows, footer }) => {
  
  return (
    <button
      onClick={() => generatePDF(title, subtitle, columns, rows, footer)}
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfReportGenerator
