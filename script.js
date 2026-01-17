console.log('Calculator script loaded')

const currentOperand = document.querySelector('.current-operand');
const previousOperand = document.querySelector('.previous-operand');
const resultDisplay = document.querySelector('.result-display');
const currentOperator = document.querySelector('.current-operator');
const buttons = document.querySelectorAll('.btn');
const controlBtns = document.querySelectorAll('.control');
const operatorBtns = document.querySelectorAll('.operator');
const numberBtns = document.querySelectorAll('.number');
const equalsBtn = document.querySelector('.equals');

let expression =[];
let currentValue = '';

const updateLivePreview = () => {
  
  if(expression.length === 0 || expression.length===1){
    resultDisplay.innerText = '';
    return
  }
  const lastItem = expression[expression.length - 1]
  if(isNaN(lastItem) ){
    resultDisplay.innerText =''
    return 
  }
  let result = expression.reduce((acc, item, index) => {
    if(index === 0) return Number(item);
    
    const operator = expression[index - 1];
    
    const number = Number(item);
    
    if (operator === '+') {
      return acc + number;
    }
    if (operator === '-') {
      return acc - number;
    }
    if (operator === '÷') {
  return acc / number;
   }
  if (operator === '×') {
    return acc * number;
  }
  if(operator === '%'){
    return acc % number;
  }
  
  return acc
  });
  resultDisplay.innerText = result;
}



numberBtns.forEach(button => {
  button.addEventListener('click', ()=> {
    const buttonValue = button.innerText;
    const lastItem = expression[expression.length -1];
    
    if (buttonValue === '.' && (!lastItem || isNaN(lastItem))) {
      expression.push('0.');
      currentValue= '0.'
      updateLivePreview()
      
      previousOperand.innerText = expression.join(' ');
      return;
    }
    
    if (buttonValue === '.' && lastItem && lastItem.includes('.')) {
      return;
    }
    
    if (lastItem && !isNaN(lastItem)) {
      expression[expression.length - 1] = lastItem + buttonValue
    }else {
      expression.push(buttonValue);
    }
    
    currentValue = expression[expression.length - 1];
    updateLivePreview()
    
    previousOperand.innerText = expression.join(' ');
  })
})

operatorBtns.forEach(button => {
  button.addEventListener('click', () => {
    const operator = button.innerText;
    const lastItem = expression[expression.length -1]
    if(!expression.length) return;
    
    if(lastItem && isNaN(lastItem)){
      expression [expression.length -1] = operator;
    } else{
      expression.push(operator);
    }
    currentValue = '';
    updateLivePreview()
  previousOperand.innerText = expression.join(' ');
  })
})


equalsBtn.addEventListener('click', () => {
  
  if (expression.length === 0) return;
  
  const lastItem = expression[expression.length -1]
 if(isNaN(lastItem))return;
  
  let result = expression.reduce((acc, item, index) => {
    if(index === 0) return Number(item);
    
    const operator = expression[index - 1];
    
    const number = Number(item);
    
    if (operator === '+') {
      return acc + number;
    }
    if (operator === '-') {
      return acc - number;
    }
    if (operator === '÷') {
  return acc / number;
   }
  if (operator === '×') {
    return acc * number;
  }
  if(operator === '%'){
    return acc % number;
  }
  
  return acc
  });
  
  previousOperand.innerText = result;
  currentOperand.innerText =''
  resultDisplay.innerText = ''
  
  expression =[String(result)];
  
});

controlBtns.forEach(button => {
  button.addEventListener('click', () => {
    let action = button.dataset.action;
    if(action ==='clear'){
      expression = []
currentValue = ''
previousOperand.innerText = ''
currentOperand.innerText = ''
resultDisplay.innerText = ''
    } 
    if (action === 'delete') {

  if (currentValue !== '') {
    currentValue = currentValue.slice(0, -1);
    currentOperand.innerText = currentValue;

  
    expression[expression.length - 1] = currentValue;


    if (currentValue === '') {
      expression.pop();
    }
  } 
  else if (expression.length > 0) {
    expression.pop();
  }

  previousOperand.innerText = expression.join(' ');
updateLivePreview()
}
  })
})