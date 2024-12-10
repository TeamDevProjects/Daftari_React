/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react'

const Modal = ({
  children,
  isOpen = false,
  onClose,
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
      <div className="modal">
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
          <span>x</span>
        </button>
        {/* </div> */}
      </div>
    </aside>
  )
}

export default Modal
