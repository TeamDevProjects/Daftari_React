import { IoIosArrowBack } from 'react-icons/io'
import { LuDollarSign } from 'react-icons/lu'
import { useNavigate, useParams } from 'react-router-dom'
import { Modal } from '../components'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { TransactionsColumns } from '../Constants/TablesColumns'
import SupplierTransactionService from '../Services/supplierTransaction'
import SupplierTransactionsTable from '../components/Tables/SupplierTransactionsTable'
import transactionImg from '../assets/cash-flow.png'
import {
  MODE,
  TRANSACTION_TYPE_NAME,
  TRANSACTION_TYPE_ID,
} from '../Constants/Variables'
import { useCallback } from 'react'
import AddEditSupplierTransactionForm from '../components/Forms/AddEditSupplierTransactionForm'

const SuppliersTransactions = () => {
  const { supplierId } = useParams()
  const [transactions, setTransactions] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionTypeId, setTransactionTypeId] = useState(0)

  const [mode, setMode] = useState(MODE.ADD)

  const [totalPayment, setTotalPayment] = useState(0)
  const [totalWithdraw, setTotalWithdraw] = useState(0)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  const navigate = useNavigate()

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
    if (mode == MODE.ADD) {
      console.log('Add Supplier', transaction)
      await SupplierTransactionService.Add(transaction)
      // setTransactions((prevTransactions) => [...prevTransactions, transaction])
      await fetchTransactions()
      toast.success('Supplier transaction Added Successfully')
    }
    // Update
    else if (mode == MODE.UPDATE) {
      await SupplierTransactionService.Update(
        transaction,
        currentTransaction?.supplierTransactionId
      )
      await fetchTransactions()
      toast.success('Supplier transaction Updated Successfully')
    }
    setModalOpen(false)
  }

  const fetchTransactions = useCallback(async () => {
    try {
      const results = await SupplierTransactionService.GetAll(supplierId)
      if (!results) {
        toast.error("Can't load supplier transactions")
        return
      }
      setTransactions(results)

      const totalPaymentResult = results.reduce(
        (total, transaction) =>
          transaction.transactionTypeName == TRANSACTION_TYPE_NAME.PAYMENT
            ? total + transaction.amount
            : total,
        0
      )

      const totalWithdrawResult = results.reduce(
        (total, transaction) =>
          transaction.transactionTypeName == TRANSACTION_TYPE_NAME.WITHDRAW
            ? total + transaction.amount
            : total,
        0
      )

      setTotalPayment(totalPaymentResult)
      setTotalWithdraw(totalWithdrawResult)
    } catch (error) {
      console.log(error)
      setTransactions([])
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions]) // Empty dependency array ensures that the effect only runs once on mount

  const handelDeleteTransaction = async (transactionId) => {
    try {
      await SupplierTransactionService.Delete(transactionId)
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.supplierTransactionId !== transactionId
        )
      )
      fetchTransactions()
      toast.success('Supplier transaction deleted Successfully')
    } catch (error) {
      toast.error('Failed to delete supplier transaction', error.message)
    }
  }

  const handelEditTransaction = (transaction) => {
    setMode(MODE.UPDATE)
    handleOpenModal()
    setCurrentTransaction(transaction)
  }

  return (
    <>
      <div className="page-section">
        <button className="btn-back" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <div className="center section-logo">
          <img src={transactionImg} alt="supplierImg!!!" />
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
              <span className="">{totalWithdraw || '00'}</span>
            </div>
          </div>
        </div>
        <span className="center fs-1">
          <span className="total-amount-title">Total Amount : </span>
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
            className="btn btn-withdrow"
            onClick={handelAddWithdrawTransactionModal}
          >
            I Get
          </div>
        </div>
      </div>
    </>
  )
}
export default SuppliersTransactions
