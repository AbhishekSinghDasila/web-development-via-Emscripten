const express = require('express');
const { exec } = require('child_process'); // Tool to run external programs
const path = require('path');
const app = express();
const port = 3000;

// Middleware to parse incoming JSON data (the intermediate result Y)
app.use(express.json()); 
// Serve the HTML, CSS, and Wasm files from the 'client' folder
app.use(express.static(path.join(__dirname, 'client'))); 

// This is the API endpoint the client calls.
app.post('/compute-final', (req, res) => {
    // 1. GET INPUT Y: Receive the value F(x) from the client's browser.
    const intermediate_y = req.body.intermediate_y; 
    
    // Check for valid input
    if (typeof intermediate_y !== 'number') {
        return res.status(400).json({ error: "Invalid intermediate value received." });
    }

    // 2. SERVER-SIDE EXECUTION: Define the command to run our C program
    const executable_path = path.join(__dirname, 'server', 'executor');
    // The command runs the C program, passing Y as a command line argument
    const command = `${executable_path} ${intermediate_y}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Execution Error: ${error}`);
            return res.status(500).json({ error: "Server failed to execute C code." });
        }
        
        // 3. GET OUTPUT Z: The stdout contains the result (Z) that the C program printed.
        const final_z = parseInt(stdout.trim(), 10);

        // 4. SEND BACK Z: Respond to the client with the final value.
        res.json({ 
            message: `Server calculated G(${intermediate_y})`,
            final_z: final_z 
        });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
