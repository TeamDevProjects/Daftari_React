/* eslint-disable react/prop-types */

import { useNavigate } from 'react-router-dom'
import { NoContent } from '../Common'
import { DeleteBtn, EditBtn } from '../Buttons'
import { handelDateFormate } from '../../lib/date'

const SuppliersTable = ({ columns, rows, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const handelNavigation = (supplierId, name, phone) => {
    // navigate to SuppliersTransactions and send Date to this path
    navigate(`SuppliersTransactions/${supplierId}`, {
      state: {
        supplierName: name,
        supplierPhone: phone,
      },
    })
  }
  if (rows?.length == 0) return <NoContent text="No Suppliers found." />

  return (
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
              <tr key={row?.supplierId || '-'}>
                <td>{index + 1 || '-'}</td>
                <td className="td-name">
                  <span
                    onClick={() =>
                      handelNavigation(row?.supplierId, row?.name, row?.phone)
                    }
                  >
                    {row?.name || '-'}
                  </span>
                </td>
                <td>{row?.country || '-'}</td>
                <td>{row?.city || '-'}</td>
                <td>{row?.address || '-'}</td>
                <td>{row?.phone || '-'}</td>
                <td className="td-date">
                  {handelDateFormate(row?.dateOfPayment) || '-'}
                </td>
                <td>{row?.totalAmount || '-'}</td>
                <td>{row?.paymentMethodName || '-'}</td>
                {(onEdit || onDelete) && (
                  <td>
                    <div className="flex">
                      {onEdit && <EditBtn onEdit={onEdit} row={row} />}
                      {onDelete && (
                        <DeleteBtn onDelete={onDelete} rowId={row.supplierId} />
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
  )
}

export default SuppliersTable
