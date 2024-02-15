// Get the display element where the result/current input will be shown
const displayValue = document.getElementById('display-value');

// Initialize variables for the calculator's state
let currentInput = ""; // Stores the current input value
let operationQueue = ""; // Stores the operation and previous input to perform calculation
let operationPending = false; // Flags if there is an unfinished operation
let resultDisplayed = false; // Flags if the current display is showing a result

// Resets the calculator to its initial state
const resetCalculator = () => {
    currentInput = "";
    operationQueue = "";
    operationPending = false;
    resultDisplayed = false;
    updateDisplay("0"); // Reset display to 0
    removePressedEffect(); // Remove any active effects on operator buttons
};

// Updates the calculator's display with the given text
const updateDisplay = (text) => {
    displayValue.innerText = text;
};

// Performs the queued operation and updates the display with the result
const performOperation = () => {
    if (operationQueue && currentInput) {
        // Handle division by zero; display error and reset relevant states
        if (operationQueue.endsWith('/') && currentInput === "0") {
            updateDisplay("Error");
            currentInput = "";
            operationQueue = "";
            operationPending = false;
            return; // Exit to prevent further execution
        }

        // Calculate the result of the current operation
        const operationExpression = operationQueue + currentInput;
        const result = eval(operationExpression); // Evaluate the expression
        currentInput = result.toString(); // Convert result back to string for display
        updateDisplay(currentInput); // Update display with result
        operationQueue = ""; // Clear the operation queue
        resultDisplayed = true; // Flag that a result is now displayed
    }
};

// Adds a pressed effect to the button to indicate it's active
const addPressedEffect = (btn) => {
    removePressedEffect(); // Remove any existing effects first
    btn.classList.add('active'); // Add 'active' class to highlight the button
};

// Removes the pressed effect from all operator buttons
const removePressedEffect = () => {
    document.querySelectorAll('.operator-btns').forEach(opBtn => {
        opBtn.classList.remove('active'); // Remove 'active' class
    });
};

// Add event listeners to operator buttons for pressed effect
document.querySelectorAll('.operator-btns').forEach(opBtn => {
    opBtn.addEventListener('click', function() {
        addPressedEffect(this); // Add pressed effect when an operator button is clicked
    });
});

// Toggle negative sign for the current input when the "add-sign" button is clicked
document.getElementById('add-sign').addEventListener('click', function() {
    if (currentInput.startsWith('-')) {
        currentInput = currentInput.substring(1); // Remove negative sign if present
    } else if (currentInput !== "" && currentInput !== "0") {
        currentInput = '-' + currentInput; // Add negative sign if not present
    }
    updateDisplay(currentInput); // Update display with the new value
});

// Convert current input to a percentage when the "percent-btn" is clicked
document.getElementById('percent-btn').addEventListener('click', function() {
    if (currentInput !== "") {
        const percentageValue = Number(currentInput) / 100; // Calculate percentage
        currentInput = percentageValue.toString(); // Convert to string for display
        updateDisplay(currentInput); // Update display with percentage value
    }
});

// Add event listeners to all buttons for handling input
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const value = this.value;
        if (!isNaN(value)) { // Number button pressed
            if (operationPending || resultDisplayed) {
                currentInput = value; // Start new input
                operationPending = false;
                resultDisplayed = false;
            } else {
                currentInput += value; // Append to existing input
            }
            updateDisplay(currentInput); // Update display
            removePressedEffect(); // Manage pressed effect
        } else if (value === '.') { // Decimal point
            if (!currentInput.includes('.') || operationPending || resultDisplayed) {
                if (operationPending || resultDisplayed) {
                    currentInput = "0."; // Start new input with decimal
                    operationPending = false;
                    resultDisplayed = false;
                } else {
                    currentInput += '.'; // Append decimal to existing input
                }
                updateDisplay(currentInput); // Update display
            }
        } else if (value === 'AC') { // Reset button
            resetCalculator(); // Reset calculator state
        } else if (value === '=') { // Equals button
            performOperation(); // Perform queued operation
            operationPending = false;
        } else if (['+', '-', '*', '/'].includes(value)) { // Operator button
            if (currentInput !== "" && operationQueue !== "") {
                performOperation(); // Perform existing operation
            }

            if (currentInput === "" && operationQueue === "") {
                currentInput = "0"; // Default to zero if no input
            }

            operationQueue = currentInput + value; // Queue new operation
            operationPending = true; // Flag operation as pending
            currentInput = ""; // Clear current input for next number
            resultDisplayed = false; // Reset result display flag
        }
    });
});
