const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');
const expensesSpan = document.getElementById('expenses-span')
const assetsSpan = document.getElementById('assets-span')

const expenseTotalh3 = document.querySelector('h3#expenseTotal')
const assetTotalh3 = document.querySelector('h3#assetTotal')
const grandTotalh2 = document.querySelector('h2#grandTotal')

let newExpenseInput = document.querySelector('input#expenseName')
let expenseValueInput = document.querySelector('input#totalExpenseValue')
let newAssetInput = document.querySelector('input#assetsName')
let assetValueInput = document.querySelector('input#totalAssetValue')

const newsSidebar = document.querySelector('div#sidebar')

let chartData = []
const chartLabels = ['Expenses', 'Assets']

showFinances()
addNewsbar ()

function updateTotals() {
    const expenseArray = expensesSpan.querySelectorAll('.itemValue')
    let expenseTotal = 0
    for (value of expenseArray) {
        expenseTotal += parseInt(value.innerText)
    }
    
    const assetArray = assetsSpan.querySelectorAll('.itemValue')
    let assetTotal = 0 
    for (value of assetArray) {
        assetTotal += parseInt(value.innerText)
    }
    
    const grandTotal = parseInt(assetTotal) - parseInt(expenseTotal)
    expenseTotalh3.innerText = `Total Expenses: ${expenseTotal}`
    assetTotalh3.innerText = `Total Assets: ${assetTotal}`
    grandTotalh2.innerText = `Net Assets: ${grandTotal}`
} 

function showFinances(){
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{
            financeArr.forEach((financeObj) => {appendCard(financeObj)})
            renderChart()
        })    
}

function appendCard(financeObj) {
    let div
    div = document.createElement('div');
    div.dataset.id = financeObj.id
    div.className = 'card'
    if (financeObj.description.toLowerCase() === 'asset'){
        div.innerHTML = `
        <h3>Name of Asset: </h3>
        <h1> ${financeObj.name} </h1>
        <h3>Value: </h3>
        <h1 class='itemValue'> ${financeObj.value} </h1>
        <h3 class='new-trx-h3'>New Transaction</h3>
        <h1><button class='new-trx-btn'>+</button></h1>
        <button id = 'deleteBtn'> X </button> 
        `
        assetsSpan.append(div)
    } else {
        div.innerHTML = `
        <h3>Name of Expense: </h3>
        <h1> ${financeObj.name} </h1>
        <h3>Value: </h3>
        <h1 class='itemValue'> ${financeObj.value} </h1>
        <h3 class='new-trx-h3'>New Transaction</h3>
        <h1><button class='new-trx-btn'>+</button></h1>
        <button id = 'deleteBtn'> X </button> 
        `
        expensesSpan.append(div)
    }
    div.querySelector('button#deleteBtn').addEventListener('click', ()=> {    
        deleteObj(financeObj)
        div.remove()
    });
    const newTrx = div.querySelector('.new-trx-btn')
    //debugger
    newTrx.addEventListener('click',(event) => {
        //console.log(financeObj.name)
        newTransaction.style.display = 'block'
        newTransaction.innerHTML = `
            <form id = 'new-transaction-form' data-id='${financeObj.id}'>
                <strong>${financeObj.description.capitalize()} : ${financeObj.name}</strong><button>x</button><br>
                <label for="newValue">New Transaction: </label><br>
                <input type="text" id="newValue" name="newValue" placeholder="Transaction Amount">
                <input type="submit" value="Submit">
            </form>`
    const deleteBtn = newTransaction.querySelector('button')
    deleteBtn.addEventListener('click',(event) => {
        newTransactForm.innerHTML = ''
        newTransaction.style.display = 'none'
    })
    addTransaction(financeObj)
    });    
    //updateTotals()
    chartData = updateTotals()

}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
function deleteObj(financeObj){
    fetch(`http://localhost:3000/finances/${financeObj.id}`, {
        method: "DELETE",
    })
    .then(res => res.json())
    .then((deletedObj)=> {
        updateTotals();
        console.log(`deleted ${deletedObj}`)
    })
}

function addTransaction (financeObj) {
    const newTransactForm = document.querySelector('#new-transaction-form')
    newTransactForm.addEventListener ('submit', (event) => {
        event.preventDefault()
        const newTransactionValue = financeObj.value + (parseInt(event.target.newValue.value) || 0)
        //console.log(newTransactionValue)
        //console.log(financeObj.value)
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
            financeObj.value = newValue.value
            updateTotals()
            newTransactForm.innerHTML = ''
            updateTotals()
            newTransaction.style.display = 'none'
        })
    })
    chartData = updateTotals()

}
    
expensesForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let newExpense = newExpenseInput.value
    let sanitizedExpenseValue = expenseValueInput.value.replace(/[^0-9]+/g, '')
    let expenseValue = parseInt(sanitizedExpenseValue)
    if (sanitizedExpenseValue == '' || newExpense === '') {
        alert('Your Name or Value input are not valid. Please enter a valid name and value.')
        return
    }
    fetchPost('Expense', newExpense, expenseValue)
    evt.target.reset()
})

assetsForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    //console.log('hi')
    let newAsset = newAssetInput.value
    let sanitizedAssetValue = assetValueInput.value.replace(/[^0-9]+/g, '')
    let assetValue = parseInt(sanitizedAssetValue)
    //console.log(assetValue)
    //console.log(typeof assetValue)
    if (sanitizedAssetValue === '' || newAsset === '') {
        alert('Your Name or Value inputs are not valid. Please enter a valid name and value.')
        return
    }
    fetchPost('Asset', newAsset, assetValue)
    evt.target.reset()
})
    
function fetchPost(type, input, valueofInput){
 fetch(`http://localhost:3000/finances`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: input,
        description: type,
        value: parseInt(valueofInput)
    }),
    })
    .then((res) => res.json())
    .then(newObj => { appendCard (newObj)})
}

function addNewsbar () {
    fetch('https://cloud.iexapis.com/stable/stock/market/news/?token=pk_382320c691574fe9899938299190ecd7')
    .then(res => res.json())
    .then(newsArr => {
        newsArr.forEach(newsObj => { 
            const newsDiv = document.createElement('div')
            const newsLink = document.createElement('a')
            const newsImg = document.createElement('img')
            const newsSummaryP = document.createElement('p')

            newsDiv.className = 'newsDiv'
            newsLink.href = newsObj.url
            newsLink.innerText = newsObj.headline
            newsLink.className = 'newslink'
            newsImg.src = newsObj.image
            newsImg.className = 'newsimg'
            newsSummaryP.innerText = newsObj.summary
            newsSummaryP.className = 'summaryP'


            newsDiv.append(newsImg, newsSummaryP, newsLink)
            newsSidebar.append(newsDiv)
        })
    })
}


function renderChart() {

    const ctx = document.getElementById('myChart');
        const data = {
            labels: chartLabels,
            datasets: [{
                label: 'My First Dataset',
                data: chartData,
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(54, 162, 235)'
                ],
                hoverOffset: 4,
                radius: 500
            }]
        };
        const config = {
            type: 'doughnut',
            data: data,
        };
        const myChart = new Chart(
            document.getElementById('myChart'),
            config
        );
    }
