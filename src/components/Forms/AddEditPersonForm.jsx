/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import FormInput from '../FormInput'
import SubmitBtn from '../SubmitBtn'
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
  method,
  actionPath,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  const handleChange = (e) => {
    const { name, value } = e.target
    dispatch({ type: 'SET_FIELD_VALUE', field: name, value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const Person = {
      name: state?.name.trim(),
      phone: state?.phone.trim(),
      city: state?.city.trim(),
      country: state?.country.trim(),
      address: state?.address.trim(),
      notes: state?.notes.trim(),
    }

    onSubmit(Person)
  }
  return (
    <>
      <h4 className="form-title">{mode + ' ' + title}</h4>
      <Form
        method={method}
        action={actionPath}
        className="register-form"
        onSubmit={handleSubmit}
      >
        <div className="flex">
          <FormInput
            type="text"
            label="name"
            name="name"
            onChange={handleChange}
          />

          <FormInput
            type="text"
            label="phone"
            name="phone"
            onChange={handleChange}
          />
        </div>
        <div className="flex">
          <FormInput
            type="text"
            label="city"
            name="city"
            onChange={handleChange}
          />
          <FormInput
            type="text"
            label="country"
            name="country"
            onChange={handleChange}
          />
        </div>
        <FormInput
          type="text"
          label="address"
          name="address"
          onChange={handleChange}
        />
        <FormInput
          type="text"
          label="notes"
          name="notes"
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
