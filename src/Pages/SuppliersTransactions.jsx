import { IoIosArrowBack } from 'react-icons/io'
import { LuDollarSign } from 'react-icons/lu'
import {
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import { Modal } from '../components/UI'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { TransactionsColumns } from '../Constants/TablesColumns'
import SupplierTransactionService from '../Services/supplierTransaction'
import { SupplierTransactionsTable } from '../components/Tables'
import transactionImg from '../assets/cash-flow.png'
import {
  MODE,
  TRANSACTION_TYPE_ID,
  REACT_QUERY_NAME,
  UI,
} from '../Constants/Variables'
import AddEditSupplierTransactionForm from '../components/Forms/AddEditSupplierTransactionForm'
import { ReportTransactionsColumns } from '../Constants/ReportColumns'
import PdfSupplierTransactionReportGenerator from '../components/Reports/PdfSupplierTransactionReportGenerator'
import { queryClient } from '../App'
import { calcTotalPayment, calcTotalWithdraw } from '../lib/helpers'
import { handelDateFormate } from '../lib/date'
import Info from '../components/Info'

const _gotAllSupplierTransactions = async (supplierId) => {
  try {
    return await SupplierTransactionService.GetAll(supplierId)
  } catch (error) {
    toast.error(error.message)
    return
  }
}

export const loader = async ({ params }) => {
  const { supplierId } = params

  try {
    const initialTransactions = await _gotAllSupplierTransactions(supplierId)

    if (!initialTransactions) {
      throw new Response("Can't load supplier transactions", { status: 404 })
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

const SuppliersTransactions = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const { supplierId } = useParams()
  const { supplierName, supplierPhone } = location.state || {} // Destructure the state
  const { initialTransactions, totalPaymentResult, totalWithdrawResult } =
    useLoaderData()

  // State management
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
      const newTransactions = await _gotAllSupplierTransactions(supplierId)

      if (!newTransactions) {
        toast.error("Can't load user transactions")
        return
      }
      setTransactions(newTransactions)
      //
      queryClient.removeQueries(REACT_QUERY_NAME.SUPPLIER_TRANSACTIONS)
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
      console.log('Add user transaction', transaction)
      await SupplierTransactionService.Add(transaction)
      toast.success('user transaction Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateTransaction = async (transaction) => {
    try {
      console.log('Edit user transaction', transaction)
      await SupplierTransactionService.Update(
        transaction,
        currentTransaction?.supplierTransactionId
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
      await SupplierTransactionService.Delete(transactionId)
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

  // Handle editing a transaction
  const handleEditTransaction = (transaction) => {
    setMode(MODE.UPDATE)
    setCurrentTransaction(transaction)
    handleOpenModal()
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
      <div className="page-section">
        <button className="btn-back" onClick={goBack}>
          <IoIosArrowBack />
        </button>
        <div className="center section-logo">
          <img src={transactionImg} alt="supplierImg" />
          <p>{UI.HEADER.SUPPLIERS_TRANSACTIONS}</p>
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

      <div className="page-section flex-between">
        <PdfSupplierTransactionReportGenerator
          title={`Supplier transactions Report`}
          columns={ReportTransactionsColumns}
          got={totalWithdraw}
          gave={totalPayment}
          balance={balance}
          rows={TransactionsReportRows}
          supplierName={supplierName}
          supplierPhone={supplierPhone}
        />
        <Info name={supplierName} phone={supplierPhone} />
      </div>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">{UI.TEXT.I_GAVE}</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalPayment || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">{UI.TEXT.I_GOT}</span>
            <div className="amount green">
              <LuDollarSign />
              <span>{totalWithdraw || '00'}</span>
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
        <SupplierTransactionsTable
          columns={TransactionsColumns}
          rows={transactions}
          onDelete={handelDeleteTransaction}
          onEdit={handleEditTransaction}
        />
        <div className="flex">
          <div
            className="btn btn-red"
            onClick={handelAddPaymentTransactionModal}
          >
            {UI.TEXT.I_GAVE}
          </div>
          <div
            className="btn btn-green"
            onClick={handelAddWithdrawTransactionModal}
          >
            {UI.TEXT.I_GOT}
          </div>
        </div>
      </div>
    </>
  )
}

export default SuppliersTransactions
