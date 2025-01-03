/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateClientTransactionPDF } from '../../assets/Utilities/generateClientTransactionPDF'

const PdfClientTransactionReportGenerator = ({
  title,
  give,
  get,
  columns,
  rows,
  clientName,
  clientPhone,
}) => {
  return (
    <button
      onClick={() =>
        generateClientTransactionPDF(
          title,
          give,
          get,
          columns,
          rows,
          clientName,
          clientPhone
        )
      }
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfClientTransactionReportGenerator
