import { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Modal } from '../components/UI'
import { LuDollarSign } from 'react-icons/lu'
import { TransactionsColumns } from '../Constants/TablesColumns'
import clientTransactionService from '../Services/clientTransaction'
import { ClientTransactionsTable } from '../components/Tables'
import transactionImg from '../assets/cash-flow.png'
import {
  MODE,
  TRANSACTION_TYPE_NAME,
  TRANSACTION_TYPE_ID,
  REACT_QUERY_NAME,
} from '../Constants/Variables'
import AddEditClientTransactionForm from '../components/Forms/AddEditClientTransactionForm'
import { queryClient } from '../App'
import { ReportTransactionsColumns } from '../Constants/ReportColumns'
import { handelDateFormate } from '../assets/Utilities/date'
import PdfClientTransactionReportGenerator from '../components/Reports/PdfClientTransactionReportGenerator'

const _getAllClientTransactions = async (clientId) => {
  return await clientTransactionService.GetAll(clientId)
}

const _calcTotalPayment = (transactions) => {
  if (!transactions || transactions.length == 0) return 0

  const totalPayment = transactions.reduce(
    (total, transaction) =>
      transaction.transactionTypeName == TRANSACTION_TYPE_NAME.PAYMENT
        ? total + transaction.amount
        : total,
    0
  )
  return totalPayment
}

const _calcTotalWithdraw = (transactions) => {
  if (!transactions || transactions.length == 0) return 0

  const totalWithdraw = transactions.reduce(
    (total, transaction) =>
      transaction.transactionTypeName === TRANSACTION_TYPE_NAME.WITHDRAW
        ? total + transaction.amount
        : total,
    0
  )
  return totalWithdraw
}

export const loader = async ({ params }) => {
  try {
    const id = params.clientId // استخدم الـ id من الـ params
    console.log(id)

    const initialTransactions = await _getAllClientTransactions(id)

    if (!initialTransactions) {
      throw new Error("Can't load client transactions")
    }

    const totalPaymentResult = initialTransactions.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === TRANSACTION_TYPE_NAME.PAYMENT
          ? total + transaction.amount
          : total,
      0
    )

    const totalWithdrawResult = initialTransactions.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === TRANSACTION_TYPE_NAME.WITHDRAW
          ? total + transaction.amount
          : total,
      0
    )

    return {
      initialTransactions,
      totalPaymentResult,
      totalWithdrawResult,
    }
  } catch (error) {
    console.error(error)
    return {
      initialTransactions: [],
      totalPaymentResult: 0,
      totalWithdrawResult: 0,
    }
  }
}

const ClientsTransactions = () => {
  const { clientId } = useParams()

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

  const navigate = useNavigate()
  // ==============[ Privet Methods ]==================
  const _refreshTransactions = async () => {
    try {
      const newTransactions = await _getAllClientTransactions(clientId)

      if (!newTransactions) {
        toast.error("Can't load user transactions")
        return
      }
      setTransactions(newTransactions)
      //
      queryClient.removeQueries(REACT_QUERY_NAME.USER_TRANSACTIONS)
      return newTransactions
    } catch {
      setTransactions(initialTransactions)
      return initialTransactions
    }
  }

  const _refreshTotalPayment = (newTransactions) => {
    const totalPaymentResult = _calcTotalPayment(newTransactions)

    setTotalPayment(totalPaymentResult)
  }

  const _refreshTotalWithdraw = (newTransactions) => {
    const totalWithdrawResult = _calcTotalWithdraw(newTransactions)

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
      console.log('Add user transaction', transaction)
      await clientTransactionService.Add(transaction)
      toast.success('user transaction Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateTransaction = async (transaction) => {
    try {
      console.log('Edit user transaction', transaction)
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
    // console.log(transaction)
    setMode(MODE.UPDATE)
    handleOpenModal()
    setCurrentTransaction(transaction)
  }

  const TransactionsReportRows = transactions.map((r, index) => [
    index + 1,
    handelDateFormate(r?.transactionDate) || '-',
    r?.transactionTypeName || '-',
    r?.amount || '-',
    r?.notes || '-',
  ])
  return (
    <>
      <div className="page-section">
        <button className="btn-back" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <div className="center section-logo">
          <img src={transactionImg} alt="transactionImg" />
          <p>Client Transaction</p>
        </div>
      </div>

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
        <PdfClientTransactionReportGenerator
          title={`Client transactions Report`}
          columns={ReportTransactionsColumns}
          get={totalPayment}
          give={totalWithdraw}
          rows={TransactionsReportRows}
          clientName={clientId}
          clientPhone={clientId}
        />
      </div>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">I Give</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalPayment || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">I Get</span>
            <div className="amount green">
              <LuDollarSign />
              <span>{totalWithdraw || '00'}</span>
            </div>
          </div>
        </div>
        <span className="center fs-1">
          <span className="total-amount-title">Total Amount: </span>
          <span className="total-amount">
            <LuDollarSign />
            {totalWithdraw - totalPayment}
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
          <div
            className="btn btn-payment"
            onClick={handelAddPaymentTransactionModal}
          >
            I Gave
          </div>
          <div
            className="btn btn-withdraw"
            onClick={handelAddWithdrawTransactionModal}
          >
            I Get
          </div>
        </div>
      </div>
    </>
  )
}

export default ClientsTransactions
