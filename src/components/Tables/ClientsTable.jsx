/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom'
import { NoContent } from '../Common'
import { handelDateFormate } from '../../assets/Utilities/date'
import { DeleteBtn, EditBtn } from '../Buttons'

const ClientsTable = ({ columns, rows, onEdit, onDelete }) => {
  if (rows?.length == 0) return <NoContent text="No Clients found." />

  return (
    <>
      <div className="table-wrapper">
        {rows && rows.length > 0 && (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row, index) => (
                <tr key={row?.clientId || '-'}>
                  <td>{index + 1 || '-'}</td>
                  <td>
                    <Link to={`ClientsTransactions/${row?.clientId}`}>
                      {row?.name || '-'}
                    </Link>
                  </td>
                  <td>{row?.country || '-'}</td>
                  <td>{row?.city || '-'}</td>
                  <td>{row?.address || '-'}</td>
                  <td>{row?.phone || '-'}</td>
                  <td>{handelDateFormate(row?.dateOfPayment) || '-'}</td>
                  <td>{row?.totalAmount || '-'}</td>
                  <td>{row?.paymentMethodName || '-'}</td>
                  {(onEdit || onDelete) && (
                    <td>
                      <div className="flex">
                        {onEdit && <EditBtn onEdit={onEdit} row={row} />}
                        {onDelete && (
                          <DeleteBtn onDelete={onDelete} rowId={row.clientId} />
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

export default ClientsTable
