/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePDF } from '../../assets/Utilities/generatePDF'

const PdfFilteredReportGenerator = ({
  title,
  subtitle,
  columns,
  rows,
  footer,
}) => {
  return (
    <button
      className="btn btn-add"
      onClick={() => generatePDF(title, subtitle, columns, rows, footer)}
    >
      <AiOutlineFilePdf />
    </button>
  )
}

export default PdfFilteredReportGenerator
