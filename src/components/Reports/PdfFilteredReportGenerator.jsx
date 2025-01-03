/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePersonPDF } from '../../assets/Utilities/generatePersonPDF'

const PdfFilteredReportGenerator = ({
  title,
  give,
  get,
  columns,
  rows,
}) => {
  return (
    <button
      className="btn btn-add"
      onClick={() =>
        generatePersonPDF(title, give, get, columns, rows)
      }
    >
      <AiOutlineFilePdf />
    </button>
  )
}

export default PdfFilteredReportGenerator
