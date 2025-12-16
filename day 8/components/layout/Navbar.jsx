import { Link } from 'react-router-dom';
import { MdFlashOn } from 'react-icons/md';

function Navbar({ user, logout }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">SparkPay</Link>
        
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/recharge">Recharge</Link>
          
          {user ? (
            <>
              {user.role === 'USER' && (
                <>
                  <Link to="/user/home">Dashboard</Link>
                  <Link to="/history">History</Link>
                </>
              )}
              {user.role === 'ADMIN' && (
                <Link to="/admin/dashboard" style={{color: '#fbbf24'}}>Admin Panel</Link>
              )}
              <span className="user-greeting">
                Hi, {user.name}!
              </span>
              <button onClick={logout} className="logout-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Get Started</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;