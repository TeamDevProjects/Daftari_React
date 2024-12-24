/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import FormInput from '../FormInput'
import SubmitBtn from '../SubmitBtn'
import FormTextarea from '../FormTextarea'
import { useReducer, useState } from 'react'

// Initial state for the form
const initialState = {
  notes: '',
  amount: 0,
}

// Reducer function to handle form state
const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_FIELD_VALUE':
      return {
        ...state,
        [action.field]: action.value,
      }
    default:
      return state
  }
}

const AddEditClientTransactionForm = ({
  onSubmit,
  title,
  buttonText,
  transactionTypeId,
  mode,
  clientId,
  currentTransaction,
}) => {
  const [selectedFile, setSelectedFile] = useState(null)

  const [state, dispatch] = useReducer(
    reducer,
    currentTransaction || initialState
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    console.log('Selected files:', files) // Log selected files
    setSelectedFile(files[0])
  }

  const openFileSelector = (acceptType) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptType // Set file type filter (image, video, pdf)
    input.multiple = false // Allow multiple file selection
    input.onchange = handleFileChange // Trigger file change event
    input.click() // Open file explorer
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const tarnsaction = {
      amount: state?.amount,
      notes: state?.notes?.trim(),
      clientId: clientId,
      transactionTypeId: transactionTypeId,
      file: selectedFile,
    }

    onSubmit(tarnsaction)
  }
  return (
    <>
      <h4 className="form-title">{mode + ' ' + title}</h4>
      <Form className="register-form" onSubmit={handleSubmit}>
        <FormInput
          type="number"
          label="Amount"
          name="amount"
          defaultValue={state?.amount}
          onChange={handleChange}
        />

        <FormTextarea
          label="Notes"
          name="notes"
          defaultValue={state?.notes}
          onChange={handleChange}
        />

        <button
          type="button"
          onClick={() => openFileSelector('image/*')}
          className="btn btn-upload"
        >
          <svg
            className=""
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 18"
          >
            <path
              fill="currentColor"
              d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
            />
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
            />
          </svg>
          <span className="ml-2 font-normal text-sm">Upload Image</span>
        </button>

        <p>{selectedFile ? selectedFile.name : ''}</p>
        <div className="submit-btn-container">
          <SubmitBtn text={mode + ' ' + buttonText} />
        </div>
      </Form>
    </>
  )
}

export default AddEditClientTransactionForm
