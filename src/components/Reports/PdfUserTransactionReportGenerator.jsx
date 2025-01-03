/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateUserTransactionPDF } from '../../assets/Utilities/generateUserTransactionPDF'

const PdfUserTransactionReportGenerator = ({
  title,
  give,
  get,
  columns,
  rows,
  userName,
  userPhone,
}) => {
  return (
    <button
      onClick={() =>
        generateUserTransactionPDF(
          title,
          give,
          get,
          columns,
          rows,
          userName,
          userPhone
        )
      }
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfUserTransactionReportGenerator
