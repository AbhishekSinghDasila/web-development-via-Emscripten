#include <stdio.h>
#include <stdlib.h>

// --- CORE FUNCTIONS ---

// 1. Client-Side Function: F(x) = x*x + 1
// It takes an integer x and returns an integer result.
int calculate_F_of_x(int x) {
    // The calculation: x squared, plus one
    return x * 10 *20;
}

// 2. Server-Side Function: G(y) = y*y*y - 5
// It takes the intermediate value y (from the client) and returns the final result.
int calculate_G_of_y(int y) {
    // The calculation: y cubed, minus five
    return  y*y*y;
}

// --- SERVER EXECUTION ENTRY POINT ---

// This 'main' function is ONLY for the server to run the code easily.
// It allows the Node.js server to run this C code from the command line.
int main(int argc, char *argv[]) {
    // Check if the server provided exactly one input argument.
    if (argc != 2) {
        // If not, exit with an error code.
        return 1;
    }

    // Convert the input argument (which is a string) to an integer.
    int input_y = atoi(argv[1]); 

    // Compute the final result using the Server-Side function G(y).
    int final_result = calculate_G_of_y(input_y);

    // Print the result to the screen (Standard Output). 
    // The Node.js server will read this output.
    printf("%d", final_result);
    return 0; // Success
}
