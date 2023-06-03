function addExpenseToDatabase(expenseName, expenseAmount, expenseCategory) {
  // ...

  // Store the expense data in localStorage
  const expenseData = {
    name: expenseName,
    amount: expenseAmount,
    category: expenseCategory
  };
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expenseData);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  // ...
}

function addExpense() {
  // Retrieve expense data from the form
  const expenseName = document.querySelector('.expense-name').value;
  const expenseAmount = Number(document.querySelector('.expense-amount').value);
  const expenseCategory = document.querySelector('.expense-category').value;

  addExpenseToDatabase(expenseName, expenseAmount, expenseCategory);

  // Increment expensesCount and update the UI
  expensesCount++;
  // ...
}