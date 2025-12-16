import { Link } from 'react-router-dom';
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>SparkPay</h3>
          <p>Fast, secure, and hassle-free mobile recharge for all operators.</p>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <Link to="/">Home</Link>
          <Link to="/plans">Plans</Link>
          <Link to="/recharge">Recharge</Link>
          <Link to="/login">Login</Link>
        </div>
        
        <div className="footer-section">
          <h4>Contact</h4>
          <div className="footer-contact">
            <MdEmail /> support@sparkpay.com
          </div>
          <div className="footer-contact">
            <MdPhone /> +91 1800-123-4567
          </div>
          <div className="footer-contact">
            <MdLocationOn /> India
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2024 SparkPay. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
