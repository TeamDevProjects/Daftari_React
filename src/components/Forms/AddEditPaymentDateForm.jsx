/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import { SubmitBtn } from '../Buttons'
import { FormTextarea, FormDatePicker } from '../UI'
import { useReducer } from 'react'
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
  clientId,
  currentPaymentDate,
}) => {
  const [state, dispatch] = useReducer(
    reducer,
    currentPaymentDate || initialState
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handleSelect = (date) => {
    dispatch({ type: 'SET_FIELD_VALUE', field: 'dateOfPayment', date })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const Person = {
      dateOfPayment: state?.dateOfPayment,
      notes: state?.notes.trim(),
      clientId: clientId,
    }

    onSubmit(Person)
  }
  return (
    <>
      <h4 className="form-title">{mode + ' ' + title}</h4>
      <Form className="register-form" onSubmit={handleSubmit}>
        <FormDatePicker
          onSelect={handleSelect}
          defaultValue={state?.dateOfPayment}
        />
        <FormTextarea
          label="Notes"
          name="notes"
          defaultValue={state?.notes}
          onChange={handleChange}
        />
        <div className="submit-btn-container">
          <SubmitBtn text={mode + ' ' + buttonText} />
        </div>
      </Form>
    </>
  )
}

export default AddEditPaymentDateForm
