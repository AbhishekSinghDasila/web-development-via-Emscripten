#include <stdio.h>
#include <stdlib.h>

// 1. Client-Side Function: F(x) = x + 10
int client_add_ten(int x) {
    return x + 10;
}

// 2. Server-Side Function: G(y) = y * 2
int server_multiply_two(int y) {
    return y * 2;
}

// 3. Server Execution Entry Point
// This is compiled into a native executable for the Node.js server to run.
int main(int argc, char *argv[]) {
    if (argc != 2) {
        // Expects one argument (the intermediate value Y)
        return 1;
    }

    int input_y = atoi(argv[1]); 

    // Server executes G(y)
    int final_result = server_multiply_two(input_y);

    // Print the final result Z for the server to capture
    printf("%d", final_result);
    return 0;
}
