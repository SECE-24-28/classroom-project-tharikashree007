// JavaScript code can be added here

// Sample plans data
const plans = {
    topup: [
        { amount: 10, validity: '7 Days', benefits: ['Talktime: ₹10', 'No Data'] },
        { amount: 20, validity: '14 Days', benefits: ['Talktime: ₹20', 'No Data'] },
        { amount: 50, validity: '28 Days', benefits: ['Talktime: ₹50', 'No Data'] },
        { amount: 100, validity: '28 Days', benefits: ['Talktime: ₹100', 'No Data'] },
        { amount: 150, validity: '28 Days', benefits: ['Talktime: ₹150', 'No Data'] },
        { amount: 200, validity: '28 Days', benefits: ['Talktime: ₹200', 'No Data'] },
        { amount: 300, validity: '28 Days', benefits: ['Talktime: ₹300', 'No Data'] },
        { amount: 500, validity: '28 Days', benefits: ['Talktime: ₹500', 'No Data'] },
        { amount: 1000, validity: '90 Days', benefits: ['Talktime: ₹1000', 'No Data'] },
        { amount: 2000, validity: '180 Days', benefits: ['Talktime: ₹2000', 'No Data'] }
    ],
    data: [
        { amount: 49, validity: '7 Days', benefits: ['500MB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 79, validity: '14 Days', benefits: ['1GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 99, validity: '14 Days', benefits: ['1.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 149, validity: '21 Days', benefits: ['2GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 199, validity: '28 Days', benefits: ['2.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 249, validity: '35 Days', benefits: ['3GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 299, validity: '56 Days', benefits: ['3.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 399, validity: '70 Days', benefits: ['4.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 499, validity: '84 Days', benefits: ['5.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] },
        { amount: 699, validity: '120 Days', benefits: ['8GB Daily Data', 'Unlimited Calls', '100 SMS/Day'] }
    ],
    combo: [
        { amount: 149, validity: '14 Days', benefits: ['1GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Entertainment Apps'] },
        { amount: 199, validity: '21 Days', benefits: ['1.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Prime Subscription'] },
        { amount: 249, validity: '28 Days', benefits: ['2GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Netflix Subscription'] },
        { amount: 299, validity: '28 Days', benefits: ['2.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Amazon Prime + Netflix'] },
        { amount: 349, validity: '42 Days', benefits: ['3GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'All OTT Platforms'] },
        { amount: 399, validity: '56 Days', benefits: ['3.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Premium OTT Bundle'] },
        { amount: 499, validity: '70 Days', benefits: ['4.5GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Complete Entertainment Pack'] },
        { amount: 599, validity: '84 Days', benefits: ['6GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'All Premium Apps'] },
        { amount: 699, validity: '100 Days', benefits: ['7GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'Ultimate Entertainment'] },
        { amount: 799, validity: '120 Days', benefits: ['10GB Daily Data', 'Unlimited Calls', '100 SMS/Day', 'All Access Bundle'] }
    ]
};

function loadPlans(planType) {
    const container = document.getElementById('plans-container');
    if (!container) return; // Only run if the element exists
    container.innerHTML = '';

    plans[planType].forEach(plan => {
        const planCard = document.createElement('div');
        planCard.className = 'bg-white bg-opacity-50 rounded-lg p-6 text-center cursor-pointer hover:bg-opacity-70 transition-all border-2 border-transparent hover:border-purple-400';
        planCard.innerHTML = `
            <h3 class="text-2xl font-bold text-gray-900 mb-2">₹${plan.amount}</h3>
            <p class="text-gray-600 mb-4">${plan.validity}</p>
            <ul class="text-left text-gray-700 mb-4 space-y-1">
                ${plan.benefits.map(benefit => `<li>• ${benefit}</li>`).join('')}
            </ul>
            <input type="radio" name="selected-plan" value="${plan.amount}" class="w-4 h-4 text-purple-600" required>
        `;
        container.appendChild(planCard);
    });
}

// Load default plans if on plans page
if (document.getElementById('plans-container')) {
    loadPlans('topup');

    // Handle plan type change
    document.querySelectorAll('input[name="plan-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            loadPlans(e.target.value);
        });
    });
}