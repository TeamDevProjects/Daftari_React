import { NavLink, useNavigate } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Navbar'
import authService from '../Services/authService'
const Navbar = () => {
  const navigate = useNavigate()

  const handelLogout = () => {
    authService.clearTokens()
    navigate('/')
  }
  return (
    <Wrapper>
      <div className="nav-center">
        <span className="logo">Daftari</span>
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
          </button>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar
