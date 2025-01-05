/* eslint-disable react/prop-types */
import { MdDelete } from 'react-icons/md'

const DeleteBtn = ({ onDelete, rowId }) => {
  return (
    <button
      className='btn-delete'
      onClick={() => onDelete(rowId)}
    >
      <MdDelete />
    </button>
  )
}

export default DeleteBtn
