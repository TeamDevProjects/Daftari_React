import { useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LuDollarSign } from 'react-icons/lu'
import transactionImg from '../assets/cash-flow.png'
import userTransactionServices from '../Services/userTransaction'
import { useUser } from '../Context/userContext'
import { TransactionsColumns } from '../Constants/TablesColumns'
import { Modal } from '../components/UI'
import { UserTransactionsTable } from '../components/Tables'
import { AddEditUserTransactionForm } from '../components/Forms'
import {
  MODE,
  TRANSACTION_TYPE_NAME,
  TRANSACTION_TYPE_ID,
  UI,
} from '../Constants/Variables'
import { queryClient } from '../App'
import { REACT_QUERY_NAME } from '../Constants/Variables'
import PdfUserTransactionReportGenerator from '../components/Reports/PdfUserTransactionReportGenerator'
import { ReportTransactionsColumns } from '../Constants/ReportColumns'
import { handelDateFormate } from '../assets/Utilities/date'

const _getAllUserTransactions = async () => {
  try {
    return await userTransactionServices.GetAll()
  } catch (error) {
    toast.error(error.message)
    return
  }
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

const UserQuery = {
  queryKey: [REACT_QUERY_NAME.USER_TRANSACTIONS],
  queryFn: async () => await _getAllUserTransactions(),
}

export const loader = (queryClient) => async () => {
  try {
    const initialTransactions = await queryClient.ensureQueryData(UserQuery)
    if (!initialTransactions || initialTransactions.length === 0) {
      throw new Error("Can't load user transactions")
    }

    const initialTotalPayment = _calcTotalPayment(initialTransactions)

    const initialTotalWithdraw = _calcTotalWithdraw(initialTransactions)

    return {
      initialTransactions,
      initialTotalPayment,
      initialTotalWithdraw,
    }
  } catch {
    return {
      initialTransactions: [],
      initialTotalPayment: 0,
      initialTotalWithdraw: 0,
    }
  }
}

const User = () => {
  const { user } = useUser()

  const { initialTransactions, initialTotalPayment, initialTotalWithdraw } =
    useLoaderData()
  const [transactions, setTransactions] = useState(initialTransactions)
  const [totalPayment, setTotalPayment] = useState(initialTotalPayment)
  const [totalWithdraw, setTotalWithdraw] = useState(initialTotalWithdraw)

  const [transactionTypeId, setTransactionTypeId] = useState(0)
  const [currentTransaction, setCurrentTransaction] = useState(null)

  const [isModalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState(MODE.ADD)

  // ==============[ Privet Methods ]==================
  const _refreshTransactions = async () => {
    try {
      const newTransactions = await _getAllUserTransactions()

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
      await userTransactionServices.Add(transaction)
      toast.success('user transaction Added Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  const _updateTransaction = async (transaction) => {
    try {
      console.log('Edit user transaction', transaction)
      await userTransactionServices.Update(
        transaction,
        currentTransaction?.userTransactionId
      )
      toast.success('user transaction Updated Successfully')
    } catch (error) {
      toast.error(error?.message)
    }
  }

  // ================[ Handel UI ]=====================
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
      await userTransactionServices.Delete(transactionId)
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.userTransactionId !== transactionId
        )
      )

      // Refresh
      await _refresh()

      toast.success('user transaction deleted Successfully')
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
  const balance = totalPayment - totalWithdraw
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditUserTransactionForm
          onSubmit={handleSubmit}
          title={'Transaction'}
          buttonText={'Transaction'}
          mode={mode}
          currentTransaction={currentTransaction}
          transactionTypeId={transactionTypeId}
        />
      </Modal>
      <div className="page-section">
        <h4 className="header-title">store : {user?.storeName}</h4>
        <div className="center section-logo">
          <img src={transactionImg} alt="supplierImg!!!" />
          <p>{UI.HEADER.USERS_TRANSACTIONS}</p>
        </div>
      </div>
      <div className="page-section">
        <PdfUserTransactionReportGenerator
          title={`User transactions Report`}
          columns={ReportTransactionsColumns}
          got={totalWithdraw}
          gave={totalPayment}
          balance={balance}
          rows={TransactionsReportRows}
          userName={user?.name}
          userPhone={user?.phone}
        />
      </div>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">{UI.TEXT.I_GOT}</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="">{totalWithdraw || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">{UI.TEXT.I_GAVE}</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{totalPayment || '00'}</span>
            </div>
          </div>
        </div>
        <span className="center fs-1">
          <span className="total-amount-title">
            {`${UI.TEXT.GLOBAL_BALANCE} : `}
          </span>
          <span className="total-amount">
            <LuDollarSign />
            {balance}
          </span>
        </span>
      </div>
      <div className="page-section">
        <UserTransactionsTable
          columns={TransactionsColumns}
          rows={transactions}
          onDelete={handelDeleteTransaction}
          onEdit={handelEditTransaction}
        />
        <div className="flex">
          <div
            className="btn btn-red"
            onClick={handelAddWithdrawTransactionModal}
          >
            {UI.TEXT.I_GOT}
          </div>

          <div
            className="btn btn-green"
            onClick={handelAddPaymentTransactionModal}
          >
            {UI.TEXT.I_GAVE}
          </div>
        </div>
      </div>
    </>
  )
}

export default User
