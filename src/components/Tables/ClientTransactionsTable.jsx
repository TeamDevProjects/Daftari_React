/* eslint-disable react/prop-types */

import { LuDollarSign } from 'react-icons/lu'
import { useState } from 'react'
import { Modal } from '../UI'
import { NoContent } from '../Common'
import { DeleteBtn, EditBtn } from '../Buttons'
import { handelDateTimeFormate } from '../../lib/date'

const ClientTransactionsTable = ({ columns, rows, onEdit, onDelete }) => {
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
              {(onEdit || onDelete) && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.clientTransactionId || '-'}>
                <td>{index + 1 || '-'}</td>
                <td>
                  <div className="td-transaction-type">
                    <span
                      className={`${
                        row?.transactionTypeName == 'Withdrawal'
                          ? 'circle-red'
                          : 'circle-green'
                      }`}
                    >
                      <span>
                        {row?.transactionTypeName === 'Withdrawal' ? '-' : '+'}
                      </span>
                    </span>
                    <span
                      className={`${
                        row?.transactionTypeName == 'Withdrawal'
                          ? 'red'
                          : 'green'
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
                <td className="td-date">
                  {handelDateTimeFormate(row.transactionDate || new Date()) ||
                    '-'}
                </td>
                <td className="td-notes">{row.notes || '-'}</td>
                <td
                  onClick={() =>
                    handelOpenImage({
                      imageType: row.imageType,
                      imageData: row.imageData,
                    })
                  }
                >
                  {(row?.imageType && row?.imageType != 'None' && (
                    <img
                      className="td-img"
                      src={`data:${row.imageType};base64,${row.imageData}`}
                    />
                  )) ||
                    '-'}
                </td>
                {(onEdit || onDelete) && (
                  <td>
                    <div className="flex">
                      {onEdit && <EditBtn onEdit={onEdit} row={row} />}
                      {onDelete && (
                        <DeleteBtn
                          onDelete={onDelete}
                          rowId={row.clientTransactionId}
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
    </>
  )
}

export default ClientTransactionsTable
