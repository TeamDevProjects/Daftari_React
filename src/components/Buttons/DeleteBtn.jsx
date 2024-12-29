/* eslint-disable react/prop-types */
import { MdDelete } from 'react-icons/md'

const DeleteBtn = ({ onDelete, rowId }) => {
  return (
    <button
      style={{
        backgroundColor: '#d63031',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '.25rem'
      }}
      onClick={() => onDelete(rowId)}
    >
      <MdDelete />
    </button>
  )
}

export default DeleteBtn
