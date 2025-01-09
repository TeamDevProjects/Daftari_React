/* eslint-disable react/prop-types */

const AddTransactionBtn = ({ buttonType, onClick, children }) => {
  return (
    <button
      className={`btn ${buttonType == 'red' ? 'btn-red' : 'btn-green'}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default AddTransactionBtn
