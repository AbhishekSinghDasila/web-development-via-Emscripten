// The 'Module' object is created globally by the calc_module.js script
async function runCalculations() {
    const inputXElement = document.getElementById('input_x');
    const x = parseInt(inputXElement.value, 10);
    
    // Update display of input X
    document.getElementById('val_x').textContent = x;
    document.getElementById('result_y').textContent = 'Calculating...';
    document.getElementById('result_z').textContent = 'Waiting...';
    document.getElementById('final_value').textContent = '...';

    if (isNaN(x)) {
        alert("Please enter a valid number.");
        return;
    }

    // --- 1. CLIENT-SIDE EXECUTION (C code via WebAssembly) ---
    // The C function is exposed as Module._client_add_ten
    const intermediateY = Module._client_add_ten(x); 
    
    document.getElementById('result_y').textContent = `${x} + 10 = ${intermediateY}`;

    // --- 2. SEND TO SERVER ---
    try {
        const response = await fetch('/compute-result', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Send the result Y from the C code
            body: JSON.stringify({ intermediate_y: intermediateY }) 
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // --- 3. SERVER-SIDE RESULT ---
        // The server C code ran: G(y) = y * 2
        document.getElementById('result_z').textContent = `${intermediateY} x 2 = ${data.final_z}`;
        document.getElementById('final_value').textContent = data.final_z;

    } catch (error) {
        console.error("Communication or Server Error:", error);
        document.getElementById('result_z').textContent = `ERROR: ${error.message}`;
    }
}
