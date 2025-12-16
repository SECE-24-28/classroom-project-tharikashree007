import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      console.log('JWT Token:', response.data.token);
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token, response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        
        {error && <div className="error">{error}</div>}
        
        <input
          type="email"
          placeholder="Email Address"
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
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <p style={{textAlign: 'center', marginTop: '1rem', color: '#6b7280'}}>
          Don't have an account? <Link to="/register" style={{color: '#3b82f6'}}>Create Account</Link>
        </p>
        <p style={{textAlign: 'center', marginTop: '0.5rem', fontSize: '0.85rem', color: '#9ca3af'}}>
          Admin users can login with their admin credentials
        </p>
      </form>
    </div>
  );
}

export default Login;