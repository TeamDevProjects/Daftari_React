import { useUser } from '../Context/userContext'

const Modal = () => {
  const { CloseModal } = useUser()

  return (
    <aside className="modal-container">
      <div className="modal">
        <h4>Add new client</h4>
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <div className="btn-container">
          <button
            type="button"
            className="btn confirm-btn"
            /*   onClick={() => {
              
            }} */
          >
            confirm
          </button>
          <button
            type="button"
            className="btn clear-btn center"
            onClick={() => {
              CloseModal()
            }}
          >
            cancel
          </button>
        </div>
      </div>
    </aside>
  )
}
export default Modal
