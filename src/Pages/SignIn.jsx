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

    // Check if accessToken exists in response
    const accessToken = response.data?.accessToken
    const refreshToken = response.data?.refreshToken

    if (accessToken && refreshToken) {
      // Store token securely (use sessionStorage if preferred)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
    } else {
      toast.error('Access and refresh token  not provided by the server.')
      return null
    }

    toast.success(response.data.msg || 'Login successful!')
    return redirect('/')
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
        <h4 className="form-title">SignIn</h4>
        <FormInput
          type="text"
          label="UserName"
          name="userName"
          defaultValue="AhmedEid"
          required={true}
        />
        <FormInput
          type="password"
          label="Password"
          name="passwordHash"
          defaultValue="AhmedEid"
          required={true}
        />
        <div className="submit-btn-container">
          <SubmitBtn text="SignIn" />
        </div>
        <p className="form-link">
          Not a member yet?
          <Link to="/SignUp" className="form-text">
            SignUp
          </Link>
        </p>
      </Form>
    </section>
  )
}

export default SignIn
