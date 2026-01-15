const balance = document.querySelector("#balance");
const inc_amt = document.querySelector("#inc-amt");
const exp_amt = document.querySelector("#exp-amt");
const trans = document.querySelector("#trans");
const form = document.querySelector("#form");
const description = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const transactionSection = document.querySelector("#transaction-section");

const localStorageTrans = JSON.parse(localStorage.getItem("trans"));
let transactions = localStorage.getItem("trans") !== null ? localStorageTrans : [];

/* SHOW / HIDE TRANSACTION SECTION */
function toggleTransactionSection() {
  transactionSection.style.display =
    transactions.length === 0 ? "none" : "flex";
}

/* LOAD TRANSACTION */
function loadTransactionDetails(transaction) {
  const sign = transaction.amount < 0 ? "-" : "+";
  const item = document.createElement("li");

  item.classList.add(transaction.amount < 0 ? "exp" : "inc");

  item.innerHTML = `
    ${transaction.description}
    <span>${sign} ₹${Math.abs(transaction.amount)}</span>
    <button class="btn-del" onclick="removeTrans(${transaction.id})">x</button>
  `;

  trans.appendChild(item);
}

/* REMOVE TRANSACTION */
function removeTrans(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateLocalStorage();
  config();
}

/* UPDATE BALANCE */
function updateAmount() {
  const amounts = transactions.map((t) => t.amount);

  const total = amounts.reduce((acc, val) => acc + val, 0).toFixed(2);
  const income = amounts.filter((v) => v > 0).reduce((a, v) => a + v, 0).toFixed(2);
  const expense = Math.abs(
    amounts.filter((v) => v < 0).reduce((a, v) => a + v, 0)
  ).toFixed(2);

  balance.innerHTML = `₹ ${total}`;
  inc_amt.innerHTML = `₹ ${income}`;
  exp_amt.innerHTML = `₹ ${expense}`;
}

/* CONFIG */
function config() {
  trans.innerHTML = "";
  transactions.forEach(loadTransactionDetails);
  updateAmount();
  toggleTransactionSection();
}

/* ADD TRANSACTION */
function addTransaction(e) {
  e.preventDefault();

  if (description.value === "" || amount.value === "") {
    alert("Please enter description and amount");
    return;
  }

  const transaction = {
    id: Math.floor(Math.random() * 10000000),
    description: description.value,
    amount: +amount.value,
  };

  transactions.push(transaction);
  updateLocalStorage();
  config();

  description.value = "";
  amount.value = "";
}

function updateLocalStorage() {
  localStorage.setItem("trans", JSON.stringify(transactions));
}

form.addEventListener("submit", addTransaction);
window.addEventListener("load", config);
