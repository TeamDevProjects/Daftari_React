import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Navbar } from '../Layouts'
import { useContext, useEffect, useState } from 'react'
import userServices from '../Services/user'
import { useUser } from '../Context/userContext'
import authService from '../Services/authService'
import NetworkContext from '../Context/NetworkContext' // Import your NetworkContext
import { ServerError } from '../components/Common'

const HomeLayout = () => {
  const navigation = useNavigation()
  const { user, setUser } = useUser(null)
  const { setServerErrorStatus } = useContext(NetworkContext) // Access the setServerErrorStatus from context
  const navigate = useNavigate()
  const isPageLoading = navigation.state === 'loading'

  const [isServerError, setIsServerError] = useState(false) // Local state to manage server error

  const isUserLogin = () => {
    const token = authService.getAccessToken()
    const isLogin = authService.getIsLogin()
    if (!token || !isLogin) {
      return false
    }
    return true
  }

  const fetchCurrentUserInf = async () => {
    try {
      const currentUserInf = await userServices.GetUserInfo()

      if (!currentUserInf) {
        setUser(null)
        return
      }
      setUser(currentUserInf)
    } catch  {
      setUser(null)
      setIsServerError(true) // Set server error state when API fails
      setServerErrorStatus(true) // Update global error state using context
    }
  }

  useEffect(() => {
    const checkLoginAndFetchUser = async () => {
      const isLogin = isUserLogin()

      if (!isLogin) {
        if (user) {
          setUser(null)
          navigate('/', { replace: true })
        }
        return
      }

      // is isLogin try fetch user
      await fetchCurrentUserInf()
    }

    checkLoginAndFetchUser()
  }, [navigate, isServerError])

  if (isServerError) {
    return (
      <ServerError text="There was a server error. Please try again later." />
    ) // Show a message if server error occurs
  }

  return (
    <>
      <Navbar />
      <section className="page">
        {isPageLoading ? <div className="loading" /> : <Outlet context={{}} />}
      </section>
    </>
  )
}

export default HomeLayout
