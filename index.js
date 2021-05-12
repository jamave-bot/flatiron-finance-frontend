const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');
const expensesSpan = document.getElementById('expenses-span')
const assetsSpan = document.getElementById('assets-span')


function showFinances(){
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{
            financeArr.forEach(financeObj => {
                if (financeObj.description === 'expense'){
                    let div = document.createElement('div');
                    div.className = 'card'
                    div.innerHTML = `
                    <h3>Name of Expense: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1> ${financeObj.value} </h1>
                    <button> X </button> 
                    `
                    div.querySelector('button').addEventListener('click', ()=> {    
                        deleteObj(financeObj)
                        div.innerHTML = ''
                    });
                    expensesSpan.append(div)
                }
                else{
                    let div = document.createElement('div');
                    div.className = 'card'
                    div.innerHTML = `
                    <h3>Name of Asset: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1> ${financeObj.value} </h1>
                    <button> X </button> 
                    `
                    div.querySelector('button').addEventListener('click', ()=> {    
                        deleteObj(financeObj)
                        div.innerHTML = ''
                    });
                    assetsSpan.append(div)
                }
            });
        })
}

showFinances();

function deleteObj(financeObj){
    fetch(`http://localhost:3000/finances/${financeObj.id}`, {
        method: "DELETE",
    })
    // .then(res => res.json())
    .then(()=> console.log('deleted it'))
}


let newAssetInput = document.querySelector('input#assetsName')
let valueOfAsset = document.querySelector('input#totalAssetValue')

assetsForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    let newAssetInput = document.querySelector('input#assetsName').value
    let valueOfAsset = parseInt(document.querySelector('input#totalAssetValue').value)
    fetch(`http://localhost:3000/finances`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: newAssetInput,
            description: 'asset',
            value: valueOfAsset
        }),
        })
        .then((res) => res.json())
        .then((assetObj) => {
            let div = document.createElement('div');
            div.className = 'card'
            div.innerHTML = `
            <h3>Name of Asset: </h3>
            <h1> ${assetObj.name} </h1>
            <h3>Value: </h3>
            <h1> ${assetObj.value} </h1>
            <button> X </button> 
            `
            div.querySelector('button').addEventListener('click', ()=> {    
                deleteObj(assetObj)
                div.innerHTML = ''
            });
            assetsSpan.append(div)
        });


})
