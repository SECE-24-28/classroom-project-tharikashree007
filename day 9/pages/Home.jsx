import { Link } from 'react-router-dom';
import { useState } from 'react';
import { 
  MdSmartphone, 
  MdFlashOn, 
  MdSecurity, 
  MdSignalCellularAlt, 
  MdAttachMoney,
  MdSchedule,
  MdCall,
  MdRadio,
  MdLanguage,
  MdBusiness
} from 'react-icons/md';

function Home() {
  const [selectedOperator, setSelectedOperator] = useState('Airtel');
  
  const popularPlans = {
    Airtel: [
      { id: 1, amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited' },
      { id: 2, amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited' },
      { id: 3, amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited' }
    ],
    Jio: [
      { id: 4, amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited' },
      { id: 5, amount: 239, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited' },
      { id: 6, amount: 349, validity: '56 days', data: '2GB/day', calls: 'Unlimited' }
    ],
    Vi: [
      { id: 7, amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited' },
      { id: 8, amount: 319, validity: '28 days', data: '2GB/day', calls: 'Unlimited' },
      { id: 9, amount: 449, validity: '56 days', data: '4GB/day', calls: 'Unlimited' }
    ]
  };

  return (
    <div className="home-page">
      {/* Hero Banner Section */}
      <section className="hero-banner">
        <div className="hero-banner-overlay"></div>
        <div className="hero-banner-content">
          <h1 className="hero-banner-title">
            Instant Mobile <span className="highlight">Recharge</span>
          </h1>
          <p className="hero-banner-subtitle">
            Fast, secure, and hassle-free mobile recharge for all operators. Recharge anytime, anywhere.
          </p>
          <Link to="/recharge" className="btn btn-primary btn-large">Start Recharging Now</Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose Us?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon"><MdFlashOn /></div>
              <h3>Instant Recharge</h3>
              <p>Lightning-fast recharge processing in seconds</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdSecurity /></div>
              <h3>100% Secure</h3>
              <p>Bank-level security for all your transactions</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdSignalCellularAlt /></div>
              <h3>All Operators</h3>
              <p>Support for Airtel, Jio, Vi, BSNL and more</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon"><MdAttachMoney /></div>
              <h3>Best Plans</h3>
              <p>Compare and choose the best recharge plans</p>
            </div>
          </div>
        </div>
      </section>

      {/* Recharge Plans Section */}
      <section className="recharge-plans-section">
        <div className="container">
          <h2 className="section-title">Choose Your Recharge Plan</h2>
          
          {/* Operator Tabs */}
          <div className="operator-tabs">
            {Object.keys(popularPlans).map(operator => (
              <button
                key={operator}
                className={`operator-tab ${selectedOperator === operator ? 'active' : ''}`}
                onClick={() => setSelectedOperator(operator)}
              >
                {operator}
              </button>
            ))}
          </div>

          {/* Plans Grid */}
          <div className="plans-grid">
            {popularPlans[selectedOperator].map(plan => (
              <div key={plan.id} className="plan-card">
                <div className="plan-header">
                  <div className="plan-operator">{selectedOperator}</div>
                  <div className="plan-amount">₹{plan.amount}</div>
                </div>
                <div className="plan-details">
                  <div className="detail-row">
                    <span className="icon"><MdSchedule /></span>
                    <span>{plan.validity}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon"><MdSignalCellularAlt /></span>
                    <span>{plan.data}</span>
                  </div>
                  <div className="detail-row">
                    <span className="icon"><MdCall /></span>
                    <span>{plan.calls}</span>
                  </div>
                </div>
                <Link to={`/recharge?operator=${selectedOperator}&amount=${plan.amount}`} className="btn btn-primary btn-small">
                  Recharge Now
                </Link>
              </div>
            ))}
          </div>
          
          <div className="view-all-plans">
            <Link to="/plans" className="btn btn-outline">View All Plans</Link>
          </div>
        </div>
      </section>

      {/* Operators Section */}
      <section className="operators-section">
        <div className="container">
          <h2 className="section-title">Supported Operators</h2>
          <div className="operators-grid">
            <div className="operator-card">
              <div className="operator-logo"><MdRadio /></div>
              <h4>Airtel</h4>
            </div>
            <div className="operator-card">
              <div className="operator-logo"><MdLanguage /></div>
              <h4>Jio</h4>
            </div>
            <div className="operator-card">
              <div className="operator-logo"><MdCall /></div>
              <h4>Vi</h4>
            </div>
            <div className="operator-card">
              <div className="operator-logo"><MdBusiness /></div>
              <h4>BSNL</h4>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of users who trust us for their mobile recharge needs</p>
            <Link to="/register" className="btn btn-primary btn-large">
              Start Recharging Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;