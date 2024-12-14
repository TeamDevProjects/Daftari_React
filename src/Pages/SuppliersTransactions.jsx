import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'

const SuppliersTransactions = () => {
  const { supplierId } = useParams()

  const navigate = useNavigate()

  const goBack = () => {
    navigate(-1) // الرجوع إلى الصفحة السابقة
  }
  return (
    <>
      <div className="panner">
        <button onClick={goBack}>
          <IoIosArrowBack />
        </button>
      </div>

      <div className="page-section">
        <div>Supplier Transactions for ID: {supplierId}</div>
      </div>
    </>
  )
}
export default SuppliersTransactions
