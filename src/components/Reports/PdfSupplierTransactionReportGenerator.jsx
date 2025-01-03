/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { AiOutlineFilePdf } from 'react-icons/ai'
import { generateSupplierTransactionPDF } from '../../assets/Utilities/generateSupplierTransactionPDF'

const PdfSupplierTransactionReportGenerator = ({
  title,
  give,
  get,
  columns,
  rows,
  supplierName,
  supplierPhone,
}) => {
  return (
    <button
      onClick={() =>
        generateSupplierTransactionPDF(
          title,
          give,
          get,
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
