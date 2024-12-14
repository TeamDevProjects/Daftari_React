import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
import { useEffect } from 'react'
import userServices from '../Services/user'
import { useUser } from '../Context/userContext'
import authService from '../Services/authService'

const HomeLayout = () => {
  const navigation = useNavigation()
  const { user, setUser } = useUser(null)

  const navigate = useNavigate()
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
        return
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
      const isLogin = isUserLogin()

      if (!isLogin) {
        if (user) {
          setUser(null) // تأكد من أن حالة المستخدم تم تحديثها
        }
        navigate('/', { replace: true }) // وجه إلى صفحة تسجيل الدخول
        return
      }

      if (!user) {
        await fetchCurrentUserInf() // جلب معلومات المستخدم
      }
    }

    checkLoginAndFetchUser()
  }, [user]) // أضف `user` إلى التبعية لمنع التكرار

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
