//key variables
let transactions = [];
let balance = 0;
let totalIncome = 0;
let totalExpenses = 0;

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
  if (transactions.length === 0) {
    console.log("No transactions available.");
    return;
  }
  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];
    console.log(
      `Description: ${transaction.description}, Type: ${transaction.type}, Amount: $${transaction.amount}, Balance: $${balance}, ${transaction}`
    );
  }
}

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

function promptForNewTransaction() {
  console.log("Please enter details to add a new transaction:");
  const description = prompt("Enter transaction description:");
  const type = prompt("Enter transaction type (income/expense):");
  const amount = parseFloat(prompt("Enter transaction amount:"));

  addTransaction(description, type, amount);

  console.log(
    `Transaction added successfully! Current balance is: $${balance}.`
  );
}

function promptForDeleteTransaction() {
  console.log("Delete a transaction.");
  console.log("Current transactions:");
  displayTransactions();
  // check if there are any transactions to delete
  if (transactions.length === 0) {
    console.log("No transactions to delete.");
    return;
  }
  const userInput = parseInt(prompt("Enter the index of the transaction to delete:"));

  if(userInput === null){
    console.log("Deletion cancelled.");
    return;
  }

  // if(userInput.trim() === ""){
  //   console.log("No input provided. Deletion cancelled.");
  //   return;
  // }

  const index = parseInt(userInput);

  if(isNaN(index)){
    console.log("Invalid input. Please enter a valid number.");
    return;
  }

  if (index < 0 || index >= transactions.length) {
    console.log(`Invalid index. Please enter a number between 0 and ${transactions.length - 1}.`);
    return;
  }

  const transactionToDelete = transactions[index];

  console.log(`You are about to delete: ${transactionToDelete.description} (${transactionToDelete.type}) - $${transactionToDelete.amount}`);

  const confirmation = prompt("Are you sure you want to delete this transaction? (yes/no)");
  if (confirmation.toLowerCase() !== "yes" || confirmation == null) {
    console.log("Deletion cancelled.");
    return;
  }
  // Proceed with deletion
  deleteTransaction(index);
  console.log(
    `Transaction at index ${index} deleted successfully! Current balance is: $${balance}.`
  );
}

function showBalanceSummary() {
  console.log(`Total Income: $${totalIncome}`);
  console.log(`Total Expenses: $${totalExpenses}`);
  console.log(`Current Balance: $${balance}`);
}

function showMenu() {
  console.log("Budget Management System");
  console.log("1. Add Transaction");
  console.log("2. Delete Transaction");
  console.log("3. Show Transactions");
  console.log("4. Show Balance Summary");
  console.log("5. Exit");

  let choice = prompt("Enter your choice(1-5):");

  switch (choice) {
    case "1":
      promptForNewTransaction();
      break;
    case "2":
      promptForDeleteTransaction();
      break;
    case "3":
      displayTransactions();
      break;
    case "4":
      showBalanceSummary();
      break;
    case "5":
      console.log("Exiting the Simple Personal Budgeting App. Goodbye!");
      break;
    default:
      console.log("Invalid choice. Please try again.");
  }
}

console.log("Welcome to the Simple Personal Budgeting App!");
showMenu();

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
    console.log(`Current balance: $${balance}`);
  }
});
