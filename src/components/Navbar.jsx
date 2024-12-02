import { NavLink } from 'react-router-dom'
import Wrapper from '../assets/wrappers/Navbar'
const Navbar = () => {
  return (
    <Wrapper>
      <div className="nav-center">
        <span className="logo">Daftari</span>
        <div className="nav-links">
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <NavLink to="/Clients" className="nav-link">
            Clients
          </NavLink>
          <NavLink to="/Suppliers" className="nav-link">
            Suppliers
          </NavLink>
        </div>
      </div>
    </Wrapper>
  )
}

export default Navbar
