import { FormInput, SubmitBtn } from '../components/index'
import { Form, Link } from 'react-router-dom'

const SignIn = () => {


  return (
    <section className="register-container">
      <Form method="POST" className="register-form">
        <h4 className="form-title">SignIn</h4>
        <FormInput
          type="text"
          label="UserName"
          name="identifier"
          defaultValue="AhmedEid"
          required={true}
        />
        <FormInput
          type="password"
          label="Password"
          name="password"
          defaultValue="AhmedEid"
          required={true}
        />
        <div className="submit-btn-container">
          <SubmitBtn text="SignIn" />
        </div>

        <p className="form-link">
          Not a member yet?
          <Link to="/SignUp" className="form-text">
            Register
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default SignIn
