import {
  Outlet,
  useNavigation,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { Navbar } from '../components'
import { useEffect } from 'react'
import userServices from '../Services/user'
import { useUser } from '../Context/userContext'
import authService from '../Services/authService'

const HomeLayout = () => {
  const navigation = useNavigation()
  const { user, setUser } = useUser(null)

  const navigate = useNavigate()
  const location = useLocation()
  const isPageLoading = navigation.state === 'loading'

  const isUserLogin = () => {
    const token = authService.getAccessToken()
    const isLogin = authService.getIsLogin()
    if (!token || !isLogin) {
      return false
    }

    return true
  }
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
    const checkLoginAndFetchUser = async () => {
      if (!isUserLogin()) {
        navigate('/')
        return
      }

      if (!user) {
        await fetchCurrentUserInf()
      }
    }

    checkLoginAndFetchUser()
  }, [location.pathname, navigate])

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
