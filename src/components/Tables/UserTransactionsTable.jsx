/* eslint-disable react/prop-types */
import { handelDateTimeFormate } from '../../assets/Utilities/date'
import { LuDollarSign } from 'react-icons/lu'

const UserTransactionsTable = ({ columns, rows }) => {
  // UserId
  // UserTransactionId
  // TransactionTypeName
  // TransactionDate
  // Amount
  // Notes
  // ImageData
  // ImageType

  if (!columns || !rows || rows.length == 0)
    return <p className="center mb-1">No Content Yet !</p>

  return (
    <div className="table-wrapper">
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.userTransactionId || '-'}>
              <td>{row.userTransactionId || '-'}</td>
              <td>
                <div className="td-transaction-type">
                  <span
                    className={`${
                      row?.transactionTypeName == 'Withdrawal'
                        ? 'circle-withdrawal'
                        : 'circle-payment'
                    }`}
                  >
                    <span>
                      {row?.transactionTypeName === 'Withdrawal' ? '+' : '-'}
                    </span>
                  </span>
                  <span
                    className={`${
                      row?.transactionTypeName == 'Withdrawal' ? 'green' : 'red'
                    }`}
                  >
                    {row.transactionTypeName}
                  </span>
                </div>
              </td>
              <td>
                <div className="td-amount">

                <LuDollarSign />
                {row.amount}
                </div>
              </td>
              <td>{handelDateTimeFormate(row.transactionDate) || '-'}</td>
              <td className="td-notes">{row.notes || '-'}</td>
              <td>
                {(row.imageType && (
                  <img src={`data:${row.imageType};base64,${row.imageData}`} />
                )) ||
                  '-'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTransactionsTable
