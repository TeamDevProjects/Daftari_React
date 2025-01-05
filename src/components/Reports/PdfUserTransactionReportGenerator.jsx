/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateUserTransactionPDF } from '../../assets/Utilities/generateUserTransactionPDF'
import { useUser } from '../../Context/userContext'

const PdfUserTransactionReportGenerator = ({
  title,
  gave,
  got,
  balance,
  columns,
  rows,
  userName,
  userPhone,
}) => {
  const { user } = useUser()

  return (
    <button
      onClick={() =>
        generateUserTransactionPDF(
          user?.storeName,
          title,
          gave,
          got,
          balance,
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
