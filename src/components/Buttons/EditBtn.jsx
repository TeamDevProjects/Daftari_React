/* eslint-disable react/prop-types */
import { FaUserEdit } from 'react-icons/fa'

const EditBtn = ({ onEdit, row }) => {
  return (
    <button
      style={{
        marginRight: '5px',
        backgroundColor: '#00b894',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '.25rem',
      }}
      onClick={() => onEdit(row)}
    >
      <FaUserEdit />
    </button>
  )
}

export default EditBtn
