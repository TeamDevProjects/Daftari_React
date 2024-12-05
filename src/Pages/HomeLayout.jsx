import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
import { useEffect, useState } from 'react'
import userServices from '../Services/user'

import authService from '../Services/authService'
import React from 'react'
const HomeLayout = () => {
  const navigation = useNavigation()
  const [isUser, setIsUser] = useState(false)
  const isPageLoading = navigation.state === 'loading'
  // is login before in localstorage and token is valid redirect to page
  const navigate = useNavigate()

  const isTokenValid = () => {
    const token = authService.getAccessToken()
    if (!token) {
      setIsUser(false)
      return false
    }

    setIsUser(true)

    return true
  }

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/SignIn')
    }
    console.log(userServices.GetClients())
  }, [navigate])

  if (!isUser) {
    return <div className="loading" />
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
export default React.memo(HomeLayout)
