/* eslint-disable react/prop-types */
import { FaUserEdit } from 'react-icons/fa'

const EditBtn = ({ onEdit, row }) => {
  return (
    <button
      className='btn-update'
      onClick={() => onEdit(row)}
    >
      <FaUserEdit />
    </button>
  )
}

export default EditBtn
