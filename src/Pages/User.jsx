import { useEffect, useState } from 'react'
import userTransactionServices from '../Services/userTransaction'
import { toast } from 'react-toastify'
import { useUser } from '../Context/userContext'
import { LuDollarSign } from 'react-icons/lu'
import UserTransactionsTable from '../components/Tables/UserTransactionsTable'
import { UserTransactionsColumns } from '../Constants/TablesColumns'
import { Modal } from '../components'
import AddEditTransactionForm from '../components/Forms/AddEditTransactionForm'

const User = () => {
  const [transactions, setTransactions] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [transactionType, setTransactionType] = useState(0)

  const [mode, setMode] = useState('Add')

  const handelAddPaymentTransactionModal = () => {
    setMode('Add')
    setTransactionType(1)
    handleOpenModal()
  }
  const handelAddWidthdrowTransactionModal = () => {
    setMode('Add')
    setTransactionType(2)
    handleOpenModal()
  }
  // const handelUpdateSupplierModal = () => {
  //   setMode('Update')
  //   handleOpenModal()
  // }

  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = (supplier) => {
    if (mode == 'Add') {
      console.log('Add Supplier', supplier)
      toast.success('Supplier Added Successfully')
      return
    }
    // Update
    console.log('Edit Supplier', supplier)
    toast.success('Supplier Updated Successfully')
    setModalOpen(false)
  }
  // const [totalPayment, setTotalPayment] = useState(0)
  // const [totalWidthdrol, setTotalWidthdrol] = useState(0)
  const { user } = useUser()
  const fetchTransactions = async () => {
    try {
      const results = await userTransactionServices.GetAll()
      if (!results) {
        toast.error("Can't load user transactions")
        return
      }
      setTransactions(results)
      console.log(results) // You can keep this for debugging, but be aware of its use in production
    } catch (error) {
      console.log(error)
      setTransactions([])
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, []) // Empty dependency array ensures that the effect only runs once on mount

  if (transactions.length === 0)
    return <div className="center">No transactions Found</div>

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditTransactionForm
          onSubmit={handleSubmit}
          title={'Transaction'}
          buttonText={'Transaction'}
          mode={mode}
          TransactionTypeId={transactionType}
        />
      </Modal>
      <div className="page-section">
        <h4>store : {user?.storeName}</h4>
      </div>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">Payment</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{'00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">Withdrow</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{'00'}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="page-section">
        <UserTransactionsTable
          columns={UserTransactionsColumns}
          rows={transactions}
        />
        <div className="flex">
          <div
            className="btn btn-payment"
            onClick={handelAddPaymentTransactionModal}
          >
            Payment
          </div>
          <div
            className="btn btn-withdrow"
            onClick={handelAddWidthdrowTransactionModal}
          >
            Withdrow
          </div>
        </div>
      </div>
    </>
  )
}

export default User
