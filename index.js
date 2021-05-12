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
    expenseTotalh3.innerText = `Expense Total: ${expenseTotal}`
    assetTotalh3.innerText = `Asset Total: ${assetTotal}`
    grandTotalh2.innerText = `Grand Total: ${grandTotal}`
} 

function showFinances(){
    console.log("ye this is being called")
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{
            financeArr.forEach((financeObj) => {
                appendCard(financeObj)
                console.log(`got ${financeObj}`)
            })
        })    
}

function appendCard(financeObj) {
    let div
    if (financeObj.description === 'asset'){
        div = document.createElement('div');
        div.dataset.id = financeObj.id
        div.className = 'card'
        div.innerHTML = `
        <h3>Name of Asset: </h3>
        <h1> ${financeObj.name} </h1>
        <h3>Value: </h3>
        <h1 class='itemValue'> ${financeObj.value} </h1>
        <h3 class='new-trx-h3'>New Transaction</h3>
        <h1><button class='new-trx-btn'>+</button></h1>
        <button id = 'deleteBtn'> X </button> 
        `
        div.querySelector('button#deleteBtn').addEventListener('click', ()=> {    
            deleteObj(financeObj)
            div.remove()
        });
        assetsSpan.append(div)
    }
    else{
        div = document.createElement('div');
        div.dataset.id = financeObj.id
        div.className = 'card'
        div.innerHTML = `
        <h3>Name of Expense: </h3>
        <h1> ${financeObj.name} </h1>
        <h3>Value: </h3>
        <h1 class='itemValue'> ${financeObj.value} </h1>
        <h3 class='new-trx-h3'>New Transaction</h3>
        <h1><button class='new-trx-btn'>+</button></h1>
        <button id = 'deleteBtn'> X </button> 
        `
        div.querySelector('button#deleteBtn').addEventListener('click', ()=> {    
            deleteObj(financeObj)
            div.remove()
        });
        expensesSpan.append(div)
    }
    const newTrx = div.querySelector('.new-trx-btn')
    //debugger
    newTrx.addEventListener('click',(event) => {
        //console.log(financeObj.name)
        newTransaction.innerHTML = `
            <form id = 'new-transaction-form' data-id='${financeObj.id}'>
                <strong>${financeObj.description} : ${financeObj.name}</strong><br>
                <label for="newValue">New Transaction: </label><br>
                <input type="text" id="newValue" name="newValue" placeholder="Transaction Amount">
                <input type="submit" value="Submit">
            </form>`
    addTransaction(financeObj)
    });    
    updateTotals()
}

function deleteObj(financeObj){
    fetch(`http://localhost:3000/finances/${financeObj.id}`, {
        method: "DELETE",
    })
    // .then(res => res.json())
    .then(()=> console.log('deleted it'))
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
            newTransactForm.innerHTML = ''
            updateTotals()
        })
    })
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
    fetchPost('expense', newExpense, expenseValue)
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
    fetchPost('asset', newAsset, assetValue)
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

            newsDiv.className.className = 'newsDiv'
            newsLink.href = newsObj.url
            newsLink.innerText = newsObj.headline
            newsLink.className = 'newslink'
            newsImg.src = newsObj.image
            newsImg.className = 'newsimg'
            newsSummaryP.innerText = newsObj.summary
            newsSummaryP.className = 'summaryP'


            newsDiv.append(newsLink, newsSummaryP, newsImg)
            newsSidebar.append(newsDiv)
        })
    })
}