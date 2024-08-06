import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
  <div className="container-fluid">
    <div className="navbar-brand"><Link to="/">Cool Media</Link></div>
    
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <form className="d-flex">
        <button className="btn btn-outline-success" type="submit"><Link to="/">Sign In</Link></button>
        <button className="btn btn-outline-success" type="submit"><Link to="/LogIn">Log in</Link></button>
        <button>another button</button>
      </form>
    </div>
  </div>
</nav>
  )
}

export default Navbar