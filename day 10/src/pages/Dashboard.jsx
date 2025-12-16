import { Link } from 'react-router-dom';

function Dashboard({ user }) {
  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}!</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Balance</h3>
          <p>₹{user.balance}</p>
        </div>
        <div className="stat-card">
          <h3>Phone</h3>
          <p>{user.phone}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <Link to="/recharge" className="action-card">
          <h3>Mobile Recharge</h3>
          <p>Recharge your mobile</p>
        </Link>
        
        <Link to="/history" className="action-card">
          <h3>History</h3>
          <p>View transactions</p>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;