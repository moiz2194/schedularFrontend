import React from 'react'
import "./navbar.css"
const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark" style={{background:"rgb(51,135,51)"}}>
    <div className="container-fluid">
      <a className="navbar-brand" href="#">Admin Panel</a>
      <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          <a className={`nav-link ${window.location.pathname==="/"&&'active'}`} href="/">Add Notification</a>
          <a className={`nav-link ${window.location.pathname==="/history"&&'active'}` } href="/history">History</a>
          <a className={`nav-link ${window.location.pathname==="/schedule"&&'active'}`} href="/schedule">Scheduled Notification</a>
          <a className={`nav-link ${window.location.pathname==="/topic"&&'active'}`} href="/topic">Topics</a>
          <a className={`nav-link ${window.location.pathname==="/language"&&'active'}`} href="/language">Language</a>
          <a className={`nav-link ${window.location.pathname==="/key"&&'active'}`} href="/key">Key</a>
          <a className={`nav-link `} onClick={()=>{
            localStorage.clear()
            window.location.reload()
            }} href='/'>Logout</a>
        </div>
      </div>
    </div>
  </nav>
  )
}

export default Navbar