import { useState, useEffect } from 'react';
import axios from 'axios';

function PlansList({ operator, onPlanSelect }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    if (operator) {
      fetchPlans();
    }
  }, [operator]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/recharge/plans/${operator}`);
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  return (
    <div className="plans">
      <h3>Available Plans</h3>
      {plans.length > 0 ? (
        plans.map((plan, index) => (
          <div key={index} className="plan-card" onClick={() => onPlanSelect(plan.amount)}>
            <h4>₹{plan.amount}</h4>
            <p>{plan.validity}</p>
            <p>{plan.description}</p>
          </div>
        ))
      ) : (
        <p>Select operator to view plans</p>
      )}
    </div>
  );
}

export default PlansList;