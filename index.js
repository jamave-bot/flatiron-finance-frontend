const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');

let newExpenseInput = document.querySelector('input#expenseName')
let valueOfExpense = docuemnt.querySelector('input#totalExpenseValue')

let newAssetInput = document.querySelector('input#assetsName')
let valueOfAsset = document.querySelector('input#totalAssetValue')

assetsForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let newAssetInput = document.querySelector('input#assetsName').value
    let valueOfAsset = parseInt(document.querySelector('input#totalAssetValue').value)
    fetchPost(newAssetInput, valueOfAsset)
})

    
expensesForm.addEventListener('submit', (evt) => {
    evt.preventDefault()
    let newExpense = newExpenseInput.value
    let newExpenseValue = valueOfExpense.value
    fetchPost(newExpense, newExpenseValue)
})



    
function fetchPost(input, valueofInput){
 fetch(`http://localhost:3000/finances`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        asset: input,
        description: 'asset',
        value: valueofInput
    }),
    })
    .then((res) => res.json())
    .then(res => {

    })
}