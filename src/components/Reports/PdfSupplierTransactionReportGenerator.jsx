/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateSupplierTransactionPDF } from '../../assets/Utilities/generateSupplierTransactionPDF'
import { useUser } from '../../Context/userContext'

const PdfSupplierTransactionReportGenerator = ({
  title,
  gave,
  got,
  balance,
  columns,
  rows,
  supplierName,
  supplierPhone,
}) => {
  const { user } = useUser()
  return (
    <button
      onClick={() =>
        generateSupplierTransactionPDF(
          user?.storeName,
          title,
          gave,
          got,balance,
          columns,
          rows,
          supplierName,
          supplierPhone
        )
      }
      className="btn-pdf"
    >
      <AiOutlineFilePdf />
      <span>Download PDF </span>
    </button>
  )
}

export default PdfSupplierTransactionReportGenerator
