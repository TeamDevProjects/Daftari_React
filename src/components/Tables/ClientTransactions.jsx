/* eslint-disable react/prop-types */

import { LuDollarSign } from "react-icons/lu"
import { Link, useNavigate } from "react-router-dom"
import { handelDateTimeFormate } from "../../assets/Utilities/date"

const ClientTransactions=({ columns, rows }) => {
  // rowPaymentDateId
  // name
  // dateOfPayment
  // paymentMethodName
  // notes
  // phone
  // clientId
  // userId
  const navigate = useNavigate()

  const goBackHandler = () => {
    navigate(-1)
  }
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
            <tr key={row.clientPaymentDateId || '-'}>
              <td>{row.clientPaymentDateId || '-'}</td>
              <td>
                <Link onClick={goBackHandler}>{row.name || '-'}</Link>
              </td>
              <td>{row.phone || '-'}</td>
              <td>{handelDateTimeFormate(row.dateOfPayment) || '-'}</td>
              <td>
                <LuDollarSign />
                {row.totalAmount}
              </td>
              <td>{row.paymentMethodName || '-'}</td>
              <td className="td-notes">{row.notes || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientTransactions
