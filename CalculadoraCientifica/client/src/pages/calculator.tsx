import { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { evaluate, format } from 'mathjs';

interface CalculatorState {
  expression: string;
  result: string;
  memory: number;
  hasError: boolean;
}

export default function Calculator() {
  const [state, setState] = useState<CalculatorState>({
    expression: '',
    result: '0',
    memory: 0,
    hasError: false,
  });

  const formatResult = (value: number): string => {
    if (!isFinite(value)) return 'Error';
    
    // Handle very large or very small numbers
    if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
      return value.toExponential(6);
    }
    
    // Format with appropriate precision
    const formatted = format(value, { precision: 10 });
    return formatted;
  };

  const calculateResult = useCallback((expr: string): string => {
    if (!expr.trim()) return '0';
    
    try {
      // Replace display symbols with math.js compatible ones
      let mathExpr = expr
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/−/g, '-')
        .replace(/π/g, 'pi')
        .replace(/e/g, 'e')
        .replace(/√/g, 'sqrt')
        .replace(/x²/g, '^2')
        .replace(/x\^y/g, '^');

      // Handle scientific functions
      mathExpr = mathExpr
        .replace(/sin/g, 'sin')
        .replace(/cos/g, 'cos')
        .replace(/tan/g, 'tan')
        .replace(/ln/g, 'log')
        .replace(/log/g, 'log10');

      const result = evaluate(mathExpr);
      return formatResult(result);
    } catch (error) {
      return 'Error';
    }
  }, []);

  const updateExpression = (newExpr: string) => {
    const result = calculateResult(newExpr);
    setState(prev => ({
      ...prev,
      expression: newExpr,
      result,
      hasError: result === 'Error'
    }));
  };

  const handleNumber = (num: string) => {
    updateExpression(state.expression + num);
  };

  const handleOperator = (op: string) => {
    const lastChar = state.expression.slice(-1);
    
    // Prevent consecutive operators
    if (['+', '−', '×', '÷'].includes(lastChar) && ['+', '−', '×', '÷'].includes(op)) {
      updateExpression(state.expression.slice(0, -1) + op);
    } else {
      updateExpression(state.expression + op);
    }
  };

  const handleScientificFunction = (func: string) => {
    const needsParentheses = ['sin', 'cos', 'tan', 'ln', 'log', '√'];
    
    if (func === 'x²') {
      updateExpression(state.expression + '^2');
    } else if (func === 'x^y') {
      updateExpression(state.expression + '^');
    } else if (needsParentheses.includes(func)) {
      updateExpression(state.expression + func + '(');
    } else {
      updateExpression(state.expression + func);
    }
  };

  const handleParenthesis = (paren: string) => {
    updateExpression(state.expression + paren);
  };

  const handleDecimal = () => {
    const parts = state.expression.split(/[+\−×÷]/);
    const lastPart = parts[parts.length - 1];
    
    if (!lastPart.includes('.')) {
      updateExpression(state.expression + '.');
    }
  };

  const handleBackspace = () => {
    const newExpr = state.expression.slice(0, -1);
    updateExpression(newExpr);
  };

  const handleClearAll = () => {
    setState(prev => ({
      ...prev,
      expression: '',
      result: '0',
      hasError: false
    }));
  };

  const handleCalculate = () => {
    if (state.hasError) return;
    
    const result = calculateResult(state.expression);
    setState(prev => ({
      ...prev,
      expression: result === 'Error' ? prev.expression : result,
      result,
      hasError: result === 'Error'
    }));
  };

  const handleMemoryFunction = (func: string) => {
    const currentResult = parseFloat(state.result);
    
    switch (func) {
      case 'MC':
        setState(prev => ({ ...prev, memory: 0 }));
        break;
      case 'MR':
        updateExpression(state.expression + state.memory.toString());
        break;
      case 'M+':
        if (!isNaN(currentResult)) {
          setState(prev => ({ ...prev, memory: prev.memory + currentResult }));
        }
        break;
      case 'M-':
        if (!isNaN(currentResult)) {
          setState(prev => ({ ...prev, memory: prev.memory - currentResult }));
        }
        break;
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      
      // Prevent default for calculator keys
      if (/[0-9+\-*/=().c]/.test(key) || key === 'Enter' || key === 'Backspace' || key === 'Escape') {
        event.preventDefault();
      }

      if (/[0-9]/.test(key)) {
        handleNumber(key);
      } else if (key === '+') {
        handleOperator('+');
      } else if (key === '-') {
        handleOperator('−');
      } else if (key === '*') {
        handleOperator('×');
      } else if (key === '/') {
        handleOperator('÷');
      } else if (key === '.') {
        handleDecimal();
      } else if (key === '(' || key === ')') {
        handleParenthesis(key);
      } else if (key === 'Enter' || key === '=') {
        handleCalculate();
      } else if (key === 'Backspace') {
        handleBackspace();
      } else if (key === 'Escape' || key.toLowerCase() === 'c') {
        handleClearAll();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="bg-card rounded-xl shadow-lg border border-border overflow-hidden">
          
          {/* Display */}
          <div className="bg-muted p-6 border-b border-border">
            <div className="text-right">
              <div 
                className="text-muted-foreground text-sm font-mono mb-1 min-h-[20px] break-all"
                data-testid="display-expression"
              >
                {state.expression || '\u00A0'}
              </div>
              <div 
                className={`text-3xl font-mono font-semibold ${state.hasError ? 'text-destructive' : 'text-foreground'}`}
                data-testid="display-result"
              >
                {state.result}
              </div>
            </div>
          </div>

          <div className="p-4">
            
            {/* Memory and Clear Functions Row */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleMemoryFunction('MC')}
                data-testid="button-memory-clear"
              >
                MC
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleMemoryFunction('MR')}
                data-testid="button-memory-recall"
              >
                MR
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleMemoryFunction('M+')}
                data-testid="button-memory-add"
              >
                M+
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleMemoryFunction('M-')}
                data-testid="button-memory-subtract"
              >
                M-
              </Button>
              
              <Button
                variant="destructive"
                size="sm"
                className="py-3 px-2 text-sm bg-destructive/10 hover:bg-destructive/20 text-destructive"
                onClick={handleClearAll}
                data-testid="button-clear-all"
              >
                AC
              </Button>
            </div>

            {/* Scientific Functions Row 1 */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('sin')}
                data-testid="button-sin"
              >
                sin
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('cos')}
                data-testid="button-cos"
              >
                cos
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('tan')}
                data-testid="button-tan"
              >
                tan
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('ln')}
                data-testid="button-ln"
              >
                ln
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('log')}
                data-testid="button-log"
              >
                log
              </Button>
            </div>

            {/* Scientific Functions Row 2 */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('√')}
                data-testid="button-sqrt"
              >
                √
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('x²')}
                data-testid="button-square"
              >
                x²
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleScientificFunction('x^y')}
                data-testid="button-power"
              >
                x^y
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleParenthesis('(')}
                data-testid="button-open-paren"
              >
                (
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                className="py-3 px-2 text-sm"
                onClick={() => handleParenthesis(')')}
                data-testid="button-close-paren"
              >
                )
              </Button>
            </div>

            {/* Numbers and Operations */}
            <div className="grid grid-cols-4 gap-2">
              
              {/* Row 1: 7, 8, 9, / */}
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('7')}
                data-testid="button-7"
              >
                7
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('8')}
                data-testid="button-8"
              >
                8
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('9')}
                data-testid="button-9"
              >
                9
              </Button>
              
              <Button
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleOperator('÷')}
                data-testid="button-divide"
              >
                ÷
              </Button>

              {/* Row 2: 4, 5, 6, * */}
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('4')}
                data-testid="button-4"
              >
                4
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('5')}
                data-testid="button-5"
              >
                5
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('6')}
                data-testid="button-6"
              >
                6
              </Button>
              
              <Button
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleOperator('×')}
                data-testid="button-multiply"
              >
                ×
              </Button>

              {/* Row 3: 1, 2, 3, - */}
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('1')}
                data-testid="button-1"
              >
                1
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('2')}
                data-testid="button-2"
              >
                2
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('3')}
                data-testid="button-3"
              >
                3
              </Button>
              
              <Button
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleOperator('−')}
                data-testid="button-subtract"
              >
                −
              </Button>

              {/* Row 4: 0, ., backspace, + */}
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleNumber('0')}
                data-testid="button-0"
              >
                0
              </Button>
              
              <Button
                variant="outline"
                className="py-4 px-4 text-lg font-medium"
                onClick={handleDecimal}
                data-testid="button-decimal"
              >
                .
              </Button>
              
              <Button
                variant="secondary"
                className="py-4 px-4 text-lg font-medium"
                onClick={handleBackspace}
                data-testid="button-backspace"
              >
                ⌫
              </Button>
              
              <Button
                className="py-4 px-4 text-lg font-medium"
                onClick={() => handleOperator('+')}
                data-testid="button-add"
              >
                +
              </Button>

              {/* Row 5: Equals button spanning 4 columns */}
              <Button
                className="py-4 px-4 text-lg font-semibold col-span-4"
                onClick={handleCalculate}
                data-testid="button-equals"
              >
                =
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer Info */}
        <div className="text-center mt-6 text-muted-foreground text-sm">
          <p>Scientific Calculator - Minimalist Design</p>
          <p className="mt-1 text-xs">Supports keyboard input and complex mathematical expressions</p>
          {state.memory !== 0 && (
            <p className="mt-1 text-xs text-primary">Memory: {formatResult(state.memory)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
