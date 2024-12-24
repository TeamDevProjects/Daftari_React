/* eslint-disable react/prop-types */
import { MdDelete } from 'react-icons/md'
import { handelDateTimeFormate } from '../../assets/Utilities/date'
import { LuDollarSign } from 'react-icons/lu'
import { FaUserEdit } from 'react-icons/fa'
import NoContent from '../Common/NoContent'
import { useState } from 'react'
import Modal from '../Modal'

const SupplierTransactionsTable = ({ columns, rows, onEdit, onDelete }) => {
  // rowPaymentDateId
  // name
  // dateOfPayment
  // paymentMethodName
  // notes
  // phone
  // clientId
  // userId
const [isModalOpen, setModalOpen] = useState(false)
  const [currentImg, setCurrentImg] = useState(false)
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }
  const handelOpenImage = ({ imageType, imageData }) => {
    handleOpenModal()
    setCurrentImg({ imageType, imageData })
  }
  if (!columns || !rows || rows.length == 0)
    return <NoContent text="no Transactions yet !" />

  return (
    <>
      {currentImg.imageType && currentImg.imageData && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          style={{ padding: 0 }}
        >
          <img
            style={{ width: '100%', display: 'block' }}
            src={`data:${currentImg.imageType};base64,${currentImg.imageData}`}
          />
        </Modal>
      )}
      <div className="table-wrapper">
        <table border="1" style={{ width: '100%', textAlign: 'left' }}>
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index}>{col}</th>
              ))}
              {<th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.supplierTransactionId || '-'}>
                <td>{index + 1 || '-'}</td>
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
                        row?.transactionTypeName == 'Withdrawal'
                          ? 'green'
                          : 'red'
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
                <td
                  onClick={() =>
                    handelOpenImage({
                      imageType: row.imageType,
                      imageData: row.imageData,
                    })
                  }
                >
                  {(row.imageType && (
                    <img
                      style={{ width: '4rem' }}
                      src={`data:${row.imageType};base64,${row.imageData}`}
                    />
                  )) ||
                    '-'}
                </td>
                {
                  <td>
                    <div className="flex">
                      {onEdit && (
                        <button
                          style={{
                            marginRight: '5px',
                            backgroundColor: '#00b894',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={() => onEdit(row)}
                        >
                          <FaUserEdit />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          style={{
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={() => onDelete(row.supplierTransactionId)}
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                  </td>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

export default SupplierTransactionsTable
