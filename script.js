
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


// Theme Toggle 
const sunSVG = `
<svg class="theme-icon sun" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.8" />
  <line x1="12" y1="1" x2="12" y2="4" stroke="currentColor" stroke-width="1.8" />
  <line x1="12" y1="20" x2="12" y2="23" stroke="currentColor" stroke-width="1.8" />
  <line x1="1" y1="12" x2="4" y2="12" stroke="currentColor" stroke-width="1.8" />
  <line x1="20" y1="12" x2="23" y2="12" stroke="currentColor" stroke-width="1.8" />
  <line x1="4.5" y1="4.5" x2="6.8" y2="6.8" stroke="currentColor" stroke-width="1.8" />
  <line x1="17.2" y1="17.2" x2="19.5" y2="19.5" stroke="currentColor" stroke-width="1.8" />
  <line x1="4.5" y1="19.5" x2="6.8" y2="17.2" stroke="currentColor" stroke-width="1.8" />
  <line x1="17.2" y1="6.8" x2="19.5" y2="4.5" stroke="currentColor" stroke-width="1.8" />
</svg>
`;

const moonSVG = `
<svg class="theme-icon moon" width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M21 12.5C20 17 15.5 20.5 11 20C6.5 19.5 3 15.5 3.5 11 C4 6.5 7.5 3 12 3.5 C9.5 5 8 8.5 9 12 C10 15.5 13.5 18 17 17 C18.5 16.7 20 15.8 21 14.5Z"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
`;

const html = document.documentElement;
const toggleBtn = document.querySelector('.theme-switch');

const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

if (prefersDarkScheme.matches) {
  html.setAttribute('data-theme', 'dark');
  toggleBtn.innerHTML = moonSVG;
} else {
  html.setAttribute('data-theme', 'light');
  toggleBtn.innerHTML = sunSVG;
}

toggleBtn.addEventListener("click", () => {
  const currentTheme = html.getAttribute("data-theme");

  if (currentTheme === "dark") {
    html.setAttribute("data-theme", "light");
    toggleBtn.innerHTML = sunSVG;
  } else {
    html.setAttribute("data-theme", "dark");
    toggleBtn.innerHTML = moonSVG;
  }
});


// Calculator Logic
let expression =[];
let currentValue = '';




const precedence ={
  '+': 1,
  '-': 1,
  '×': 2,
  '÷': 2,
  '%': 2,
};


function toPostFix(expr) {
  let output = [];
  let stack = [];
  
  for(let token of  expr){
    if (!isNaN(token)){
      output.push(token);
    } else{
      
      while(stack.length && precedence[stack[stack.length - 1]] >= precedence[token]) {
        output.push(stack.pop())
      }
      stack.push(token);
    }
  }
  while(stack.length){
    output.push(stack.pop());
  }
  return output;
}
 
function evaluatePostfix(postfix) {
  let stack = [];

  for (let token of postfix) {
    if (!isNaN(token)) {
      stack.push(Number(token));
    } else {
      let b = stack.pop();
      let a = stack.pop();

      if (token === '+') stack.push(a + b);
      if (token === '-') stack.push(a - b);
      if (token === '×') stack.push(a * b);
      if (token === '÷') stack.push(a / b);
      if (token === '%') stack.push(a % b);
    }
  }

  return stack[0];
}


const updateLivePreview = () => {
  if (expression.length === 0 || expression.length===1) {
    resultDisplay.innerText = '';
    return;
  }

  const lastItem = expression[expression.length - 1];


  if (isNaN(lastItem)) {
    resultDisplay.innerText = '';
    return;
  }

  const postfix = toPostFix(expression);
  const result = evaluatePostfix(postfix);

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

  const lastItem = expression[expression.length - 1];
  if (isNaN(lastItem)) return;

  const postfix = toPostFix(expression);
  const result = evaluatePostfix(postfix);

  previousOperand.innerText = result;
  currentOperand.innerText = '';
  resultDisplay.innerText = '';
  expression = [String(result)];
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