import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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
        openModal(`Error signing out: ${error.message}`);
    });
});

// Check if user is logged in
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
    } else {
        loadTransactions(user.uid);
    }
});

// Load transactions with search filter
async function loadTransactions(userId, searchQuery = '', searchCriteria = 'name') {
    const transactionsRef = collection(db, 'transactions');
    const q = query(transactionsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);

    const transactionTableBody = document.getElementById('transactionTableBody');
    transactionTableBody.innerHTML = '';

    // Convert searchQuery to lowercase for case-insensitive filtering
    const lowerSearchQuery = searchQuery.toLowerCase().trim();

    let totalBalance = 0; // Initialize total balance

    querySnapshot.forEach((doc) => {
        const transaction = doc.data();

        // Perform filtering based on the selected search criteria
        let fieldValue;
        switch (searchCriteria) {
            case 'name':
                fieldValue = transaction.name.toLowerCase();
                break;
            case 'type':
                fieldValue = transaction.type.toLowerCase();
                break;
            case 'category':
                fieldValue = transaction.category.toLowerCase();
                break;
            default:
                fieldValue = transaction.name.toLowerCase();
        }

        // Check if the field value includes the search query
        if (!lowerSearchQuery || fieldValue.includes(lowerSearchQuery)) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.name}</td>
                <td>${transaction.type}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
                <td>${transaction.category}</td>
                <td>${transaction.date}</td>
                <td>
                    <button onclick="editTransaction('${doc.id}')">Edit</button>
                    <button class="delete" onclick="deleteTransaction('${doc.id}')">Delete</button>
                </td>
            `;
            transactionTableBody.appendChild(row);

            // Update total balance
            totalBalance += transaction.amount;
        }
    });

    // Display total balance (optional)
    const balanceRow = document.createElement('tr');
    balanceRow.innerHTML = `
        <td colspan="5" style="text-align: right;"><strong>Total Balance:</strong></td>
        <td><strong>$${totalBalance.toFixed(2)}</strong></td>
    `;
    transactionTableBody.appendChild(balanceRow);
}

// Track if a transaction is being edited
let editingTransactionId = null;

// Reference buttons
const addTransactionBtn = document.getElementById('addTransactionBtn');
const updateTransactionBtn = document.getElementById('updateTransactionBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const addTransactionForm = document.getElementById('addTransactionForm');

// Handle Add Transaction
addTransactionBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user) {
        const name = document.getElementById('name').value.trim();
        const type = document.getElementById('type').value;
        const amount = parseFloat(document.getElementById('amount').value);
        const category = document.getElementById('category').value;
        const date = document.getElementById('date').value;

        // Validate form fields
        if (!name || !type || isNaN(amount) || !category || !date) {
            openModal("Please fill out all fields before submitting.");
            return;
        }

        // Adjust amount based on transaction type
        const adjustedAmount = type === 'Income' ? amount : -amount;

        // Add new transaction
        await addDoc(collection(db, 'transactions'), {
            userId: user.uid,
            name,
            type,
            amount: adjustedAmount,
            category,
            date
        });

        // Reset form
        addTransactionForm.reset();
        loadTransactions(user.uid);
        openModal("Transaction added successfully!");
    }
});

// Handle Edit Transaction
window.editTransaction = async (transactionId) => {
    const transactionRef = doc(db, 'transactions', transactionId);
    const transactionSnapshot = await getDoc(transactionRef);

    if (transactionSnapshot.exists()) {
        const transaction = transactionSnapshot.data();

        // Adjust amount for display in the form
        const displayAmount = transaction.type === 'Income' ? transaction.amount : -transaction.amount;

        // Populate form fields
        document.getElementById('name').value = transaction.name;
        document.getElementById('type').value = transaction.type;
        document.getElementById('amount').value = displayAmount;
        document.getElementById('category').value = transaction.category;
        document.getElementById('date').value = transaction.date;

        // Set the transaction ID for updating
        editingTransactionId = transactionId;

        // Hide Add button, show Update and Cancel buttons
        addTransactionBtn.style.display = "none";
        updateTransactionBtn.style.display = "inline-block";
        cancelEditBtn.style.display = "inline-block";
    }
};

// Handle Update Transaction
updateTransactionBtn.addEventListener('click', async () => {
    if (!editingTransactionId) return;

    const name = document.getElementById('name').value.trim();
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;

    // Validate form fields
    if (!name || !type || isNaN(amount) || !category || !date) {
        openModal("Please fill out all fields before updating.");
        return;
    }

    // Adjust amount based on transaction type
    const adjustedAmount = type === 'Income' ? amount : -amount;

    const transactionRef = doc(db, 'transactions', editingTransactionId);
    const updatedTransaction = {
        name,
        type,
        amount: adjustedAmount,
        category,
        date
    };

    await updateDoc(transactionRef, updatedTransaction);

    // Reset form and buttons
    addTransactionForm.reset();
    editingTransactionId = null;
    addTransactionBtn.style.display = "inline-block";
    updateTransactionBtn.style.display = "none";
    cancelEditBtn.style.display = "none";

    // Reload transactions
    loadTransactions(auth.currentUser.uid);
    openModal("Transaction updated successfully!");
});

// Handle Cancel Edit
cancelEditBtn.addEventListener('click', () => {
    addTransactionForm.reset();
    editingTransactionId = null;
    addTransactionBtn.style.display = "inline-block";
    updateTransactionBtn.style.display = "none";
    cancelEditBtn.style.display = "none";
});

// Delete transaction
window.deleteTransaction = async (transactionId) => {
        await deleteDoc(doc(db, 'transactions', transactionId));
        const user = auth.currentUser;
        if (user) {
            loadTransactions(user.uid);
            openModal("Transaction deleted successfully!");
        }
};

// Search transactions in real-time
document.getElementById('searchInput').addEventListener('input', () => {
    const user = auth.currentUser;
    if (user) {
        const searchValue = document.getElementById('searchInput').value;
        const searchCriteria = document.getElementById('searchCriteria').value; // Get selected criteria
        loadTransactions(user.uid, searchValue, searchCriteria); // Pass criteria to loadTransactions
    }
});

document.getElementById('searchCriteria').addEventListener('change', () => {
    const user = auth.currentUser;
    if (user) {
        const searchValue = document.getElementById('searchInput').value;
        const searchCriteria = document.getElementById('searchCriteria').value;
        loadTransactions(user.uid, searchValue, searchCriteria);
    }
});


// Function to open the modal with a message
function openModal(message) {
    const modal = document.getElementById('customModal');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalMessage = document.getElementById('modalMessage');

    modalMessage.textContent = message;
    modal.style.display = 'block';
    modalOverlay.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('customModal');
    const modalOverlay = document.getElementById('modalOverlay');

    modal.style.display = 'none';
    modalOverlay.style.display = 'none';
}

// Add this code to your existing JavaScript file (transactions.js)

// Export Transactions Button
document.getElementById('exportBtn').addEventListener('click', async () => {
    const user = auth.currentUser;
    if (user) {
        const transactionsRef = collection(db, 'transactions');
        const q = query(transactionsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);

        // Prepare CSV content
        let csvContent = "Name,Type,Amount,Category\n"; // CSV header

        querySnapshot.forEach((doc) => {
            const transaction = doc.data();
            const row = [
                transaction.name,
                transaction.type,
                `$${transaction.amount.toFixed(2)}`,
                transaction.category
            ].join(',');
            csvContent += row + '\n';
        });

        // Create a Blob and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', 'transactions.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        openModal("Transactions exported successfully!");
    }
});