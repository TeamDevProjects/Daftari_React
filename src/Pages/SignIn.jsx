import { FormInput, SubmitBtn } from '../components/index'
import { Form, Link, redirect } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

// Define the API endpoint
const LoginUrl = 'https://localhost:7264/api/Users/login'

// Action function for form submission
// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  try {
    // Sending POST request to login API
    const response = await axios.post(LoginUrl, data)
    console.log(data)

    console.log('Response Data:', response.data)

    // Check if accessToken exists in response
    const accessToken = response.data?.accessToken

    if (accessToken) {
      // Store token securely (use sessionStorage if preferred)
      localStorage.setItem('accessToken', accessToken)
    } else {
      toast.error('Access token not provided by the server.')
      return null
    }

    toast.success(response.data.msg || 'Login successful!')
    return redirect('/HomeLayout')
  } catch (error) {
    // Log the error for debugging
    console.error('Error:', error)
    console.error('Error Response:', error?.response)

    // Show a user-friendly error message
    const errorMsg =
      error?.response?.data?.msg || 'An error occurred. Please try again.'
    toast.error(errorMsg)

    return error // Returning error if needed for further handling
  }
}

// SignIn Component
const SignIn = () => {


  return (
    <section className="register-container">
      <Form method="POST" className="register-form">
        <h4 className="form-title">Login</h4>
        <FormInput
          type="email"
          label="Email"
          name="identifier"
          defaultValue="AhmedEid"
          required={true}
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
