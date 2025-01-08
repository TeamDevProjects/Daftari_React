/* eslint-disable react/prop-types */
import { SubmitBtn } from '../Buttons'
import { FormTextarea, FormDatePicker } from '../UI'
import { useReducer } from 'react'
import { MODE } from '../../Constants/Variables'

// Initial state for the form
const initialState = {
  dateOfPayment: new Date(),
  notes: '',
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

const AddEditPaymentDateForm = ({
  onSubmit,
  title,
  buttonText,
  mode,
  currentPaymentDate,
}) => {
  // Initialize state with a proper merge of initialState and currentPaymentDate
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    ...currentPaymentDate,
  })
    const isMode_Update = mode == MODE.UPDATE

    // Handle input changes for text fields
  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  // Handle date selection
  const handleSelect = (value) => {
    dispatch({ type: 'SET_FIELD_VALUE', field: 'dateOfPayment', value })
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault()

    
    const paymentDate = {
      dateOfPayment: state.dateOfPayment,
      notes: state?.notes ? state?.notes?.trim() : '',
    }

    onSubmit(paymentDate) // Call the provided onSubmit handler
  }
  
  return (
    <>
      <h4 className="form-title">{`${mode} ${title}`}</h4>
      <form className="register-form" onSubmit={handleSubmit}>
        {/* Controlled Date Picker */}
        <FormDatePicker
          onSelect={handleSelect}
          defaultValue={isMode_Update ? state.dateOfPayment:null}
        />
        {/* Controlled Textarea */}
        <FormTextarea
          label="Notes"
          name="notes"
          value={isMode_Update ? state.notes:''}
          onChange={handleChange}
        />
        <div className="submit-btn-container">
          <SubmitBtn text={`${mode} ${buttonText}`} />
        </div>
      </form>
    </>
  )
}

export default AddEditPaymentDateForm
