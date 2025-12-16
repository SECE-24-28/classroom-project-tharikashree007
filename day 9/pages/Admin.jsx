import { useState, useEffect } from 'react';
import {
  MdPeople,
  MdSmartphone,
  MdAttachMoney,
  MdBarChart,
  MdSettings,
  MdCreditCard,
  MdEdit,
  MdDelete,
  MdAdd,
  MdDashboard,
  MdList,
  MdLogout
} from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

function Admin() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRecharges: 0,
    totalPlans: 0,
    totalRevenue: 0,
    userGrowth: [],
    rechargesPerOperator: [],
    planUsage: [],
    recentTransactions: []
  });
  const [plans, setPlans] = useState([]);
  const [users, setUsers] = useState([]);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    operator: '',
    amount: '',
    validity: '',
    description: ''
  });

  useEffect(() => {
    fetchStats();
    fetchPlans();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();

      // Also fetch recent transactions
      const rechargesResponse = await fetch('http://localhost:5000/api/admin/recharges', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const recharges = await rechargesResponse.json();

      setStats({
        ...data,
        recentTransactions: recharges.slice(0, 5).map(r => ({
          id: r._id,
          user: r.userId?.name || 'Unknown',
          amount: r.amount,
          operator: r.operator,
          date: new Date(r.createdAt).toLocaleDateString()
        }))
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchPlans = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/plans', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setPlans(data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setUsers(data);
      setStats(prev => ({ ...prev, totalUsers: data.length }));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePlanSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPlan
        ? `http://localhost:5000/api/admin/plans/${editingPlan._id}`
        : 'http://localhost:5000/api/admin/plans';
      const method = editingPlan ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(planForm)
      });

      if (response.ok) {
        fetchPlans();
        setShowPlanModal(false);
        setEditingPlan(null);
        setPlanForm({ operator: '', amount: '', validity: '', description: '' });
      }
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      operator: plan.operator,
      amount: plan.amount,
      validity: plan.validity,
      description: plan.description
    });
    setShowPlanModal(true);
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`http://localhost:5000/api/admin/plans/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <>
            <div className="admin-header">
              <h1>Dashboard</h1>
              <p>Overview of your mobile recharge platform</p>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats">
              <div className="stat-card">
                <div className="stat-icon"><MdPeople /></div>
                <div className="stat-info">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><MdSmartphone /></div>
                <div className="stat-info">
                  <h3>Total Recharges</h3>
                  <p>{stats.totalRecharges.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><MdAttachMoney /></div>
                <div className="stat-info">
                  <h3>Total Revenue</h3>
                  <p>₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon"><MdBarChart /></div>
                <div className="stat-info">
                  <h3>Active Plans</h3>
                  <p>{stats.totalPlans.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="admin-section">
              <h2>Data Visualization</h2>
              <div className="charts-container">
                <div className="chart-item">
                  <h3>User Growth Over Time</h3>
                  <LineChart width={400} height={300} data={stats.userGrowth.map(item => ({ month: item._id, users: item.count }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="users" stroke="#8884d8" />
                  </LineChart>
                </div>
                <div className="chart-item">
                  <h3>Recharges Per Operator</h3>
                  <BarChart width={400} height={300} data={stats.rechargesPerOperator}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" />
                  </BarChart>
                </div>
                <div className="chart-item">
                  <h3>Plan Usage Distribution</h3>
                  <PieChart width={400} height={300}>
                    <Pie
                      data={stats.planUsage}
                      cx={200}
                      cy={150}
                      labelLine={false}
                      label={({ _id, count }) => `${_id}₹: ${count}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {stats.planUsage.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#0088FE', '#00C49F', '#FFBB28', '#FF8042'][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="admin-section">
              <h2>Recent Transactions</h2>
              <div className="transactions-table">
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Operator</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentTransactions.map(transaction => (
                      <tr key={transaction.id}>
                        <td>#{transaction.id}</td>
                        <td>{transaction.user}</td>
                        <td>₹{transaction.amount}</td>
                        <td>{transaction.operator}</td>
                        <td>{transaction.date}</td>
                        <td><span className="status success">Success</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        );
      case 'users':
        return (
          <div className="admin-section">
            <h2>User Management</h2>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Balance</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.phone}</td>
                      <td>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          style={{ padding: '0.25rem', borderRadius: '4px', border: '1px solid #ccc' }}
                        >
                          <option value="USER">USER</option>
                          <option value="ADMIN">ADMIN</option>
                        </select>
                      </td>
                      <td>₹{user.balance}</td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status ${user.role === 'ADMIN' ? 'success' : ''}`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'plans':
        return (
          <div className="admin-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>Plan Management</h2>
              <button
                className="btn btn-primary"
                onClick={() => setShowPlanModal(true)}
                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
              >
                <MdAdd /> Add Plan
              </button>
            </div>
            <div className="transactions-table">
              <table>
                <thead>
                  <tr>
                    <th>Operator</th>
                    <th>Amount</th>
                    <th>Validity</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map(plan => (
                    <tr key={plan._id}>
                      <td>{plan.operator}</td>
                      <td>₹{plan.amount}</td>
                      <td>{plan.validity}</td>
                      <td>{plan.description}</td>
                      <td>
                        <button
                          onClick={() => handleEditPlan(plan)}
                          style={{ marginRight: '0.5rem', padding: '0.25rem 0.5rem' }}
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePlan(plan._id)}
                          style={{ padding: '0.25rem 0.5rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px' }}
                        >
                          <MdDelete />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-sidebar">
        <div className="sidebar-header">
          <h3>Admin Panel</h3>
        </div>
        <nav className="sidebar-nav">
          <button
            className={`sidebar-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <MdDashboard /> Dashboard
          </button>
          <button
            className={`sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <MdPeople /> Users
          </button>
          <button
            className={`sidebar-link ${activeTab === 'plans' ? 'active' : ''}`}
            onClick={() => setActiveTab('plans')}
          >
            <MdList /> Plans
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout}>
            <MdLogout /> Logout
          </button>
        </div>
      </div>
      <div className="admin-content">
        <div className="container">
          {renderContent()}

          {/* Plan Modal */}
          {showPlanModal && (
            <div className="modal-overlay" onClick={() => setShowPlanModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>{editingPlan ? 'Edit Plan' : 'Add New Plan'}</h3>
                  <button className="close-btn" onClick={() => setShowPlanModal(false)}>
                    ×
                  </button>
                </div>
                <div className="modal-content">
                  <form onSubmit={handlePlanSubmit}>
                    <div className="form-group">
                      <label>Operator</label>
                      <select
                        value={planForm.operator}
                        onChange={e => setPlanForm({...planForm, operator: e.target.value})}
                        required
                      >
                        <option value="">Select Operator</option>
                        <option value="Airtel">Airtel</option>
                        <option value="Jio">Jio</option>
                        <option value="Vi">Vi</option>
                        <option value="BSNL">BSNL</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Amount (₹)</label>
                      <input
                        type="number"
                        value={planForm.amount}
                        onChange={e => setPlanForm({...planForm, amount: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Validity</label>
                      <input
                        type="text"
                        value={planForm.validity}
                        onChange={e => setPlanForm({...planForm, validity: e.target.value})}
                        placeholder="e.g., 28 days"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input
                        type="text"
                        value={planForm.description}
                        onChange={e => setPlanForm({...planForm, description: e.target.value})}
                        placeholder="e.g., Unlimited calls + 1.5GB/day"
                        required
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => setShowPlanModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        {editingPlan ? 'Update Plan' : 'Add Plan'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Admin;