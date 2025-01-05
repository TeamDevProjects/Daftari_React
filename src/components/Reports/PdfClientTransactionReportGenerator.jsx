/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateClientTransactionPDF } from '../../assets/Utilities/generateClientTransactionPDF'
import { useUser } from '../../Context/userContext'

const PdfClientTransactionReportGenerator = ({
  title,
  gave,
  got,
  balance,
  columns,
  rows,
  clientName,
  clientPhone,
}) => {
    const { user } = useUser()

  return (
    <button
      onClick={() =>
        generateClientTransactionPDF(
          user?.storeName,
          title,
          gave,
          got,
          balance,
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
