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
} from '../Constants/Variables'
import AddEditClientTransactionForm from '../components/Forms/AddEditClientTransactionForm'

export const loader = async ({ params }) => {
  const { clientId } = params
  try {
    const transactionsResults = await clientTransactionService.GetAll(clientId)

    if (!transactionsResults) {
      throw new Error("Can't load client transactions")
    }

    const totalPaymentResult = transactionsResults.reduce(
      (total, transaction) =>
        transaction.transactionTypeName == TRANSACTION_TYPE_NAME.PAYMENT
          ? total + transaction.amount
          : total,
      0
    )

    const totalWithdrawResult = transactionsResults.reduce(
      (total, transaction) =>
        transaction.transactionTypeName == TRANSACTION_TYPE_NAME.WITHDRAW
          ? total + transaction.amount
          : total,
      0
    )

    return {
      transactionsResults,
      totalPaymentResult,
      totalWithdrawResult,
    }
  } catch (error) {
    console.error(error)
    return {
      transactionsResults: [],
      totalPaymentResult: 0,
      totalWithdrawResult: 0,
    }
  }
}

const ClientsTransactions = () => {
  const { clientId } = useParams()

  // Use loader data
  const { transactionsResults, totalPaymentResult, totalWithdrawResult } =
    useLoaderData()
  const [transactions, setTransactions] = useState(transactionsResults)
  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionTypeId, setTransactionTypeId] = useState(0)
  const [mode, setMode] = useState(MODE.ADD)
  const [totalPayment, setTotalPayment] = useState(totalPaymentResult)
  const [totalWithdraw, setTotalWithdraw] = useState(totalWithdrawResult)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  const navigate = useNavigate()
  // ==============[ Privet Methods ]==================
  // ================[ Handel UI ]=====================
  // ==============[ Action Methods ]==================
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

  const handleSubmit = async (transaction) => {
    try {
      let updatedTransactions

      if (mode === MODE.ADD) {
        // Add the transaction to the backend
        await clientTransactionService.Add(transaction)

        // Optimistically add the new transaction to the transactions list
        updatedTransactions = [...transactions, transaction]

        toast.success('Client transaction added successfully')
      } else if (mode === MODE.UPDATE) {
        // Update the transaction in the backend
        await clientTransactionService.Update(
          transaction,
          currentTransaction?.clientTransactionId
        )

        // Update the transaction in the transactions list
        updatedTransactions = transactions.map((t) =>
          t.clientTransactionId === currentTransaction?.clientTransactionId
            ? { ...t, ...transaction }
            : t
        )

        toast.success('Client transaction updated successfully')
      }

      // Recalculate totals
      const newTotalPayment = updatedTransactions.reduce(
        (total, trans) =>
          trans.transactionTypeName === TRANSACTION_TYPE_NAME.PAYMENT
            ? total + trans.amount
            : total,
        0
      )

      const newTotalWithdraw = updatedTransactions.reduce(
        (total, trans) =>
          trans.transactionTypeName === TRANSACTION_TYPE_NAME.WITHDRAW
            ? total + trans.amount
            : total,
        0
      )

      // Update state
      setTransactions(updatedTransactions)
      setTotalPayment(newTotalPayment)
      setTotalWithdraw(newTotalWithdraw)

      // Close the modal
      setModalOpen(false)
    } catch (error) {
      toast.error('Failed to submit client transaction')
      console.error('Submission error:', error)
    }
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
    setCurrentTransaction(transaction)
    handleOpenModal()
  }

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
