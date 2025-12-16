import { useState, useEffect } from 'react';
import axios from 'axios';

function RechargeForm({ user, onRechargeSuccess, preSelectedOperator, preSelectedAmount }) {
  const [formData, setFormData] = useState({ 
    mobile: '', 
    operator: preSelectedOperator || '', 
    amount: preSelectedAmount || '' 
  });
  const [loading, setLoading] = useState(false);

  const operators = ['Airtel', 'Jio', 'Vi', 'BSNL'];

  useEffect(() => {
    if (preSelectedOperator) {
      setFormData(prev => ({ ...prev, operator: preSelectedOperator }));
    }
    if (preSelectedAmount) {
      setFormData(prev => ({ ...prev, amount: preSelectedAmount }));
    }
  }, [preSelectedOperator, preSelectedAmount]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Logged in user - save to database
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/recharge/recharge', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onRechargeSuccess('Recharge successful! Check your history for details.');
      } else {
        // Guest user - simulate recharge
        await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
        onRechargeSuccess('Recharge successful! Login to save transaction history.');
      }
      setFormData({ mobile: '', operator: preSelectedOperator || '', amount: preSelectedAmount || '' });
    } catch (error) {
      onRechargeSuccess('Recharge failed. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recharge-form">
      <h2>Recharge Details</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            placeholder="Enter 10-digit mobile number"
            value={formData.mobile}
            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
            pattern="[0-9]{10}"
            maxLength="10"
            required
          />
        </div>
        
        <div className="form-group">
          <label>Operator</label>
          <select
            value={formData.operator}
            onChange={(e) => setFormData({...formData, operator: e.target.value})}
            required
          >
            <option value="">Select Operator</option>
            {operators.map(op => <option key={op} value={op}>{op}</option>)}
          </select>
        </div>
        
        <div className="form-group">
          <label>Amount (₹)</label>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.amount}
            onChange={(e) => setFormData({...formData, amount: e.target.value})}
            min="10"
            max="10000"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} className="recharge-btn">
          {loading ? 'Processing...' : `Recharge ₹${formData.amount || '0'}`}
        </button>
      </form>
    </div>
  );
}

export default RechargeForm;