/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generatePersonPDF } from '../../assets/Utilities/generatePersonPDF'
import { useUser } from '../../Context/userContext'

const PdfFilteredReportGenerator = ({ title, gave, got, balance,columns, rows }) => {
  const { user } = useUser()

  return (
    <button
      className="btn btn-add"
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
    >
      <AiOutlineFilePdf />
    </button>
  )
}

export default PdfFilteredReportGenerator
