import { useEffect, useState } from 'react'
import userTransactionServices from '../Services/userTransaction'
import { toast } from 'react-toastify'
import { handelDateTimeFormate } from '../assets/Utilities/date'
import { useUser } from '../Context/userContext'

const User = () => {
  const { user } = useUser()
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const results = await userTransactionServices.GetAll()
        if (!results) {
          toast.error("Can't load user transactions")
          return
        }
        console.log(results) // You can keep this for debugging, but be aware of its use in production
        setTransactions(results)
      } catch (error) {
        console.log(error)
        setTransactions([])
      }
    }

    fetchTransactions()
  }, []) // Empty dependency array ensures that the effect only runs once on mount

  if (transactions.length === 0)
    return <div className="center">No transactions Found</div>

  return (
    <div className="page-content">
      <div className="flex page-header">
        <h3>store : {user?.storeName}</h3>
        <h2 className="transaction-amount">
          total amount: ${user?.totalAmount}
        </h2>
      </div>
      {transactions.map((t) => (
        <div key={t?.userTransactionId} className="flex transaction-container">
          <button className="flex circle">
            <span>{t?.transactionTypeName === 'Withdrawal' ? '+' : '-'}</span>
          </button>
          <div className="flex transaction-content">
            <div className="transaction-info">
              <span className="transaction-date">
                {handelDateTimeFormate(t?.transactionDate)}
              </span>
              <span className="transaction-type">{t?.transactionTypeName}</span>
            </div>
            <div className="transaction-amount">${t?.amount}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default User
