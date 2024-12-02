import { FormInput, SubmitBtn } from '../components/index'
import { Form, Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <section className="register-container">
      <Form method="POST" className="register-form">
        <h4 className="form-title">Login</h4>
        <FormInput
          type="email"
          label="Email"
          name="identifier"
          defaultValue="test@test.com"
        />
        <FormInput
          type="password"
          label="Password"
          name="password"
          defaultValue="secret"
        />
        <div className="submit-btn-container">
          <SubmitBtn text="Login" />
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
