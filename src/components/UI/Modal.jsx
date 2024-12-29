/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'
import { IoIosClose } from 'react-icons/io'

const Modal = ({
  children,
  isOpen = false,
  onClose,
  style
  // onSubmit,
  // title,
  // buttonText,
}) => {
  const [isOpenModal, setModal] = useState(isOpen)

  // Sync internal state with the `isOpen` prop
  useEffect(() => {
    setModal(isOpen)
  }, [isOpen])

  const closeModal = () => {
    setModal(false)
    if (onClose) onClose() // Call the parent onClose callback if provided
  }

  if (!isOpenModal) return null

  return (
    <aside className={`modal-container`}>
      <div className="modal" style={style}>
        {/* <h3>{title}</h3> */}
        {children}
        {/* <div className="btn-container"> */}
        {/* <button type="button" className="btn confirm-btn" onClick={onSubmit}>
            {buttonText ? buttonText : 'Confirm'}
          </button> */}
        <button
          type="button"
          className="btn clear-btn center"
          onClick={closeModal}
        >
          <IoIosClose />
        </button>
        {/* </div> */}
      </div>
    </aside>
  )
}

export default Modal
