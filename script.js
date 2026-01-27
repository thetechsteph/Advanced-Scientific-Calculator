  
console.log('Calculator script loaded - A Working Basic Calculator(Phase 1)');  
  
const currentOperand = document.querySelector('.current-operand');  
const previousOperand = document.querySelector('.previous-operand');  
const resultDisplay = document.querySelector('.result-display');  
const currentOperator = document.querySelector('.current-operator');  
const buttons = document.querySelectorAll('.btn');  
const controlBtns = document.querySelectorAll('.control');  
const equalsBtn = document.querySelector('.equals')  
const operatorBtns = document.querySelectorAll('.operator');  
const numberBtns = document.querySelectorAll('.number');  
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
  
/*

if (prefersDarkScheme.matches) {  
  html.setAttribute('data-theme', 'dark');  
  toggleBtn.innerHTML = moonSVG;  
} else {  
  html.setAttribute('data-theme', 'light');  
  toggleBtn.innerHTML = sunSVG;  
} 
  
*/ 


// Functional Refactor: 
const applyTheme = (isDark) => {  
  html.setAttribute('data-theme', isDark ? 'dark' : 'light');
  toggleBtn.innerHTML = isDark ? moonSVG : sunSVG;
}

applyTheme(prefersDarkScheme.matches);
 
  
toggleBtn.addEventListener("click", () => {  
  const currentTheme = html.getAttribute("data-theme"); 

  const isDark = currentTheme === "dark"; 
   applyTheme(!isDark);
  // if (currentTheme === "dark") {  
  //   html.setAttribute("data-theme", "light");  
  //   toggleBtn.innerHTML = sunSVG;  
  // } else {  
  //   html.setAttribute("data-theme", "dark");  
  //   toggleBtn.innerHTML = moonSVG;  
  //}  
});  
  
  
  
// Calculator Logic  
let expression =[];  
let currentValue = '';  
  
  
  
  
const precedence = {  
  '+': 1,  
  '-': 1,  
  '×': 2,  
  '÷': 2, 
};  
  
  
// function toPostFix(expr) {  
//   let output = [];  
//   let stack = [];  
  
//   for (let token of expr) {  
  
//     if (!isNaN(token)) {  
//       output.push(token);  
//     }  
  
//     else {  
//       while (  
//         stack.length &&  
//         precedence[stack[stack.length - 1]] >= precedence[token]  
//       ) {  

//         output.push(stack.pop());  
//       }  
//       stack.push(token);  
//     }  
//   }  
  
//   while (stack.length) {  
//     output.push(stack.pop());  
//   }  
  
//   return output;  

// }  

const postFix = (expr, precedence) => {
  const { output, operatorStack } = expr.reduce(
    ({ output, operatorStack }, token) => {
      if (isNumeric(token)) {
        // Numbers go straight to output
        return { output: [...output, token], operatorStack };
      }
      if(!(token in precedence)) {
        throw new Error(`Unknown operator: ${token}`);
      }

      // Find the position where current operator should sit
      const lastLowerPrecedenceIndex = operatorStack.findLastIndex(
        op => precedence[op] < precedence[token]
      );

      // Operators after that index must be popped to output
      const newOutput = [...output, ...operatorStack.slice(lastLowerPrecedenceIndex + 1)];

      // Keep the operators up to that index and push current token
      const newStack = [...operatorStack.slice(0, lastLowerPrecedenceIndex + 1), token];

      return { output: newOutput, operatorStack: newStack };
    },
    { output: [], operatorStack: [] }
  );

  // Pop remaining operators in stack to output
  return [...output, ...operatorStack.reverse()];
}

const isNumeric = token => typeof token === 'string'  && /^-?\d+(\.\d+)?$/.test(token);
  
// function evaluatePostfix(postfix) {  
//   let stack = [];  
  
//   for (let token of postfix) {  
  
//     if (!isNaN(token)) {  
//       stack.push(Number(token));  
//     }  
  
//     else {  
//       let b = stack.pop();  
//       let a = stack.pop();  
  
//       if (token === '+') stack.push(a + b);  
//       if (token === '-') stack.push(a - b);  
//       if (token === '×') stack.push(a * b);  
//       if (token === '÷') stack.push(a / b); 
//     }  
//   }  
  
//   return stack[0];  
// }  

const evaluatePostfix = (postfix) => 
   postfix.reduce((stack, token) => {
    if (isNumeric(token)) {
      return [...stack, Number(token)];
    }

    let b = stack[stack.length - 1];
    let a = stack[stack.length - 2]; 
    let rest = stack.slice(0, -2);  

    switch (token) {
      case '+':
        return [...rest, (a + b)];
      case '-':
        return[...rest, (a - b)];
      case '×':
        return [...rest, (a * b)];
      case '÷':
        return [...rest, (a / b)];
      default:
        throw new Error(`Unknown operator: ${token}`);
    }
  }, [])[0]; 


//  is preview valid 
const isPreviewValid = (expr) => (expr.length >= 2 &&  isNumeric(expr.at(-1)))

// clear display screen 
const clearScreen = () => { 
   resultDisplay.innerText = '';
}


const updateLivePreview = () => {  
  // if (expression.length === 0 || expression.length===1) {  
  //   resultDisplay.innerText = '';  
  //   return;  
  // }  
  
  // const lastItem = expression[expression.length - 1];  
  
  
  // if (isNaN(lastItem)) {  
  //   resultDisplay.innerText = '';  
  //   return;  
  // }  

  if(!isPreviewValid(expression)) {
    clearScreen();
    return;
  }
 
  const postfix = postFix(expression, precedence);
  const result = evaluatePostfix(postfix);  
   
  // handled floating point precision issues
  resultDisplay.innerText = Number(result.toFixed(10));  
  
  // // const postfix = toPostFix(expression);  
  // const postfix = postFix(expression, precedence);
  // const result = evaluatePostfix(postfix);  
  // resultDisplay.innerText = result;  
}  

const lastItem = (arr) => arr.at(-1);
const secondLastItem = (arr) => arr.at(-2);

const appendDigit = (expr, digit) => {
  const prev = lastItem(expr);
  const prevPrev = secondLastItem(expr);

  if(prev === '-' && isNumeric(prevPrev)) {
    // start new number after subtraction operator
    return [...expr, digit];
  }
  if(prev === '-') {
    // negative sign for current number
    return [...expr.slice(0, -1), `${-digit}`];
  }

  // extend current number
  if(isNumeric(prev)) {
    return [...expr.slice(0, -1), prev + digit];
  }
  return [...expr, digit];
}

const appendDecimalPoint = (expr) => {
  const prev = lastItem(expr);
  if(!prev || !isNumeric(prev)) {
    return [...expr, '0.'];
  }
  if(prev.includes('.')) {
    return expr;
  }
  return [...expr.slice(0, -1), prev + '.'];
}



numberBtns.forEach(button => {
  button.addEventListener('click', () => {
    const buttonValue = button.innerText;
    // const lastItem = expression[expression.length - 1];

    //  const secondLastItem = expression[expression.length - 2];

    // // If last item is '-' AND there's a number before it, it's subtraction
    // if (lastItem === '-' && secondLastItem && !isNaN(secondLastItem)) {
    //   // Start a new number
    //   expression.push(buttonValue);
    // } 
    // // If last item is '-' with no number before it, it's a negative sign
    // else if (lastItem === '-') {
    //   expression[expression.length - 1] = '-' + buttonValue;
    // } 
    // // Continuing an existing number
    // else if (lastItem && !isNaN(lastItem)) {
    //   expression[expression.length - 1] = lastItem + buttonValue;
    // } 
    // // Starting a new number
    // else {
    //   expression.push(buttonValue);
    // }

  
    // if (buttonValue === '.' && (!lastItem || isNaN(lastItem))) {
    //   expression[expression.length - 1] = '0.'; 
    // }

    // if (buttonValue === '.' && lastItem && lastItem.includes('.')) {
    //   return;
    // }

    // currentValue = expression[expression.length - 1];
    expression = buttonValue === '.' ? appendDecimalPoint(expression) : appendDigit(expression, buttonValue);
    currentValue = lastItem(expression);
    previousOperand.innerText = expression.join(' ');
    updateLivePreview();
  });
});


const appendOperator = (expr, operator) => {
  const lastItem = expr.at(-1);

  // Handle negative sign
  if (operator === '-' && (!lastItem || !isNumeric(lastItem))) {
    if (lastItem === '-') return expr; // already a negative sign
    return [...expr, '-'];
  }

  // Handle percentage
  if (operator === '%') {
    if (!lastItem || !isNumeric(lastItem)) return expr; // nothing to convert
    return [...expr.slice(0, -1), String(Number(lastItem) / 100)];
  }

  // Ignore if no expression yet (except % handled above)
  if (expr.length === 0) return expr;

  // Replace last operator if last item is an operator
  if (lastItem && !isNumeric(lastItem)) {
    return [...expr.slice(0, -1), operator];
  }

  // Otherwise, append operator
  return [...expr, operator];
};

// Event listener
operatorBtns.forEach(button => {
  button.addEventListener('click', () => {
    const operator = button.innerText;

    expression = appendOperator(expression, operator);

    currentValue = '';
    previousOperand.innerText = expression.join(' ');
    updateLivePreview();
  });
});

// operatorBtns.forEach(button => {  
//   button.addEventListener('click', () => {  
//     const operator = button.innerText;  
//     const lastItem = expression[expression.length -1]  

//     if (operator === '-' && (!lastItem || isNaN(lastItem))) {
//       if (lastItem === '-') return;  
//       expression.push('-');
//       previousOperand.innerText = expression.join(' ');
//       return;
//     }

//     if (operator === '%') {
//       if (!lastItem || isNaN(lastItem)) return;
//        expression[expression.length - 1] = String(Number(lastItem) / 100);
 
//  updateLivePreview();
//  previousOperand.innerText = expression.join(' ');
//  return;
//     }
//     if(!expression.length && operator !== '%') return;;  
      
//     if(lastItem && isNaN(lastItem)){  
//       expression [expression.length -1] = operator;  
//     } else{  
//       expression.push(operator);  
//     }  
//     currentValue = '';  
//     updateLivePreview()  
//   previousOperand.innerText = expression.join(' ');  
//   })  
// })  
  
const computeResult = (expr) => {
  if (expr.length === 0) return expr;                  // empty expression
  const lastItem = expr.at(-1);
  if (!isNumeric(lastItem)) return expr;              // last item must be a number

  const postfix = postFix(expr, precedence);
  const result = evaluatePostfix(postfix);

  return [String(result)];                            // return new expression
};

equalsBtn.addEventListener('click', () => {
  const newExpression = computeResult(expression);

  if (newExpression === expression) return;           // no computation happened

  expression = newExpression;

  previousOperand.innerText = expression[0];         // show result
  currentOperand.innerText = '';
  resultDisplay.innerText = '';
});

  
// equalsBtn.addEventListener('click', () => {  
//   if (expression.length === 0) return;  
  
//   const lastItem = expression[expression.length - 1];  
//   if (isNaN(lastItem)) return;  
  
//   // const postfix = toPostFix(expression);  
//   const postfix = postFix(expression, precedence);
//   const result = evaluatePostfix(postfix);  
  
//   previousOperand.innerText = result;  
//   currentOperand.innerText = '';  
//   resultDisplay.innerText = '';  
//   expression = [String(result)];  
// });  
  
// controlBtns.forEach(button => {  
//   button.addEventListener('click', () => {  
//     let action = button.dataset.action;  
//     if(action ==='clear'){  
//       expression = []  
// currentValue = ''  
// previousOperand.innerText = ''  
// currentOperand.innerText = ''  
// resultDisplay.innerText = ''  
//     }   
//     if (action === 'delete') {  
  
//   if (currentValue !== '') {  
//     currentValue = currentValue.slice(0, -1);  
//     currentOperand.innerText = currentValue;  
  
    
//     expression[expression.length - 1] = currentValue;  
  
  
//     if (currentValue === '') {  
//       expression.pop();  
//     }  
//   }   
//   else if (expression.length > 0) {  
//     expression.pop();  
//   }  
  
//   previousOperand.innerText = expression.join(' ');  
// updateLivePreview()  
// }  
//   })  
// })
// Pure functions for control actions
const clearExpression = () => [];

const deleteLastInput = (expr, currentVal) => {
  if (currentVal !== '') {
    const newCurrent = currentVal.slice(0, -1);
    const newExpr = [...expr];
    if (newCurrent === '') {
      newExpr.pop();
    } else {
      newExpr[newExpr.length - 1] = newCurrent;
    }
    return { expr: newExpr, currentVal: newCurrent };
  }

  if (expr.length > 0) {
    return { expr: expr.slice(0, -1), currentVal: '' };
  }

  return { expr, currentVal };
};

// Event listener
controlBtns.forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.action;

    if (action === 'clear') {
      expression = clearExpression();
      currentValue = '';
      previousOperand.innerText = '';
      currentOperand.innerText = '';
      resultDisplay.innerText = '';
      return;
    }

    if (action === 'delete') {
      const result = deleteLastInput(expression, currentValue);
      expression = result.expr;
      currentValue = result.currentVal;

      currentOperand.innerText = currentValue;
      previousOperand.innerText = expression.join(' ');
      updateLivePreview();
    }
  });
});
