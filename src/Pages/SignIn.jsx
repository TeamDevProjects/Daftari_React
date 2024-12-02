import { FormInput, SubmitBtn } from '../components/index'
import { Form, Link } from 'react-router-dom'

const SignIn = () => {
  return (
    <section className="section-container">
      <Form method="POST" className="form-container">
        <h4 className='form-title'>Login</h4>
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
        <div className="form-input">
          <SubmitBtn text="Login" className="submit-btn" />
        </div>
        <button type="button" className="guest-btn">
          Guest User
        </button>
        <p className="text-center">
          Not a member yet?
          <Link to="/SignUp" className="link">
            Register
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default SignIn
