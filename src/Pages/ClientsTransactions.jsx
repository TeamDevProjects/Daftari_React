import { IoIosArrowBack } from 'react-icons/io'
import { useNavigate, useParams } from 'react-router-dom'

const ClientsTransactions = () => {
  const { clientId } = useParams()

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
        <div>Client Transactions for ID: {clientId}</div>
      </div>
    </>
  )
}
export default ClientsTransactions
