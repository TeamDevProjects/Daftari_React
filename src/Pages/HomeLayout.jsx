import { Outlet, useNavigation } from 'react-router-dom'
import { Navbar } from '../components'

const HomeLayout = () => {
  const navigation = useNavigation()

  const isPageLoading = navigation.state === 'loading'
  // is login before in localstorage and tokin is valid redirect to page
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
