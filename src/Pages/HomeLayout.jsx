import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
import { useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'

const HomeLayout = () => {
  const navigation = useNavigation()

  const isPageLoading = navigation.state === 'loading'
  // is login before in localstorage and token is valid redirect to page
  const navigate = useNavigate()

  const isTokenValid = () => {
    const token = localStorage.getItem('accessToken')
    if (!token) return false
    const decoded = jwtDecode(token)

    // check token expire date
    return decoded.exp * 1000 > Date.now() // true or false
  }

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/SignIn')
    }
  }, [navigate])
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
