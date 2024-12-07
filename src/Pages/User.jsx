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
      const results = await userTransactionServices.GetAll()
      console.log(results)
      setTransactions(results)
      if (!results) {
        toast.error('can`t load user transactions')
      }
    }

    fetchTransactions()

    console.log(transactions)
  }, [])

  if (transactions.length == 0)
    return <div className="center">No transactions Founded</div>
  return (
    <div className="page-content">
      <div className="flex page-header">
        <h3>store : {user.storeName}</h3>
        <h2 className="transaction-amount">
          total amount: ${user.totalAmount}
        </h2>
      </div>
      {transactions.map((t) => (
        <div key={t?.userTransactionId} className="flex transaction-container">
          <button className="flex circle">
            <span>{t?.transactionTypeName == 'Withdrawal' ? '+' : '-'}</span>
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
