/* eslint-disable react/prop-types */

import { Link, useNavigate } from 'react-router-dom'
import { LuDollarSign } from 'react-icons/lu'
import { NoPaymentDates } from '../Common'
import { DeleteBtn, EditBtn } from '../Buttons'
import { handelDateFormate } from '../../lib/date'

const ClientPaymentDatesTable = ({ columns, rows, onDelete, onEdit }) => {
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
    return <NoPaymentDates text="No PaymentDates Founded" />

  return (
    <div className="table-wrapper">
      <table border="1" style={{ width: '100%', textAlign: 'left' }}>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col}</th>
            ))}
            {(onEdit || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.clientPaymentDateId || '-'}>
              <td>{index + 1}</td>
              <td>
                <Link onClick={goBackHandler}>{row.name || '-'}</Link>
              </td>
              <td>{row.phone || '-'}</td>
              <td className='td-date'>{handelDateFormate(row.dateOfPayment) || '-'}</td>
              <td>
                <LuDollarSign />
                {row.totalAmount}
              </td>
              <td>{row.paymentMethodName || '-'}</td>
              <td className="td-notes">{row.notes || '-'}</td>
              {(onEdit || onDelete) && (
                <td>
                  <div className="flex">
                    {onEdit && <EditBtn onEdit={onEdit} row={row} />}
                    {onDelete && (
                      <DeleteBtn
                        onDelete={onDelete}
                        rowId={row.clientPaymentDateId}
                      />
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ClientPaymentDatesTable
