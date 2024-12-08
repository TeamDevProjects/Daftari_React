import {
  Outlet,
  useNavigation,
  useNavigate,
  useLocation,
} from 'react-router-dom'
import { Navbar, Modal } from '../components'
import { useEffect, useState } from 'react'
import userServices from '../Services/user'
import { useUser } from '../Context/userContext'
import authService from '../Services/authService'
const HomeLayout = () => {
  const { isOpenModal } = useUser()

  const navigation = useNavigation()
  const [isUser, setIsUser] = useState(false)
  const { user, setUser } = useUser(null)

  const navigate = useNavigate()
  const location = useLocation()
  const isPageLoading = navigation.state === 'loading'

  const isTokenValid = () => {
    const token = authService.getAccessToken()
    if (!token) {
      setIsUser(false)
      return false
    }

    setIsUser(true)
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

  useEffect(() => {}, [])

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/')
    }
    if (!user) fetchCurrentUserInf()
    //location.pathname
  }, [location.pathname])

  if (!isUser) {
    return <div className="" />
  }

  return (
    <>
      <Navbar />
      {isOpenModal && <Modal />}
      <section className="page">
        {isPageLoading ? <div className="loading" /> : <Outlet context={{}} />}
      </section>
    </>
  )
}
export default HomeLayout
