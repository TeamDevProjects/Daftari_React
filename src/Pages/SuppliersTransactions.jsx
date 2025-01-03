import { IoIosArrowBack } from 'react-icons/io'
import { LuDollarSign } from 'react-icons/lu'
import { useLoaderData, useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components/UI'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { TransactionsColumns } from '../Constants/TablesColumns'
import SupplierTransactionService from '../Services/supplierTransaction'
import { SupplierTransactionsTable } from '../components/Tables'
import transactionImg from '../assets/cash-flow.png'
import {
  MODE,
  TRANSACTION_TYPE_NAME,
  TRANSACTION_TYPE_ID,
} from '../Constants/Variables'
import AddEditSupplierTransactionForm from '../components/Forms/AddEditSupplierTransactionForm'

export const loader = async ({ params }) => {
  const { supplierId } = params

  try {
    const transactionsResults = await SupplierTransactionService.GetAll(
      supplierId
    )
    if (!transactionsResults) {
      throw new Response("Can't load supplier transactions", { status: 404 })
    }

    const totalPaymentResult = transactionsResults.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === TRANSACTION_TYPE_NAME.PAYMENT
          ? total + transaction.amount
          : total,
      0
    )

    const totalWithdrawResult = transactionsResults.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === TRANSACTION_TYPE_NAME.WITHDRAW
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

const SuppliersTransactions = () => {
  const { supplierId } = useParams()
  const { transactionsResults, totalPaymentResult, totalWithdrawResult } =
    useLoaderData()

  // State management
  const [transactions, setTransactions] = useState(transactionsResults)
  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionTypeId, setTransactionTypeId] = useState(0)
  const [mode, setMode] = useState(MODE.ADD)
  const [totalPayment, setTotalPayment] = useState(totalPaymentResult)
  const [totalWithdraw, setTotalWithdraw] = useState(totalWithdrawResult)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  const navigate = useNavigate()

  // ===================[ Private Methods ]===================
  // Navigate back to the previous page
  const goBack = () => {
    navigate(-1)
  }

  // Open modal for adding payment transaction
  const handleAddPaymentTransactionModal = () => {
    setMode(MODE.ADD)
    setTransactionTypeId(TRANSACTION_TYPE_ID.PAYMENT)
    handleOpenModal()
  }

  // Open modal for adding withdraw transaction
  const handleAddWithdrawTransactionModal = () => {
    setMode(MODE.ADD)
    setTransactionTypeId(TRANSACTION_TYPE_ID.WITHDRAW)
    handleOpenModal()
  }

  // Open the modal
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  // Close the modal
  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Handle form submission (Add or Update)
  const handleSubmit = async (transaction) => {
    try {
      let updatedTransactions

      // Adding a new transaction
      if (mode === MODE.ADD) {
        console.log('Add Supplier', transaction)
        await SupplierTransactionService.Add(transaction)
        toast.success('Supplier transaction Added Successfully')

        updatedTransactions = [...transactions, transaction] // Optimistic update
      } else if (mode === MODE.UPDATE) {
        // Updating an existing transaction
        await SupplierTransactionService.Update(
          transaction,
          currentTransaction?.supplierTransactionId
        )
        toast.success('Supplier transaction Updated Successfully')

        updatedTransactions = transactions.map((t) =>
          t.supplierTransactionId === currentTransaction?.supplierTransactionId
            ? { ...t, ...transaction }
            : t
        )
      }

      // Recalculate totals after the update
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

      // Update state with the new transaction list and recalculated totals
      setTransactions(updatedTransactions)
      setTotalPayment(newTotalPayment)
      setTotalWithdraw(newTotalWithdraw)
    } catch (error) {
      console.error('Failed to submit transaction:', error)
      toast.error('Failed to submit transaction')
    } finally {
      setModalOpen(false)
    }
  }

  // Handle deleting a transaction
  const handleDeleteTransaction = async (transactionId) => {
    try {
      await SupplierTransactionService.Delete(transactionId)

      // Filter out the deleted transaction
      const updatedTransactions = transactions.filter(
        (transaction) => transaction.supplierTransactionId !== transactionId
      )

      // Recalculate totals based on updated transactions
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

      // Update state with the new transaction list and recalculated totals
      setTransactions(updatedTransactions)
      setTotalPayment(newTotalPayment)
      setTotalWithdraw(newTotalWithdraw)

      toast.success('Supplier transaction deleted Successfully')
    } catch (error) {
      toast.error('Failed to delete supplier transaction')
      console.error('Deletion error:', error)
    }
  }

  // Handle editing a transaction
  const handleEditTransaction = (transaction) => {
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
          <img src={transactionImg} alt="supplierImg" />
          <p>Supplier Transaction</p>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditSupplierTransactionForm
          onSubmit={handleSubmit}
          title={'Transaction'}
          buttonText={'Transaction'}
          mode={mode}
          supplierId={supplierId}
          currentTransaction={currentTransaction}
          transactionTypeId={transactionTypeId}
        />
      </Modal>

      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">I Gave</span>
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
        <SupplierTransactionsTable
          columns={TransactionsColumns}
          rows={transactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
        />
        <div className="flex">
          <div
            className="btn btn-payment"
            onClick={handleAddPaymentTransactionModal}
          >
            I Gave
          </div>
          <div
            className="btn btn-withdraw"
            onClick={handleAddWithdrawTransactionModal}
          >
            I Get
          </div>
        </div>
      </div>
    </>
  )
}

export default SuppliersTransactions
