import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminLogin({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/admin/login', formData);
      onLogin(response.data.token, response.data.user);
      navigate('/admin/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Admin Sign In</h2>

        {error && <div className="error">{error}</div>}

        <input
          type="email"
          placeholder="Admin Email Address"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />

        <button type="submit" disabled={loading} className="btn btn-primary">
          {loading ? 'Signing In...' : 'Sign In as Admin'}
        </button>

        <p style={{textAlign: 'center', marginTop: '1rem', color: '#6b7280'}}>
          Not an admin? <Link to="/login" style={{color: '#3b82f6'}}>User Login</Link>
        </p>
      </form>
    </div>
  );
}

export default AdminLogin;