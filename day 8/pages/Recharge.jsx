import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import RechargeForm from '../components/recharge/RechargeForm';
import PlansList from '../components/recharge/PlansList';

function Recharge({ user }) {
  const [message, setMessage] = useState('');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const operator = searchParams.get('operator');
    const amount = searchParams.get('amount');
    if (operator) setSelectedOperator(operator);
  }, [searchParams]);

  const handleRechargeSuccess = (msg, isError = false) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePlanSelect = (amount) => {
    console.log('Selected plan amount:', amount);
  };

  return (
    <div className="recharge-page">
      <div className="container">
        <div className="recharge-header">
          <h1>Mobile Recharge</h1>
          {!user && (
            <div className="guest-notice">
              <p>Recharging as guest. <Link to="/login">Login</Link> to view history and save details.</p>
            </div>
          )}
        </div>
        
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
        
        <div className="recharge-container">
          <RechargeForm 
            user={user} 
            onRechargeSuccess={handleRechargeSuccess} 
            preSelectedOperator={selectedOperator}
            preSelectedAmount={searchParams.get('amount')}
          />
          <PlansList operator={selectedOperator} onPlanSelect={handlePlanSelect} />
        </div>
      </div>
    </div>
  );
}

export default Recharge;