import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Modal, Navbar } from '../components'
import { useEffect, useState } from 'react'
import userServices from '../Services/user'
import { useUser } from '../Context/userContext'
import authService from '../Services/authService'
const HomeLayout = () => {
  const { isOpenModal } = useUser()

  const navigation = useNavigation()
  const { setUser } = useUser(null)
  const [isUser, setIsUser] = useState(false)
  const isPageLoading = navigation.state === 'loading'
  // is login before in localstorage and token is valid redirect to page
  const navigate = useNavigate()

  const fetchCurrentUserInf = async () => {
    try {
      const currentUserInf = await userServices.GetUserInfo()

      if (currentUserInf) {
        // setUser(currentUserInf)
        setUser(null)
        console.log(currentUserInf)
        setIsUser(true)
      }
    } catch (error) {
      setIsUser(false)
      setUser(null)
      console.log(error)
    }
  }
  const isTokenValid = () => {
    const token = authService.getAccessToken()
    if (!token) {
      return false
    }

    return true
  }

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/SignIn')
    }

    fetchCurrentUserInf()
  }, [navigate])

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
