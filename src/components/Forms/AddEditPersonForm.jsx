/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import { FormInput } from '../UI'
import SubmitBtn from '../Buttons/SubmitBtn'
import { useReducer } from 'react'
// Initial state for the form
const initialState = {
  name: '',
  phone: '',
  city: '',
  country: '',
  address: '',
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
const AddEditPersonForm = ({
  onSubmit,
  title,
  buttonText,
  mode,
  currentPerson,
}) => {
  const [state, dispatch] = useReducer(reducer, currentPerson || initialState)

  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handlePhoneOnkeyDown = (e) => {
    const charCode = e.charCode
    if (charCode < 48 || charCode > 57) {
      e.preventDefault()
    }
  }
  const handleSubmit = (e) => {
    e.preventDefault()

    const Person = {
      name: state?.name?.trim(),
      phone: state?.phone?.trim(),
      city: state?.city?.trim(),
      country: state?.country?.trim(),
      address: state?.address?.trim(),
      notes: state?.notes ? state?.notes?.trim() : '',
    }

    console.log(Person)
    onSubmit(Person)
  }
  return (
    <>
      <h4 className="form-title">{mode + ' ' + title}</h4>
      <Form className="register-form" onSubmit={handleSubmit}>
        <div className="flex">
          <FormInput
            type="text"
            label="name"
            name="name"
            required={true}
            defaultValue={state?.name}
            onChange={handleChange}
          />

          <FormInput
            type="tel"
            label="phone"
            name="phone"
            required={true}
            defaultValue={state?.phone}
            onChange={handleChange}
            onKeyPress={handlePhoneOnkeyDown}
          />
        </div>
        <div className="flex">
          <FormInput
            type="text"
            label="city"
            name="city"
            required={true}
            defaultValue={state?.city}
            onChange={handleChange}
          />
          <FormInput
            type="text"
            label="country"
            name="country"
            required={true}
            defaultValue={state?.country}
            onChange={handleChange}
          />
        </div>
        <FormInput
          type="text"
          label="address"
          name="address"
          required={true}
          defaultValue={state?.address}
          onChange={handleChange}
        />
        <FormInput
          type="text"
          label="notes"
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

export default AddEditPersonForm
