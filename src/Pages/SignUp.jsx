import { FormInput, SubmitBtn } from '../components/index'
import { Form, Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <section className="register-container">
      <Form method="POST" className="register-form">
        <h4 className="form-title">Register</h4>
        <FormInput type="text" label="username" name="username" />
        <FormInput type="email" label="email" name="email" />
        <FormInput type="password" label="password" name="password" />
        <div className="submit-btn-container">
          <SubmitBtn text="Register" />
        </div>

        <p className="login-link">
          Already a member?
          <Link to="/SignIn" className="login-text">
            Login
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default SignUp
