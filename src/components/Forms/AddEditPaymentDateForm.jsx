/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import SubmitBtn from '../SubmitBtn'
import FormDatePicker from '../FormDatePicker'
import FormTextarea from '../FormTextarea'
const AddEditPaymentDateForm = ({ onSubmit, title, buttonText }) => {
  return (
    <>
      <h4 className="form-title">{title}</h4>
      <Form method="POST" className="register-form" onSubmit={onSubmit}>
        <FormDatePicker />
        <FormTextarea label="Notes" name="notes" />
        <div className="submit-btn-container">
          <SubmitBtn text={buttonText} />
        </div>
      </Form>
    </>
  )
}

export default AddEditPaymentDateForm
