//key variables
let transactions = [];
let balance = 0;
let totalIncome = 0;
let totalExpenses = 0;

const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const transactionForm = document.querySelector(".transaction-form");
const transactionHistoryBody = document.querySelector(
  "#transaction-history tbody"
);
const totalIncomeElem = document.getElementById("total-income");
const totalExpensesElem = document.getElementById("total-expenses");
const totalBalanceElem = document.getElementById("total-balance");

//event listener for form submission to add a transaction and update the ui
transactionForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const description = descriptionInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const type = typeInput.value;

  addTransaction(description, type, amount);
  displayTransactions();
  renderSummary();

  //clear input fields after submission
  descriptionInput.value = "";
  amountInput.value = "";
  typeInput.value = "income";
});

//function to add a transaction
function addTransaction(description, type, amount) {
  if (typeof amount !== "number" || amount <= 0) {
    console.log("Invalid amount. Please enter a positive number.");
    return;
  }
  if (type !== "income" && type !== "expense") {
    console.log("Invalid type. Please use 'income' or 'expense'.");
    return;
  }
  if (description.trim() === "") {
    console.log("Description cannot be empty.");
    return;
  }

  const transaction = {
    description,
    type,
    amount,
  };
  transactions.push(transaction);

  if (type === "income") {
    totalIncome += transaction.amount;
  } else {
    totalExpenses += transaction.amount;
  }

  balance = calculateBalance();
  saveData();
}

//function to calculate balance
function calculateBalance() {
  totalIncome = 0;
  totalExpenses = 0;
  for (let transaction of transactions) {
    if (transaction.type === "income") {
      totalIncome += transaction.amount;
    } else if (transaction.type === "expense") {
      totalExpenses += transaction.amount;
    }
  }
  balance = totalIncome - totalExpenses;
  return balance;
}

function displayTransactions() {
  transactionHistoryBody.innerHTML = "";
  transactions.forEach((transaction, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
    <td> ${transaction.description}</td>
    <td>$${transaction.amount.toFixed(2)}</td>
    <td class="type-text-${transaction.type}">${capitalize(transaction.type)}</td>
    <td>
        <button class="btn btn-danger btn-sm delete-transaction-button" data-index="${index}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    transactionHistoryBody.appendChild(row);
  });
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// delete transactions and update the UI
transactionHistoryBody.addEventListener("click", function(e){
  if(e.target.closest('.delete-transaction-button')){
    const index = e.target.closest('.delete-transaction-button').dataset.index;
    deleteTransaction(Number(index));
    displayTransactions();
    renderSummary();
  }
})

function deleteTransaction(index) {
  if (index < 0 || index >= transactions.length) {
    console.log("Invalid index.");
    return false;
  }
  const transactionToDelete = transactions[index];

  transactions.splice(index, 1);

  calculateBalance();

  saveData();
}

function renderSummary() {
  totalIncomeElem.textContent = `$${totalIncome.toFixed(2)}`;
  totalExpensesElem.textContent = `$${totalExpenses.toFixed(2)}`;
  totalBalanceElem.textContent = `$${balance.toFixed(2)}`;
}

//data saving and loading through browser sessions
function saveData() {
  //convert transaction array to JSON string
  localStorage.setItem("budgetAppTransactions", JSON.stringify(transactions));

  localStorage.setItem(
    "budgetAppTotals",
    JSON.stringify({
      balance: balance,
      totalIncome: totalIncome,
      totalExpenses: totalExpenses,
    })
  );

  console.log("All transactions saved successfully!");
}

function loadData() {
  const savedTransactions = localStorage.getItem("budgetAppTransactions");

  if (!savedTransactions) {
    console.log("No saved data found");
    return;
  }

  try {
    transactions = JSON.parse(savedTransactions);
    const savedTotals = localStorage.getItem("budgetAppTotals");
    if (savedTotals) {
      const totals = JSON.parse(savedTotals);
      balance = totals.balance;
      totalIncome = totals.totalIncome;
      totalExpenses = totals.totalExpenses;
    } else {
      calculateBalance();
    }
    console.log("Data loaded successfully!");
    return true;
  } catch (error) {
    console.log("Error loading data:", error);
    return false;
  }
}

window.addEventListener("load", function () {
  if (loadData()) {
    displayTransactions();
    renderSummary();
  }
});
