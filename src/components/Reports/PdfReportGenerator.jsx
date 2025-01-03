/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePersonPDF } from '../../assets/Utilities/generatePersonPDF'

const PdfReportGenerator = ({
  title,
  give,
  get,
  columns,
  rows,
}) => {
  return (
    <button
      onClick={() =>
        generatePersonPDF(title, give, get, columns, rows)
      }
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfReportGenerator
