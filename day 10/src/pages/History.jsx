import { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [recharges, setRecharges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/recharge/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecharges(response.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="history">
      <h1>Recharge History</h1>
      
      {recharges.length === 0 ? (
        <p>No recharge history found</p>
      ) : (
        <div className="history-list">
          {recharges.map(recharge => (
            <div key={recharge._id} className="history-item">
              <div className="history-info">
                <h3>{recharge.mobile}</h3>
                <p>{recharge.operator} - ₹{recharge.amount}</p>
                <p>{new Date(recharge.createdAt).toLocaleDateString()}</p>
              </div>
              <div className={`status ${recharge.status}`}>
                {recharge.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default History;