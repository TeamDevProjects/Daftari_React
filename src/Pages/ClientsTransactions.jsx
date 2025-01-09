import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal } from '../components/UI'
import { LuDollarSign } from 'react-icons/lu'
import { TransactionsColumns } from '../Constants/TablesColumns'
import clientTransactionService from '../Services/clientTransaction'
import { ClientTransactionsTable } from '../components/Tables'
import transactionImg from '../assets/cash-flow.png'
import {
  MODE,
  TRANSACTION_TYPE_ID,
  REACT_QUERY_NAME,
  UI,
} from '../Constants/Variables'
import AddEditClientTransactionForm from '../components/Forms/AddEditClientTransactionForm'
import { queryClient } from '../App'
import { ReportTransactionsColumns } from '../Constants/ReportColumns'
import PdfClientTransactionReportGenerator from '../components/Reports/PdfClientTransactionReportGenerator'
import { calcTotalPayment, calcTotalWithdraw } from '../lib/helpers'
import { handelDateFormate } from '../lib/date'
import Info from '../components/Info'
import AddTransactionBtn from '../components/Buttons/AddTransactionBtn'

const _gotAllClientTransactions = async (clientId) => {
  try {
    return await clientTransactionService.GetAll(clientId)
  } catch (error) {
    toast.error(error.message)
    return
  }
}

export const loader = async ({ params }) => {
  try {
    const { clientId } = params

    const initialTransactions = await _gotAllClientTransactions(clientId)

    if (!initialTransactions) {
      throw new Error("Can't load client transactions")
    }

    const totalPaymentResult = calcTotalPayment(initialTransactions)

    const totalWithdrawResult = calcTotalWithdraw(initialTransactions)

    return {
      initialTransactions,
      totalPaymentResult,
      totalWithdrawResult,
    }
  } catch {
    return {
      initialTransactions: [],
      totalPaymentResult: 0,
      totalWithdrawResult: 0,
    }
  }
}

const ClientsTransactions = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { clientId } = useParams()
  const { clientName, clientPhone } = location.state || {} // Destructure the state

  // Use loader data
  const { initialTransactions, totalPaymentResult, totalWithdrawResult } =
    useLoaderData()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionTypeId, setTransactionTypeId] = useState(0)
  const [mode, setMode] = useState(MODE.ADD)
  const [totalPayment, setTotalPayment] = useState(totalPaymentResult)
  const [totalWithdraw, setTotalWithdraw] = useState(totalWithdrawResult)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  // ==============[ Privet Methods ]==================
  const _refreshTransactions = async () => {
    try {
      const newTransactions = await _gotAllClientTransactions(clientId)

      if (!newTransactions) {
        toast.error("Can't load user transactions")
        return
      }
      setTransactions(newTransactions)
      //
      queryClient.removeQueries(REACT_QUERY_NAME.CLIENT_TRANSACTIONS)
      return newTransactions
    } catch {
      setTransactions(initialTransactions)
      return initialTransactions
    }
  }

  const _refreshTotalPayment = (newTransactions) => {
    const totalPaymentResult = calcTotalPayment(newTransactions)

    setTotalPayment(totalPaymentResult)
  }

  const _refreshTotalWithdraw = (newTransactions) => {
    const totalWithdrawResult = calcTotalWithdraw(newTransactions)

    setTotalWithdraw(totalWithdrawResult)
  }

  const _refresh = async () => {
    // Refresh
    const newTransactions = await _refreshTransactions()
    _refreshTotalPayment(newTransactions)
    _refreshTotalWithdraw(newTransactions)
  }

  const _addTransaction = async (transaction) => {
    try {
      await clientTransactionService.Add(transaction)
      toast.success('user transaction Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateTransaction = async (transaction) => {
    try {
      await clientTransactionService.Update(
        transaction,
        currentTransaction?.clientTransactionId
      )
      toast.success('user transaction Updated Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // ================[ Handel UI ]=====================
  const goBack = () => {
    navigate(-1)
  }

  const handelAddPaymentTransactionModal = () => {
    setMode(MODE.ADD)
    setTransactionTypeId(TRANSACTION_TYPE_ID.PAYMENT)
    handleOpenModal()
  }

  const handelAddWithdrawTransactionModal = () => {
    setMode(MODE.ADD)
    setTransactionTypeId(TRANSACTION_TYPE_ID.WITHDRAW)
    handleOpenModal()
  }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }
  // ==============[ Action Methods ]==================

  const handleSubmit = async (transaction) => {
    if (transaction.amount <= 0) return // check right amount

    if (mode == MODE.ADD) {
      await _addTransaction(transaction)
    }

    // Update
    else if (mode == MODE.UPDATE) {
      await _updateTransaction(transaction)
    }

    // Refresh
    await _refresh()

    setModalOpen(false)
  }

  const handelDeleteTransaction = async (transactionId) => {
    try {
      await clientTransactionService.Delete(transactionId)
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.clientTransactionId !== transactionId
        )
      )

      // Refresh
      await _refresh()
      toast.success('client transaction deleted Successfully')
    } catch (error) {
      toast.error('Failed to delete user transaction', error.message)
    }
  }
  const handelEditTransaction = (transaction) => {
    setMode(MODE.UPDATE)
    handleOpenModal()
    setCurrentTransaction(transaction)
  }

  const TransactionsReportRows =
    Array.isArray(transactions) &&
    transactions.length > 0 &&
    transactions.map((r, index) => [
      index + 1,
      handelDateFormate(r?.transactionDate) || '-',
      r?.transactionTypeName || '-',
      r?.amount || '-',
      r?.notes || '-',
    ])

  const balance = totalWithdraw - totalPayment
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditClientTransactionForm
          onSubmit={handleSubmit}
          title={'Transaction'}
          buttonText={'Transaction'}
          mode={mode}
          clientId={clientId}
          currentTransaction={currentTransaction}
          transactionTypeId={transactionTypeId}
        />
      </Modal>

      <div className="page-section">
        <button className="btn-back" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <div className="center section-logo">
          <img src={transactionImg} alt="transactionImg" />
          <p>{UI.HEADER.CLIENTS_TRANSACTIONS}</p>
        </div>
      </div>

      <div className="page-section flex-between">
        <PdfClientTransactionReportGenerator
          title={`Client Transactions Report`}
          columns={ReportTransactionsColumns}
          got={totalPayment}
          gave={totalWithdraw}
          balance={balance}
          rows={TransactionsReportRows}
          clientName={clientName}
          clientPhone={clientPhone}
        />
        <Info name={clientName} phone={clientPhone} />
      </div>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">{UI.TEXT.I_GAVE}</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWithdraw || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">{UI.TEXT.I_GOT}</span>
            <div className="amount green">
              <LuDollarSign />
              <span>{totalPayment || '00'}</span>
            </div>
          </div>
        </div>
        <span className="center fs-1">
          <span className="total-amount-title">{`${UI.TEXT.GLOBAL_BALANCE} : `}</span>
          <span className="total-amount">
            <LuDollarSign />
            {balance}
          </span>
        </span>
      </div>

      <div className="page-section">
        <ClientTransactionsTable
          columns={TransactionsColumns}
          rows={transactions}
          onDelete={handelDeleteTransaction}
          onEdit={handelEditTransaction}
        />
        <div className="flex">
          <AddTransactionBtn
            buttonType="red"
            onClick={handelAddWithdrawTransactionModal}
          >
            {UI.TEXT.I_GAVE}
          </AddTransactionBtn>
          <AddTransactionBtn
            buttonType="green"
            onClick={handelAddPaymentTransactionModal}
          >
            {UI.TEXT.I_GOT}
          </AddTransactionBtn>
        </div>
      </div>
    </>
  )
}

export default ClientsTransactions
