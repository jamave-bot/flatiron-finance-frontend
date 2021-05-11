const nameDiv = document.getElementById('name');
const expensesDiv = document.getElementById('expenses');
const assetsDiv = document.getElementById('assets');
const totalDiv = document.getElementById('total');
const expensesForm = document.getElementById('expenses-form'); 
const assetsForm = document.getElementById('assets-form');



let newAssetInput = document.querySelector('input#assetsName')
let valueOfAsset = docuemnt.querySelector('inout#totalAssetValue')

assetsForm.addEventListener('submit', (evt) => {
evt.preventDefault
let newAssetInput = newAssetInput.value
let valueOfAsset = valueOfAsset.value

fetch(`http://localhost:3000//${evt.target.dataset.id}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
      asset: newAssetInput
      value: valueOfAsset
  }),
})
  .then((res) => r.json())
  .then(res => {

  });


})
