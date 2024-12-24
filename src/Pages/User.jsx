import { useState } from 'react'
import userTransactionServices from '../Services/userTransaction'
import { toast } from 'react-toastify'
import { useUser } from '../Context/userContext'
import { LuDollarSign } from 'react-icons/lu'
import UserTransactionsTable from '../components/Tables/UserTransactionsTable'
import { TransactionsColumns } from '../Constants/TablesColumns'
import { Modal } from '../components'
import transactionImg from '../assets/cash-flow.png'
import AddEditUserTransactionForm from '../components/Forms/AddEditUserTransactionForm'
import { useLoaderData } from 'react-router-dom'
import {
  MODE,
  TRANSACTION_TYPE_NAME,
  TRANSACTION_TYPE_ID,
} from '../Constants/Variables'

const UserQuery = {
  queryKey: ['UserQuery'],
  queryFn: () => userTransactionServices.GetAll(),
}

export const loader = (queryClient) => async () => {
  try {
    const results = await queryClient.ensureQueryData(UserQuery)
    if (!results || results.length === 0) {
      throw new Error("Can't load user transactions")
    }

    const totalPaymentResult = results.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === 'Payment'
          ? total + transaction.amount
          : total,
      0
    )

    const totalWithdrawResult = results.reduce(
      (total, transaction) =>
        transaction.transactionTypeName === 'Withdrawal'
          ? total + transaction.amount
          : total,
      0
    )

    return {
      results,
      totalPaymentResult,
      totalWithdrawResult,
    }
  } catch (error) {
    return {
      results: [],
      totalPaymentResult: 0,
      totalWithdrawResult: 0,
    }
  }
}

const User = () => {
   const { user } = useUser()
  const { results, totalPaymentResult, totalWithdrawResult } = useLoaderData()
  const [transactions, setTransactions] = useState(results)
  const [transactionType, setTransactionType] = useState(0)

  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionTypeId, setTransactionTypeId] = useState(0)

  const [mode, setMode] = useState(MODE.ADD)

  const [currentTransaction, setCurrentTransaction] = useState(null)
  const [totalPayment, setTotalPayment] = useState(totalPaymentResult)
  const [totalWithdraw, setTotalWithdraw] = useState(totalWithdrawResult)

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

  // const handleSubmit = async (transaction) => {
  //   if (mode == MODE.ADD) {
  //     console.log('Add user transaction', transaction)
  //     await userTransactionServices.Add(transaction)
  //     // setTransactions((prevTransactions) => [...prevTransactions, transaction])
  //     await fetchTransactions()
  //     toast.success('user transaction Added Successfully')
  //   }
  //   // Update
  //   else if (mode == MODE.UPDATE) {
  //     console.log('Edit user transaction', transaction)
  //     await userTransactionServices.Update(
  //       transaction,
  //       currentTransaction?.userTransactionId
  //     )
  //     await fetchTransactions()
  //     toast.success('user transaction Updated Successfully')
  //   }
  //   setModalOpen(false)
  // }

  /*const fetchTransactions = useCallback(async () => {
     const fetchTransactions = async () => {
    try {
      const results = await userTransactionServices.GetAll()
      if (!results) {
        toast.error("Can't load user transactions")
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
  }, []
  */

  // useEffect(() => {
  //   fetchTransactions()
  // }, [fetchTransactions]) // Empty dependency array ensures that the effect only runs once on mount

  const handelDeleteTransaction = async (transactionId) => {
    try {
      await userTransactionServices.Delete(transactionId)
      setTransactions((prevTransactions) =>
        prevTransactions.filter(
          (transaction) => transaction.userTransactionId !== transactionId
        )
      )
      fetchTransactions()
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
 
  if (transactions.length === 0)
    return <div className="center">No transactions Found</div>

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditUserTransactionForm
          // onSubmit={handleSubmit}
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
          <p>My Transaction</p>
        </div>
      </div>
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
        <UserTransactionsTable
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
            I Give
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

export default User
