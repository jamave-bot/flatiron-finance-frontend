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

const expenseSelect = `
<select name="selectCategory" id="selectCategory">
    <option value="Mortgage">Mortgage</option>
    <option value="Auto Loan">Auto Loan</option>
    <option value="Tuition">Tuition</option>
    <option value="Household Goods">Household Goods</option>
    <option value="Travel">Travel</option>
    <option value="Miscellaneous">Miscellaneous</option>
</select>`

const assetSelect = `
<select name="selectCategory" id="selectCategory">
    <option value="Wages">Wages</option>
    <option value="Gift">Gift</option>
    <option value="Investment">Investment</option>
    <option value="Real Estate">Real Estate</option>
    <option value="Benefits">Benefits</option>
    <option value="Miscellaneous">Miscellaneous</option>
</select>`

let assetExpenseChart
let assetCategoryArray
let assetExpensechartDataObj
let assetExpenseChartData = []
const assetExpenseChartBackgroundColor = [
    'rgb(255, 99, 132)',
    'rgb(54, 162, 235)'
]
const assetExpenseChartLabels = ['Expenses', 'Assets']

let expenseCategoryChart
let expenseCategoryArray
let expenseCategoryChartData = []
let expenseCategoryChartLabels = [] //= ["Mortgage", "Auto Loan", "Tuition", "Household Goods",  "Travel","Miscellaneous"]
const expenseCategoryChartBackgroundColor = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86',
    'rgb(54, 162, 235)',
    'rgb(75, 192, 192)',
    'rgb(153, 102, 255)'
  ]

let assetCategoryChart  
let assetCategoryChartData = []
let assetCategoryChartLabels = []//= ["Wages", "Gift", "Investment", "Real Estate", "Benefits", "Miscellaneous"]
const assetCategoryChartBackgroundColor = [
    'rgb(255, 99, 132)',
    'rgb(255, 159, 64)',
    'rgb(255, 205, 86)',
    'rgb(75, 192, 192)',
    'rgb(54, 162, 235)',
    'rgb(153, 102, 255)'
  ]

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
    assetExpenseChartData = [expenseTotal, assetTotal]
    //assetExpensechartDataObj.data = assetExpenseChartData
    updatePieChart(assetExpenseChartData)
} 

function showFinances(){
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{           
            financeArr.forEach((financeObj) => {appendCard(financeObj)})
            expenseCategoryArray = createChartArrays(financeArr.filter((elementObj) => elementObj.description.toLowerCase() === 'expense')) 
            expenseCategoryChartLabels = Object.keys(expenseCategoryArray)
            expenseCategoryChartData = Object.values(expenseCategoryArray)
            assetCategoryArray = createChartArrays(financeArr.filter((elementObj) => elementObj.description.toLowerCase() === 'asset'))  
            assetCategoryChartLabels = Object.keys(assetCategoryArray)
            assetCategoryChartData = Object.values(assetCategoryArray)
            renderCharts()
            updateTotals()
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
        if (!confirm(`Are you sure you want to delete your ${financeObj.name} ${financeObj.description}?`)) {
            return
        }
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
                <input type="text" id="newValue" name="newValue" placeholder="Transaction Amount"><br>
                ${(financeObj.description.toLowerCase() === 'asset')?assetSelect:expenseSelect}<br>
                <input type="submit" value="Submit">
            </form>`
        newTransaction.querySelector('button').addEventListener('click',(event) => {
            newTransaction.style.display = 'none'
        })
        addTransaction(financeObj)
    });    
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
        const newCategory = event.target.selectCategory.value
        const newTrxArr = [...financeObj.transactions]
        newTrxArr.push({category : newCategory, date : `${new Date().getMonth()}/${new Date().getDate()}`
        , value : (parseInt(event.target.newValue.value) || 0)})
        //console.log(newTransactionValue)
        //console.log(financeObj.value)
        //console.log(newTransactionValue)
        fetch(`http://localhost:3000/finances/${newTransactForm.dataset.id}`,
            {method: "PATCH",
            headers:{"Content-Type" : "application/json"},
            body: JSON.stringify({value : parseInt(newTransactionValue),
            transactions : newTrxArr})
            }
        )
        .then(res => res.json())
        .then((newTrxobj) => {
            document.querySelector(`div[data-id = "${financeObj.id}"] .itemValue`).innerText = newTrxobj.value
            financeObj.value = newTrxobj.value
            financeObj.transactions = newTrxobj.transactions
            newTransactForm.innerHTML = ''
            newTransaction.style.display = 'none'
            updateTotals()
        })
    })
}
    
expensesForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let newExpense = newExpenseInput.value
    let sanitizedExpenseValue = expenseValueInput.value.replace(/[^0-9]+/g, '')
    let expenseValue = parseInt(sanitizedExpenseValue)
    let newCategory = evt.target.expenseCategory.value
    if (sanitizedExpenseValue == '' || newExpense === '') {
        alert('Your Name or Value input are not valid. Please enter a valid name and value.')
        return
    }
    fetchPost('Expense', newExpense, expenseValue, newCategory)
    evt.target.reset()
})

assetsForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    //console.log('hi')
    let newAsset = newAssetInput.value
    let sanitizedAssetValue = assetValueInput.value.replace(/[^0-9]+/g, '')
    let assetValue = parseInt(sanitizedAssetValue)
    let newCategory = evt.target.expenseCategoryArray.value
    //console.log(assetValue)
    //console.log(typeof assetValue)
    if (sanitizedAssetValue === '' || newAsset === '') {
        alert('Your Name or Value inputs are not valid. Please enter a valid name and value.')
        return
    }
    fetchPost('Asset', newAsset, assetValue, newCategory)
    evt.target.reset()
})
    
function fetchPost(type, input, valueofInput, category){
    fetch(`http://localhost:3000/finances`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        name: input,
        description: type,
        value: parseInt(valueofInput),
        transactions : [{category : category, date : `${new Date().getMonth()}/${new Date().getDate()}`
        , value : valueofInput}]
    }),
    })
    .then((res) => res.json())
    .then(newObj => { 
        appendCard (newObj)
        updateTotals()
    })
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


function renderCharts() {
    //For Asset VS Expense Pie Chart
    assetExpensechartDataObj = {
        labels: assetExpenseChartLabels,
        datasets: [{
            label: 'Assets VS Expenses',
            data: assetExpenseChartData,
            backgroundColor: assetExpenseChartBackgroundColor,
            hoverOffset: 4,
        }]
    };
    assetExpenseConfig = {
        type: 'doughnut',
        data: assetExpensechartDataObj,
    };
    assetExpenseChart = new Chart(
        document.getElementById('assetExpenseChartData'),
        assetExpenseConfig
    );

    //For Expense Category Pie Chart
    expenseCategoryDataObj = {
        labels: expenseCategoryChartLabels,
        datasets: [{
          label: 'Expense Categories Breakdown',
          data: expenseCategoryChartData,
          backgroundColor: expenseCategoryChartBackgroundColor,
          hoverOffset: 4
        }]
      };
      expenseCategoryConfig = {
        type: 'doughnut',
        data: expenseCategoryDataObj,
    };
    expenseCategoryChart = new Chart(
        document.getElementById('expenseCategoryChartData'),
        expenseCategoryConfig
    );

    //For Asset Category Pie Chart
    assetCategoryDataObj = {
        labels: assetCategoryChartLabels,
        datasets: [{
          label: 'Asset Categories Breakdown',
          data: assetCategoryChartData,
          backgroundColor: assetCategoryChartBackgroundColor,
          hoverOffset: 4
        }]
      };
      assetCategoryConfig = {
        type: 'doughnut',
        data: assetCategoryDataObj,
    };
    assetCategoryChart = new Chart(
        document.getElementById('assetCategoryChartData'),
        assetCategoryConfig
    );
}

function updatePieChart(chart) {
    assetExpenseChart.data.datasets.pop();
    assetExpenseChart.data.datasets.push({
      label: assetExpenseChartLabels,
      backgroundColor: assetExpenseChartBackgroundColor,
      data: chart
    });
    //console.log(chart)
    assetExpenseChart.update();
    
    fetch('http://localhost:3000/finances')
    .then(res => res.json())
    .then((financeArr)=>{    
        
        //Update Expense Category Chart
        expenseCategoryArray = createChartArrays(financeArr.filter((elementObj) => elementObj.description.toLowerCase() === 'expense')) 
        expenseCategoryChartLabels = Object.keys(expenseCategoryArray)
        expenseCategoryChartData = Object.values(expenseCategoryArray)
        expenseCategoryChart.data.datasets.pop();
        expenseCategoryChart.data.datasets.push({
          label: expenseCategoryChartLabels,
          backgroundColor: expenseCategoryChartBackgroundColor,
          data: expenseCategoryChartData
        });
        expenseCategoryChart.update();
        
        //Update Asset Category Chart  
        assetCategoryArray = createChartArrays(financeArr.filter((elementObj) => elementObj.description.toLowerCase() === 'asset'))  
        assetCategoryChartLabels = Object.keys(assetCategoryArray)
        assetCategoryChartData = Object.values(assetCategoryArray)
        assetCategoryChart.data.datasets.pop();
        assetCategoryChart.data.datasets.push({
          label: assetCategoryChartLabels,
          backgroundColor: assetCategoryChartBackgroundColor,
          data: assetCategoryChartData
        });
        assetCategoryChart.update();
        console.log('expenseCategoryChart')
        // console.log(assetChartData, assetChartLabels)
        // console.log(expenseChartData, expenseChartLabels)
    })
  }

function createChartArrays(objArray) {        
    const newObject = {}
    objArray.forEach((elementObj) => {
        //console.log(elementObj.transactions)
        elementObj.transactions.forEach (trxObj => {
            newObject[trxObj.category] = newObject[trxObj.category] || 0
            Object.assign(newObject, {[trxObj.category] : newObject[trxObj.category] += trxObj.value})
        })
    })
    return newObject
}


function openNav() {
    document.getElementById("sidebar").style.width = "250px";
    document.querySelector("body").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("sidebar").style.width = "0";
    document.querySelector("body").style.marginLeft= "0";
}