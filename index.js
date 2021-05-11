const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');
const newTransactForm = document.querySelector('#new-transaction-form')
addTransaction()
function updateTotals() {
    const expenseTotal = expensesDiv.totalExpenseValue.value
    const assetTotal = expensesDiv.totalAssetValue.value
    const grandTotal = parseInt(expenseTotal) + parseInt(assetTotal)
} 

function addTransaction (item) {
    newTransactForm.addEventListener ('submit', (event) => {
        event.preventDefault()
        const newTransactionValue = event.target.newValue.value
        fetch(`http://localhost:3000/finances/${newTransactForm.dataset.id}`,
            {method: "PATCH",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({value : parseInt(newTransactionValue)})
            }
        )
        .then(res => res.json())
        .then(amount => console.log(amount.value))
    })
}