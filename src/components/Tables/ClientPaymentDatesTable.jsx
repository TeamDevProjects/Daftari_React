/* eslint-disable react/prop-types */

import { Link, useNavigate } from 'react-router-dom'
import { handelDateFormate } from '../../assets/Utilities/date'
import { LuDollarSign } from 'react-icons/lu'
import NoPaymentDates from '../Common/NoPaymentDates'

const ClientPaymentDatesTable = ({ columns, rows }) => {
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
    return <NoPaymentDates text='No PaymentDates Founded'/>

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
              <td>{handelDateFormate(row.dateOfPayment) || '-'}</td>
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

export default ClientPaymentDatesTable
