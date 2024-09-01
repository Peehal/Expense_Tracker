// Variables to track income, expenses, and balance
let totalIncome = 0;
let totalExpenses = 0;
let balance = 0;

// Arrays to store the added transactions
let transactions = [];

// Getting references to DOM elements
const submitButton = document.getElementById("submit");
const tableBody = document.querySelector(".table-body");
const incomeBox = document.querySelector(".b1 i");
const expenseBox = document.querySelector(".b2 i");
const balanceBox = document.querySelector(".b3 i");
// const weeklyButton = document.getElementById("weekly-btn");
// const monthlyButton = document.getElementById("monthly-btn");
const expenseChart = document.getElementById('expenseChart').getContext('2d');


// Helper function to calculate and update income, expenses, and balance
function updateMoney() {
    totalIncome = 0;
    totalExpenses = 0;

    transactions.forEach(transaction => {
        if (transaction.type === "Income") {
            totalIncome += transaction.amount;
        } else {
            totalExpenses += transaction.amount;
        }
    });

    balance = totalIncome + totalExpenses;

    // Updating the UI
    incomeBox.innerText = totalIncome.toFixed(2);
    expenseBox.innerText = totalExpenses.toFixed(2);
    balanceBox.innerText = balance.toFixed(2);
}

// Helper function to format date in YYYY-MM-DD format
function formatDate(date) {
    const d = new Date(date);
    return d.toISOString().split("T")[0];
}

// Function to add a row to the table
function addTransaction(transaction) {
    const row = document.createElement("tr");

    // Create cells
    const nameCell = document.createElement("td");
    const amountCell = document.createElement("td");
    const categoryCell = document.createElement("td");
    const dateCell = document.createElement("td");
    const actionCell = document.createElement("td");

    nameCell.innerText = transaction.name;
    amountCell.innerText = transaction.type === "Income" ? `+${transaction.amount}` : `-${transaction.amount}`;
    categoryCell.innerText = transaction.type;
    dateCell.innerText = formatDate(transaction.date);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerText = "Delete";
    deleteBtn.addEventListener("click", () => {
        // Remove transaction from the array and update the table
        transactions = transactions.filter(t => t !== transaction);
        row.remove();
        updateMoney();
    });

    actionCell.appendChild(deleteBtn);

    // Append cells to the row
    row.appendChild(nameCell);
    row.appendChild(amountCell);
    row.appendChild(categoryCell);
    row.appendChild(dateCell);
    row.appendChild(actionCell);

    // Add the row to the table
    tableBody.appendChild(row);
}

// Event listener for the submit button
submitButton.addEventListener("click", (e) => {
    e.preventDefault();

    // Getting values from input fields
    const name = document.querySelector(".Name").value;
    const amount = parseFloat(document.querySelector(".Amount").value);
    const category = document.querySelector("#Expense-Category").value;
    const date = document.querySelector("#expense-date").value;

    // Validate inputs
    if (!name || !amount || !category || !date) {
        alert("Please fill in all fields.");
        return;
    }

    const transaction = {
        name,
        amount: category === "Income" ? amount : -amount,
        type: category,
        date: new Date(date)
    };

    // Add the transaction to the array and the table
    transactions.push(transaction);
    addTransaction(transaction);
    updateMoney();

    // Clear input fields after adding the transaction
    document.querySelector(".Name").value = "";
    document.querySelector(".Amount").value = "";
    document.querySelector("#Expense-Category").value = "";
    document.querySelector("#expense-date").value = "";
});


function calculateExpenses(period) {
    const now = new Date();
    let filteredExpenses = 0;

    transactions.forEach(transaction => {
        const transactionDate = new Date(transaction.date);

        if (transaction.type !== "Income") {
            if (period === 'weekly') {
                const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
                if (transactionDate >= startOfWeek) {
                    filteredExpenses += Math.abs(transaction.amount);
                }
            } else if (period === 'monthly') {
                if (transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear()) {
                    filteredExpenses += Math.abs(transaction.amount);
                }
            }
        }
    });

    return filteredExpenses.toFixed(2);
}

// Display pie chart
function displayChart(period) {
    const filteredExpenses = calculateExpenses(period);
    const incomePercentage = (totalIncome / (totalIncome + filteredExpenses)) * 100;
    const expensePercentage = (filteredExpenses / (totalIncome + filteredExpenses)) * 100;

    new Chart(expenseChart, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                data: [incomePercentage, expensePercentage],
                backgroundColor: ['rgba(255, 192, 203, 0.8)', 'rgba(255, 105, 180, 0.8)'],
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: `Expense Breakdown - ${period.charAt(0).toUpperCase() + period.slice(1)}`
                }
            }
        }
    });
}

// Event listeners for buttons
document.getElementById("show-weekly").addEventListener("click", () => displayChart('weekly'));
document.getElementById("show-monthly").addEventListener("click", () => displayChart('monthly'));



