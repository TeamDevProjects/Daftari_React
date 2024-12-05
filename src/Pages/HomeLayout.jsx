import { Outlet, useNavigation, useNavigate } from 'react-router-dom'
import { Navbar } from '../components'
import { useEffect } from 'react'
import userServices from '../Services/user'

import authService from '../Services/authService'
import React from 'react'
const HomeLayout = () => {
  const navigation = useNavigation()

  const isPageLoading = navigation.state === 'loading'
  // is login before in localstorage and token is valid redirect to page
  const navigate = useNavigate()

  const isTokenValid = () => {
    const token = authService.getAccessToken()
    if (!token) return false

    return true
  }

  useEffect(() => {
    if (!isTokenValid()) {
      navigate('/SignIn')
    }
    console.log(userServices.GetClients())
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
export default React.memo(HomeLayout)
