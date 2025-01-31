import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyAh401N1L6B7pH8ptuUJn1RQqIgsmA_wxA",
    authDomain: "fbla-cap.firebaseapp.com",
    projectId: "fbla-cap",
    storageBucket: "fbla-cap.appspot.com",
    messagingSenderId: "1077354575909",
    appId: "1:1077354575909:web:17cf430d6d1506e8a767cc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    }).catch((error) => {
        alert(`Error signing out: ${error.message}`);
    });
});

// Load transactions and render data
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadDashboard(user.uid);
    }
});

async function loadDashboard(userId) {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    let totalBalance = 0;
    let transactions = [];

    querySnapshot.forEach((doc) => {
        const transaction = doc.data();
        transactions.push(transaction);
        totalBalance += transaction.amount;
    });

    // Display total balance
    document.getElementById('totalBalance').textContent = `$${totalBalance.toFixed(2)}`;

    // Generate charts
    renderTransactionsChart(transactions);
    renderIncomeVsExpensesChart(transactions);
    renderCategorySpendingChart(transactions);
}

// Transactions Bar Chart (Income up, Expenses down)
function renderTransactionsChart(transactions) {
    const ctx = document.getElementById('transactionsChart').getContext('2d');
    const labels = transactions.map(t => t.name);
    const data = transactions.map(t => t.amount);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transaction Amounts',
                data: data,
                backgroundColor: data.map(amount => amount > 0 ? '#4CAF50' : '#F44336'), // Softer green & red
                borderColor: 'rgba(0, 0, 0, 0.2)', // Softer border
                borderWidth: 1,
                borderRadius: 5, // Rounded edges
                barPercentage: 0.6, // Adjust bar width
                categoryPercentage: 0.7 // Adjust spacing
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)' // Light gray grid lines
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                },
                x: {
                    grid: {
                        display: false // Remove vertical grid lines
                    },
                    ticks: {
                        font: {
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 14
                    }
                }
            }
        }
    });
}


// Income vs Expenses Over Time (Line Chart)
function renderIncomeVsExpensesChart(transactions) {
    const ctx = document.getElementById('incomeVsExpensesChart').getContext('2d');

    // Group by date
    let groupedData = {};
    transactions.forEach(t => {
        if (!groupedData[t.date]) {
            groupedData[t.date] = { income: 0, expense: 0 };
        }
        if (t.amount > 0) {
            groupedData[t.date].income += t.amount;
        } else {
            groupedData[t.date].expense += Math.abs(t.amount);
        }
    });

    const dates = Object.keys(groupedData).sort();
    const incomeData = dates.map(date => groupedData[date].income);
    const expenseData = dates.map(date => groupedData[date].expense);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [
                {
                    label: 'Income',
                    data: incomeData,
                    borderColor: 'green',
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    fill: true
                },
                {
                    label: 'Expenses',
                    data: expenseData,
                    borderColor: 'red',
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

// Pie Chart for Spending Categories
function renderCategorySpendingChart(transactions) {
    const ctx = document.getElementById('categorySpendingChart').getContext('2d');

    let categoryTotals = {};
    transactions.forEach(t => {
        if (t.amount < 0) {
            const category = t.category;
            categoryTotals[category] = (categoryTotals[category] || 0) + Math.abs(t.amount);
        }
    });

    const categories = Object.keys(categoryTotals);
    const amounts = Object.values(categoryTotals);

    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                label: 'Spending by Category',
                data: amounts,
                backgroundColor: ['blue', 'red', 'yellow', 'green', 'purple', 'orange'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
}

new Chart(ctx, {
    type: 'bar',
    data: { labels: labels, datasets: [{ data: data }] },
    options: options
});