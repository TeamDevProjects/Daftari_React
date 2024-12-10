/* eslint-disable react/prop-types */
import { Form } from 'react-router-dom'
import FormInput from '../FormInput'
import SubmitBtn from '../SubmitBtn'
import FormTextarea from '../FormTextarea'

const AddEditTransactionForm = ({ onSubmit, title, buttonText }) => {
  return (
    <>
      <h4 className="form-title">{title}</h4>
      <Form method="POST" className="register-form" onSubmit={onSubmit}>
        <FormInput type="number" label="Amount" name="Amount" />

        <FormTextarea label="Notes" name="Notes" />

        <FormInput type="number" label="Image" name="FormImage" />

        <div className="submit-btn-container">
          <SubmitBtn text={buttonText} />
        </div>
      </Form>
    </>
  )
}

export default AddEditTransactionForm
