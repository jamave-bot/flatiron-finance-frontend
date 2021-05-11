const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');

function showFinances(){
    fetch('http://localhost:3000/finances')
        .then(res => res.json())
        .then((financeArr)=>{
            financeArr.forEach(financeObj => {
                if (financeObj.description === 'asset'){
                    let div = document.createElement('div');
                    div.innerHTML = `
                    <h3>Name of Asset: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1> ${financeObj.value} </h1>
                    `
                    assetsDiv.append(div)
                }
                else{
                    let div = document.createElement('div');
                    div.innerHTML = `
                    <h3>Name of Expense: </h3>
                    <h1> ${financeObj.name} </h1>
                    <h3>Value: </h3>
                    <h1> ${financeObj.value} </h1>
                    `
                    expensesDiv.append(div)
                }
            });
        })
}

showFinances();
