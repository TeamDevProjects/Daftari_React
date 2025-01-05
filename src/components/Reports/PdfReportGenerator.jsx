/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePersonPDF } from '../../assets/Utilities/generatePersonPDF'
import { useUser } from '../../Context/userContext'

const PdfReportGenerator = ({ title, gave, got,balance, columns, rows }) => {
  const { user } = useUser()
  return (
    <button
      onClick={() =>
        generatePersonPDF(
          user?.storeName,
          title,
          gave,
          got,
          balance,
          columns,
          rows
        )
      }
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfReportGenerator
