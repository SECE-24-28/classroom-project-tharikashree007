// Global variables
let currentUser = null;
let selectedPlan = null;
let rechargeHistory = [];

// Plans data
const plansData = {
    Airtel: [
        { id: 1, amount: 149, validity: '24 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 2, amount: 199, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 3, amount: 299, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 4, amount: 399, validity: '56 days', data: '2.5GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 5, amount: 599, validity: '84 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
    ],
    Jio: [
        { id: 6, amount: 129, validity: '24 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 7, amount: 179, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 8, amount: 239, validity: '28 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 9, amount: 349, validity: '56 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 10, amount: 719, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
    ],
    Vi: [
        { id: 11, amount: 155, validity: '24 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 12, amount: 209, validity: '28 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 13, amount: 319, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 14, amount: 449, validity: '56 days', data: '4GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 15, amount: 699, validity: '84 days', data: '1.5GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
    ],
    BSNL: [
        { id: 16, amount: 99, validity: '18 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: false },
        { id: 17, amount: 187, validity: '28 days', data: '2GB/day', calls: 'Unlimited', sms: '100/day', popular: true },
        { id: 18, amount: 297, validity: '54 days', data: '1GB/day', calls: 'Unlimited', sms: '100/day', popular: false }
    ]
};

// All plans combined for filtering
const allPlans = [];
Object.keys(plansData).forEach(operator => {
    plansData[operator].forEach(plan => {
        allPlans.push({
            ...plan,
            operator: operator,
            type: 'Prepaid'
        });
    });
});

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserData();
    showOperatorPlans('Airtel');
    loadQuickPlans();
    filterPlans();
});

function initializeApp() {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
        currentUser = JSON.parse(userData);
        updateUIForLoggedInUser();
    } else {
        updateUIForGuest();
    }
    
    // Load recharge history
    const history = localStorage.getItem('rechargeHistory');
    if (history) {
        rechargeHistory = JSON.parse(history);
        updateHistoryStats();
    }
}

function setupEventListeners() {
    // Recharge form
    const rechargeForm = document.getElementById('rechargeForm');
    if (rechargeForm) {
        rechargeForm.addEventListener('submit', handleRecharge);
    }
    
    // Amount input update
    const amountInput = document.getElementById('amount');
    if (amountInput) {
        amountInput.addEventListener('input', updateRechargeButton);
    }
    
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
}

function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Show selected section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Update guest notice visibility
    if (sectionId === 'recharge' && !currentUser) {
        document.getElementById('guestNotice').style.display = 'block';
    }
}

function showOperatorPlans(operator) {
    // Update active tab
    const tabs = document.querySelectorAll('.operator-tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');
    
    // Get plans for operator
    const plans = plansData[operator] || [];
    const grid = document.getElementById('popularPlansGrid');
    
    grid.innerHTML = plans.slice(0, 3).map(plan => `
        <div class="plan-card ${plan.popular ? 'popular' : ''}">
            <div class="plan-header">
                <div class="plan-operator">${operator}</div>
                <div class="plan-amount">₹${plan.amount}</div>
            </div>
            <div class="plan-details">
                <div class="detail-row">
                    <span class="icon">⏰</span>
                    <span>${plan.validity}</span>
                </div>
                <div class="detail-row">
                    <span class="icon">📶</span>
                    <span>${plan.data}</span>
                </div>
                <div class="detail-row">
                    <span class="icon">📞</span>
                    <span>${plan.calls}</span>
                </div>
            </div>
            <button class="btn btn-primary btn-small" onclick="selectPlanForRecharge('${operator}', ${plan.amount})">
                Recharge Now
            </button>
        </div>
    `).join('');
}

function selectPlanForRecharge(operator, amount) {
    // Pre-fill recharge form
    document.getElementById('operator').value = operator;
    document.getElementById('amount').value = amount;
    updateRechargeButton();
    
    // Switch to recharge section
    showSection('recharge');
}

function loadQuickPlans() {
    const quickPlansContainer = document.getElementById('quickPlans');
    const quickPlans = [
        { operator: 'Airtel', amount: 199, desc: '1.5GB/day, 28 days' },
        { operator: 'Jio', amount: 179, desc: '2GB/day, 28 days' },
        { operator: 'Vi', amount: 209, desc: '1GB/day, 28 days' },
        { operator: 'BSNL', amount: 187, desc: '2GB/day, 28 days' }
    ];
    
    quickPlansContainer.innerHTML = quickPlans.map(plan => `
        <div class="plan-item" onclick="selectQuickPlan('${plan.operator}', ${plan.amount})">
            <div class="plan-info">
                <div>
                    <div class="plan-price">₹${plan.amount}</div>
                    <div class="plan-desc">${plan.desc}</div>
                </div>
                <div style="font-weight: 600; color: #3b82f6;">${plan.operator}</div>
            </div>
        </div>
    `).join('');
}

function selectQuickPlan(operator, amount) {
    document.getElementById('operator').value = operator;
    document.getElementById('amount').value = amount;
    updateRechargeButton();
    
    // Highlight selected plan
    const planItems = document.querySelectorAll('.plan-item');
    planItems.forEach(item => item.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function updateRechargeButton() {
    const amount = document.getElementById('amount').value;
    const btn = document.getElementById('rechargeBtn');
    btn.textContent = `Recharge ₹${amount || '0'}`;
}

function handleRecharge(e) {
    e.preventDefault();
    
    const mobile = document.getElementById('mobileNumber').value;
    const operator = document.getElementById('operator').value;
    const amount = document.getElementById('amount').value;
    
    if (!mobile || !operator || !amount) {
        alert('Please fill all fields');
        return;
    }
    
    if (mobile.length !== 10) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    // Simulate recharge processing
    const btn = document.getElementById('rechargeBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(() => {
        processRecharge(mobile, operator, amount);
        btn.disabled = false;
        updateRechargeButton();
    }, 2000);
}

function processRecharge(mobile, operator, amount) {
    const transaction = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        mobile: mobile,
        operator: operator,
        amount: parseInt(amount),
        status: 'Success',
        timestamp: new Date().toISOString()
    };
    
    // Add to history if user is logged in
    if (currentUser) {
        rechargeHistory.unshift(transaction);
        localStorage.setItem('rechargeHistory', JSON.stringify(rechargeHistory));
        updateHistoryStats();
    }
    
    // Show success message
    alert(`Recharge successful! ₹${amount} recharged to ${mobile} (${operator})`);
    
    // Reset form
    document.getElementById('rechargeForm').reset();
    updateRechargeButton();
    
    // Remove selected plan highlight
    const planItems = document.querySelectorAll('.plan-item');
    planItems.forEach(item => item.classList.remove('selected'));
}

function filterPlans() {
    const operatorFilter = document.getElementById('operatorFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    let filteredPlans = allPlans;
    
    if (operatorFilter !== 'All') {
        filteredPlans = filteredPlans.filter(plan => plan.operator === operatorFilter);
    }
    
    if (typeFilter !== 'All') {
        filteredPlans = filteredPlans.filter(plan => plan.type === typeFilter);
    }
    
    displayAllPlans(filteredPlans);
}

function displayAllPlans(plans) {
    const grid = document.getElementById('allPlansGrid');
    
    grid.innerHTML = plans.map(plan => `
        <div class="plan-card ${plan.popular ? 'popular' : ''}" style="position: relative;">
            ${plan.popular ? '<div class="popular-badge">Most Popular</div>' : ''}
            
            <div class="plan-header">
                <div class="operator-info">
                    <span class="operator-badge ${plan.operator.toLowerCase()}">${plan.operator}</span>
                    <span class="plan-type">${plan.type}</span>
                </div>
                <div class="plan-price">
                    <span class="currency">₹</span>
                    <span class="amount">${plan.amount}</span>
                </div>
            </div>

            <div class="plan-details">
                <div class="detail-item">
                    <span class="icon">⏰</span>
                    <span class="label">Validity:</span>
                    <span class="value">${plan.validity}</span>
                </div>
                <div class="detail-item">
                    <span class="icon">📶</span>
                    <span class="label">Data:</span>
                    <span class="value">${plan.data}</span>
                </div>
                <div class="detail-item">
                    <span class="icon">📞</span>
                    <span class="label">Calls:</span>
                    <span class="value">${plan.calls}</span>
                </div>
                <div class="detail-item">
                    <span class="icon">💬</span>
                    <span class="label">SMS:</span>
                    <span class="value">${plan.sms}</span>
                </div>
            </div>

            <button class="select-plan-btn" onclick="openRechargeModal(${JSON.stringify(plan).replace(/"/g, '&quot;')})">
                Recharge Now
            </button>
        </div>
    `).join('');
}

function openRechargeModal(plan) {
    selectedPlan = plan;
    const modal = document.getElementById('rechargeModal');
    const planInfo = document.getElementById('selectedPlanInfo');
    const rechargeBtn = document.getElementById('modalRechargeBtn');
    
    planInfo.innerHTML = `
        <h4>${plan.operator} - ₹${plan.amount}</h4>
        <p>${plan.data} | ${plan.calls} | ${plan.validity}</p>
        ${!currentUser ? '<div class="guest-notice-modal"><small>⚠️ Recharging as guest - transaction won\'t be saved to history</small></div>' : ''}
    `;
    
    rechargeBtn.textContent = `Pay ₹${plan.amount}`;
    document.getElementById('modalMobileNumber').value = '';
    document.getElementById('modalMessage').style.display = 'none';
    
    modal.style.display = 'flex';
}

function closeRechargeModal() {
    document.getElementById('rechargeModal').style.display = 'none';
    selectedPlan = null;
}

function processModalRecharge() {
    const mobile = document.getElementById('modalMobileNumber').value;
    const messageDiv = document.getElementById('modalMessage');
    
    if (!mobile || mobile.length !== 10) {
        messageDiv.textContent = 'Please enter a valid 10-digit mobile number';
        messageDiv.className = 'message error';
        messageDiv.style.display = 'block';
        return;
    }
    
    const btn = document.getElementById('modalRechargeBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(() => {
        const transaction = {
            id: Date.now(),
            date: new Date().toLocaleDateString(),
            mobile: mobile,
            operator: selectedPlan.operator,
            amount: selectedPlan.amount,
            status: 'Success',
            timestamp: new Date().toISOString()
        };
        
        if (currentUser) {
            rechargeHistory.unshift(transaction);
            localStorage.setItem('rechargeHistory', JSON.stringify(rechargeHistory));
            updateHistoryStats();
            messageDiv.textContent = 'Recharge successful!';
        } else {
            messageDiv.textContent = 'Recharge successful! (Guest mode - not saved to history)';
        }
        
        messageDiv.className = 'message success';
        messageDiv.style.display = 'block';
        
        setTimeout(() => {
            closeRechargeModal();
        }, 2000);
        
        btn.disabled = false;
        btn.textContent = `Pay ₹${selectedPlan.amount}`;
    }, 2000);
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    const btn = document.getElementById('loginBtn');
    
    btn.disabled = true;
    btn.textContent = 'Signing In...';
    
    // Simulate login
    setTimeout(() => {
        // Simple validation (in real app, this would be server-side)
        if (email && password) {
            const userData = {
                name: email.split('@')[0],
                email: email,
                loginTime: new Date().toISOString()
            };
            
            currentUser = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
            updateUIForLoggedInUser();
            showSection('home');
            
            // Reset form
            document.getElementById('loginForm').reset();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Please enter valid credentials';
            errorDiv.style.display = 'block';
        }
        
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }, 1500);
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const errorDiv = document.getElementById('registerError');
    const btn = document.getElementById('registerBtn');
    
    btn.disabled = true;
    btn.textContent = 'Creating Account...';
    
    // Simulate registration
    setTimeout(() => {
        if (name && email && password) {
            const userData = {
                name: name,
                email: email,
                registrationTime: new Date().toISOString()
            };
            
            currentUser = userData;
            localStorage.setItem('userData', JSON.stringify(userData));
            updateUIForLoggedInUser();
            showSection('home');
            
            // Reset form
            document.getElementById('registerForm').reset();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.textContent = 'Please fill all fields';
            errorDiv.style.display = 'block';
        }
        
        btn.disabled = false;
        btn.textContent = 'Create Account';
    }, 1500);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('userData');
    localStorage.removeItem('rechargeHistory');
    rechargeHistory = [];
    updateUIForGuest();
    showSection('home');
}

function updateUIForLoggedInUser() {
    document.getElementById('userInfo').style.display = 'flex';
    document.getElementById('authLinks').style.display = 'none';
    document.getElementById('userGreeting').textContent = `Welcome, ${currentUser.name}!`;
    document.getElementById('guestNotice').style.display = 'none';
}

function updateUIForGuest() {
    document.getElementById('userInfo').style.display = 'none';
    document.getElementById('authLinks').style.display = 'flex';
    updateHistoryForGuest();
}

function loadUserData() {
    if (currentUser) {
        updateHistoryStats();
        loadRechargeHistory();
    }
}

function updateHistoryStats() {
    const totalRecharges = rechargeHistory.length;
    const totalAmount = rechargeHistory.reduce((sum, transaction) => sum + transaction.amount, 0);
    
    // Calculate this month's amount
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthAmount = rechargeHistory
        .filter(transaction => {
            const transactionDate = new Date(transaction.timestamp);
            return transactionDate.getMonth() === currentMonth && 
                   transactionDate.getFullYear() === currentYear;
        })
        .reduce((sum, transaction) => sum + transaction.amount, 0);
    
    document.getElementById('totalRecharges').textContent = totalRecharges;
    document.getElementById('totalAmount').textContent = `₹${totalAmount}`;
    document.getElementById('thisMonth').textContent = `₹${thisMonthAmount}`;
    
    loadRechargeHistory();
}

function loadRechargeHistory() {
    const tbody = document.getElementById('historyTableBody');
    
    if (rechargeHistory.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
                    ${currentUser ? 'No transactions found.' : 'No transactions found. <a href="#login" onclick="showSection(\'login\')" style="color: #3b82f6;">Login</a> to view your history.'}
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = rechargeHistory.slice(0, 10).map(transaction => `
        <tr>
            <td>${transaction.date}</td>
            <td>${transaction.mobile}</td>
            <td>${transaction.operator}</td>
            <td>₹${transaction.amount}</td>
            <td><span class="status success">${transaction.status}</span></td>
        </tr>
    `).join('');
}

function updateHistoryForGuest() {
    document.getElementById('totalRecharges').textContent = '0';
    document.getElementById('totalAmount').textContent = '₹0';
    document.getElementById('thisMonth').textContent = '₹0';
    
    const tbody = document.getElementById('historyTableBody');
    tbody.innerHTML = `
        <tr>
            <td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">
                No transactions found. <a href="#login" onclick="showSection('login')" style="color: #3b82f6;">Login</a> to view your history.
            </td>
        </tr>
    `;
}

// Close modal when clicking outside
document.addEventListener('click', function(e) {
    const modal = document.getElementById('rechargeModal');
    if (e.target === modal) {
        closeRechargeModal();
    }
});

// Handle escape key for modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeRechargeModal();
    }
});