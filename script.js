console.log('Calculator script loaded')

const currentOperand = document.querySelector('.current-operand');
const previousOperand = document.querySelector('.previous-operand');
const resultDisplay = document.querySelector('.result-display');
const currentOperator = document.querySelector('.current-operator');
const buttons = document.querySelectorAll('.btn');
const controlBtns = document.querySelectorAll('.control');
const operatorBtns = document.querySelectorAll('.operator');
const numberBtns = document.querySelectorAll('.number');
const equalsBtn = document.querySelector('.equals')

let currentValue ='';
let previousValue = '';
let currentOperatorValue =null;

let shouldResetDisplay = false;

let numbers = [];
let operators =[];
    

const updateLivePreview = ()=> {
  if (currentValue===''|| previousValue === ''|| currentOperatorValue===null){
    resultDisplay.innerText ='';
    return;
  }
  let result;
  
  const prev=
  parseFloat(previousValue);
  const curr = parseFloat(currentValue);
  
  switch(currentOperatorValue){
    case '+':
      result = prev + curr;
      break;
    case '-':
      result = prev - curr;
      break;
    case '÷':
      result = curr === 0? 'Error': prev/curr;
      break;
    case '×':
      result = prev * curr;
      break;
    case'%':
      result = prev% curr;
      break;
    default:
    return;
  }
  resultDisplay.innerText = result
}


  

numberBtns.forEach((button)=>{
  button.addEventListener('click', () => {
    const btnValue =button.innerText;
    if (shouldResetDisplay) {
      currentOperand.innerText=btnValue
      shouldResetDisplay=false
      updateLivePreview()
      return
    }

  if (btnValue=== '.') {
    if(!currentOperand.innerText.includes('.')){
      currentOperand.innerText+='.';
    }
    return
  }
  
  if (currentOperand.innerText ==='0') {
    currentOperand.innerText = btnValue;

  } else{
    currentOperand.innerText += btnValue
    
  }
  currentValue = currentOperand.innerText;
  updateLivePreview()
})
})

operatorBtns.forEach((button) => {
  button.addEventListener('click', () => {
if(currentOperand.textContent=== ''){
  
  currentOperator.innerText= button.innerText
  currentOperand.innerText =''
  currentOperatorValue = currentOperator.innerText
  return
} else{
  
  previousOperand.innerText = currentOperand.innerText
  previousValue = previousOperand.innerText
  
  currentOperator.innerText= button.innerText
  currentOperand.innerText =''
  currentOperatorValue = currentOperator.innerText
  
}

  })
  updateLivePreview()
})


equalsBtn.addEventListener('click', ()=> {
  
  currentValue = currentOperand.innerText
  
  if (previousValue === ''||  currentOperatorValue === ''||  currentValue=== ''){ 
   return
    
  } ;
  
  
  let firstNumber = parseFloat(previousValue);
  let secondNumber = parseFloat(currentValue)
  let result;
  switch(currentOperatorValue){
    case '+':
      result = firstNumber + secondNumber;
      break;
    case '-':
      result = firstNumber - secondNumber;
      break;
    case '×':
      result = firstNumber * secondNumber;
      break;
    case '÷':
      result = secondNumber === 0 ? 'Error': firstNumber/secondNumber;
      break;
    case '%':
      result = firstNumber % secondNumber;
      break;
  }
  
  if(isNaN(result)){
    currentOperand.innerText='0'
  }
 shouldResetDisplay =true;
  currentOperand.innerText = result;
  
  previousOperand.innerText = '';
  currentOperator.innerText = '';
  currentOperatorValue = null;
  previousValue = '';

})


controlBtns.forEach((button) => {
   button.addEventListener('click', () => {

     if(button.dataset.action ==='clear'){
       currentOperand.innerText ='0';
       previousOperand.innerText='';
       currentOperator.innerText='';
       currentValue='';
       previousValue =''
       currentOperatorValue =null;
       updateLivePreview()
     } else if (button.dataset.action=== 'delete') {
         if  (currentOperand.innerText!==''){
           currentOperand.innerText = currentOperand.innerText.slice(0, -1);
           
         } else if(currentOperator.innerText !==''){
           currentOperator.innerText = '';
           currentOperatorValue = null
      
           } else if (previousOperand !=='') {
           previousOperand.innerText = previousOperand.innerText.slice(0, -1) || '0'
         }
         else{
           return
         }
         
         
     }
     updateLivePreview()
   })
})


