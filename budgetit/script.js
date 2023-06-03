function checkAuthentication() {
  // Redirect the user to the GitHub authentication page
  const clientId = "a77aaa7467210bc89727";
  const redirectUri = "http://localhost:8000/callback";
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user:email`;
}

let expensesCount = 1;
let currentVideoIndex = 0;
const videoUrls = [
  "https://www.youtube.com/watch?v=KBfEjfH9fIM",
  "https://www.youtube.com/watch?v=4YA_QPWR82U",
  "https://www.youtube.com/watch?v=6PVh2CjpTcA",
  "https://www.youtube.com/watch?v=d36mhr-F0-Y",
  "https://www.youtube.com/watch?v=J2Xp0XzYHlA",
  "https://www.youtube.com/watch?v=77K9XtnsAO4"
];

function loadVideo() {
  const videoContainer = document.getElementById("video-container");
  videoContainer.innerHTML = `
    <iframe width="560" height="315" src="${videoUrls[currentVideoIndex]}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
  `;
}

function nextVideo() {
  currentVideoIndex = (currentVideoIndex + 1) % videoUrls.length;
  loadVideo();
}

function previousVideo() {
  currentVideoIndex = (currentVideoIndex - 1 + videoUrls.length) % videoUrls.length;
  loadVideo();
}

function addExpense() {
  const expenses = document.getElementById("expenses");

  const expense = document.createElement("div");
  expense.classList.add("expense");

  const expenseNameInput = document.createElement("input");
  expenseNameInput.type = "text";
  expenseNameInput.placeholder = "Expense name";
  expenseNameInput.classList.add("expense-name");

  const expenseAmountInput = document.createElement("input");
  expenseAmountInput.type = "number";
  expenseAmountInput.placeholder = "Amount";
  expenseAmountInput.classList.add("expense-amount");

  const expenseCategorySelect = document.createElement("select");
  expenseCategorySelect.classList.add("expense-category");

  const expenseCategoryOptions = [
    { value: "utilities", label: "Utilities" },
    { value: "groceries", label: "Groceries" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "others", label: "Others" }
  ];

  expenseCategoryOptions.forEach(option => {
    const expenseCategoryOption = document.createElement("option");
    expenseCategoryOption.value = option.value;
    expenseCategoryOption.text = option.label;
    expenseCategorySelect.appendChild(expenseCategoryOption);
  });

  expense.appendChild(expenseNameInput);
  expense.appendChild(expenseAmountInput);
  expense.appendChild(expenseCategorySelect);

  expenses.appendChild(expense);
  expensesCount++;
}

function calculateBudget() {
  const income = Number(document.getElementById("income").value);
  const incomeCategory = document.getElementById("income-category").value;
  const expenses = document.getElementsByClassName("expense");

  let totalExpenses = 0;
  const expensesData = [];

  Array.from(expenses).forEach(expense => {
    const expenseAmount = Number(expense.querySelector(".expense-amount").value);
    totalExpenses += expenseAmount;

    const expenseName = expense.querySelector(".expense-name").value;
    const expenseCategory = expense.querySelector(".expense-category").value;

    expensesData.push({ name: expenseName, amount: expenseAmount, category: expenseCategory });
  });

  const remainingBudget = income - totalExpenses;

  document.getElementById("total-income").textContent = `Total Income: $${income}`;
  document.getElementById("total-expenses").textContent = `Total Expenses: $${totalExpenses}`;
  document.getElementById("remaining-budget").textContent = `Remaining Budget: $${remainingBudget}`;

  // Update income category summary
  const incomeCategorySummary = document.getElementById("income-category-summary");
  incomeCategorySummary.textContent = `Income Category: ${incomeCategory}`;

  // Store budget information in local storage
  const budgetData = {
    income,
    incomeCategory,
    totalExpenses,
    remainingBudget,
    expenses: expensesData
  };

  localStorage.setItem("budget", JSON.stringify(budgetData));

  window.scrollTo(0, document.body.scrollHeight);
}

window.addEventListener("DOMContentLoaded", () => {
  loadVideo();

  // Retrieve budget data from localStorage
  const storedBudget = JSON.parse(localStorage.getItem('budget'));
  if (storedBudget) {
    const { income, incomeCategory, totalExpenses, remainingBudget, expenses } = storedBudget;
    document.getElementById("income").value = income;
    document.getElementById("income-category").value = incomeCategory;
    document.getElementById("total-income").textContent = `Total Income: $${income}`;
    document.getElementById("total-expenses").textContent = `Total Expenses: $${totalExpenses}`;
    document.getElementById("remaining-budget").textContent = `Remaining Budget: $${remainingBudget}`;
    document.getElementById("income-category-summary").textContent = `Income Category: ${incomeCategory}`;

    expenses.forEach(expenseData => {
      const { name, amount, category } = expenseData;
      addExpenseToUI(name, amount, category);
    });
  }
});

function addExpenseToUI(expenseName, expenseAmount, expenseCategory) {
  const expenses = document.getElementById("expenses");

  const expense = document.createElement("div");
  expense.classList.add("expense");

  const expenseNameInput = document.createElement("input");
  expenseNameInput.type = "text";
  expenseNameInput.placeholder = "Expense name";
  expenseNameInput.classList.add("expense-name");
  expenseNameInput.value = expenseName;

  const expenseAmountInput = document.createElement("input");
  expenseAmountInput.type = "number";
  expenseAmountInput.placeholder = "Amount";
  expenseAmountInput.classList.add("expense-amount");
  expenseAmountInput.value = expenseAmount;

  const expenseCategorySelect = document.createElement("select");
  expenseCategorySelect.classList.add("expense-category");

  const expenseCategoryOptions = [
    { value: "utilities", label: "Utilities" },
    { value: "groceries", label: "Groceries" },
    { value: "transportation", label: "Transportation" },
    { value: "entertainment", label: "Entertainment" },
    { value: "others", label: "Others" }
  ];

  expenseCategoryOptions.forEach(option => {
    const expenseCategoryOption = document.createElement("option");
    expenseCategoryOption.value = option.value;
    expenseCategoryOption.text = option.label;
    expenseCategorySelect.appendChild(expenseCategoryOption);
  });

  expenseCategorySelect.value = expenseCategory;

  expense.appendChild(expenseNameInput);
  expense.appendChild(expenseAmountInput);
  expense.appendChild(expenseCategorySelect);

  expenses.appendChild(expense);
  expensesCount++;
}



