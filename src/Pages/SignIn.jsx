import {
  Form,
  Link,
  redirect,
} from 'react-router-dom'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { useUser } from '../Context/userContext'
import userServices from '../Services/user'
import authService from '../Services/authService'
import { FormInput, SubmitBtn } from '../components/index'

// Action function for form submission
// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)

  try {
    // Sending POST request to login API
    const response = await userServices.UserSignIN(data)

    // Check if accessToken exists in response
    const accessToken = response?.accessToken
    const refreshToken = response?.refreshToken

    if (accessToken && refreshToken) {
      // Store token securely (use sessionStorage if preferred)
      authService.saveTokens(accessToken, refreshToken, true)
    } else {
      toast.error('Access and refresh token are not provided by the server.')
      return null
    }

    toast.success(response.msg || 'Login successful!')
    return redirect('/user')
  } catch (error) {
    if (error?.response?.data) {
      toast.error(error.response.data)
    } else toast.error(error?.message)

    return error
  }
}

// SignIn Component
const SignIn = () => {

  const { setUser } = useUser(null)
  // is login before in localstorage and token is valid redirect to page

  const fetchCurrentUserInf = async () => {
    try {
      const currentUserInf = await userServices.GetUserInfo()

      if (!currentUserInf) {
        setUser(null)
      }
      setUser(currentUserInf)
      // setUser(null)
      console.log(currentUserInf)
    } catch (error) {
      setUser(null)
      console.log(error)
    }
  }
 

  useEffect(() => {
    fetchCurrentUserInf()
  }, [])

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
