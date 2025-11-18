const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json()); 

// FIX: Explicitly serve the client files for the root path (/)
app.use(express.static(path.join(__dirname, 'client'))); 

// API endpoint to handle the client's POST request
app.post('/compute-result', (req, res) => {
    const intermediate_y = req.body.intermediate_y; 
    
    if (typeof intermediate_y !== 'number') {
        return res.status(400).json({ error: "Invalid input received." });
    }

    // Path to the compiled C program
    const executable_path = path.join(__dirname, 'server_executor');
    
    // Command to run the C program, passing Y as an argument
    const command = `${executable_path} ${intermediate_y}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Exec Error: ${error}`);
            return res.status(500).json({ error: "Server execution failed." });
        }
        
        // Capture the result Z printed by the C program
        const final_z = parseInt(stdout.trim(), 10);

        res.json({ 
            final_z: final_z
        });
    });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
