// We wrap the function in an async function to use 'await' for the server call
async function startExecution() {
    const input_element = document.getElementById('input_x');
    const x = parseInt(input_element.value, 10);

    if (isNaN(x)) {
        alert("Please enter a valid number for X.");
        return;
    }

    // Reset output fields
    document.getElementById('client_step').textContent = 'Calculating...';
    document.getElementById('server_step').textContent = 'Waiting...';

    // --- 1. CLIENT-SIDE EXECUTION (using WebAssembly) ---
    // Module is the global object created by module.js, and _calculate_F_of_x is our C function.
    const intermediate_y = Module._calculate_F_of_x(x); 
    
    document.getElementById('client_step').textContent = `F(${x}) = ${intermediate_y}. Sending to server...`;
    
    // --- 2. SEND TO SERVER (API Call) ---
    try {
        const response = await fetch('/compute-final', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Send the intermediate result Y in the request body
            body: JSON.stringify({ intermediate_y: intermediate_y }) 
        });

        if (!response.ok) {
            throw new Error(`HTTP Error! Status: ${response.status}`);
        }

        const data = await response.json();

        // --- 3. SERVER-SIDE RESULT ---
        // Display the final result Z returned by the server
        document.getElementById('server_step').textContent = `${data.message} = ${data.final_z}. Final answer!`;

    } catch (error) {
        console.error("Communication or Server Error:", error);
        document.getElementById('server_step').textContent = `ERROR: ${error.message}`;
    }
}
