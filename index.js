const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');


function updateTotals() {
    const expenseTotal = expensesDiv.totalExpenseValue.value
    const assetTotal = expensesDiv.totalAssetValue.value
    const grandTotal = parseInt(expenseTotal) + parseInt(assetTotal)
} 

function showFinances(){
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{
            financeArr.forEach(financeObj => {
                let div
                if (financeObj.description === 'asset'){
                    div = document.createElement('div');
                    div.dataset.id = financeObj.id
                    div.innerHTML = `
                    <h3>Name of Asset: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1 class='itemValue'> ${financeObj.value} </h1>
                    `
                    assetsDiv.append(div)
                }
                else{
                    div = document.createElement('div');
                    div.dataset.id = financeObj.id
                    div.innerHTML = `
                    <h3>Name of Expense: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1 class='itemValue'> ${financeObj.value} </h1>
                    `
                    expensesDiv.append(div)
                }
               
                div.addEventListener('click',(event) => {
                    newTransaction.innerHTML = `
                        <form id = 'new-transaction-form' data-id='${financeObj.id}'>
                            <label for="newValue">New Transaction: </label><br>
                            <input type="text" id="newValue" name="newValue" placeholder="Transaction Amount">
                            <input type="submit" value="Submit">
                        </form>`
                 addTransaction(financeObj)
                })
            });
        })
}

showFinances();

function addTransaction (financeObj) {
    const newTransactForm = document.querySelector('#new-transaction-form')
    newTransactForm.addEventListener ('submit', (event) => {
        event.preventDefault()
        const newTransactionValue = financeObj.value + (parseInt(event.target.newValue.value) || 0)
        //console.log(newTransactionValue)
        fetch(`http://localhost:3000/finances/${newTransactForm.dataset.id}`,
            {method: "PATCH",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({value : parseInt(newTransactionValue)})
            }
        )
        .then(res => res.json())
        .then((newValue) => {
            document.querySelector(`div[data-id = "${financeObj.id}"] .itemValue`).innerText = newValue.value
            newTransactForm.innerHTML = ''
        })
    })
}