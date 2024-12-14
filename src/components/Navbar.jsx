import { NavLink, useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Navbar'
import authService from '../Services/authService'
import { useUser } from '../Context/userContext'
import { FiLogOut } from 'react-icons/fi'
import { FaBookOpen } from 'react-icons/fa'

const Navbar = () => {
  const { setUser } = useUser(null)
  const navigate = useNavigate()

  const handelLogout = () => {
    authService.clearTokens()
    setUser(null)
    navigate('/', { replace: true }) // توجه إلى صفحة تسجيل الدخول (تجنب التكرار)
  }
  return (
    <Wrapper>
      <div className="nav-center">
        <span className="logo">
          <FaBookOpen style={{ transform: 'translateY(.2rem)' }} />
          <span>Daftari</span>
        </span>
        <div className="nav-links">
          <NavLink to="/User" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/Clients" className="nav-link">
            Clients
          </NavLink>
          <NavLink to="/Suppliers" className="nav-link">
            Suppliers
          </NavLink>
          <button className="nav-link logout-btn" onClick={handelLogout}>
            Logout
            <FiLogOut className="fs-1" />
          </button>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar
