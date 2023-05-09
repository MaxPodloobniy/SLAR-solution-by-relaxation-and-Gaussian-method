
function solveLinearEquations(A, b, relax, epsilon) {
    // initialize initial values
    const n = A.length;
    let prev = new Array(n).fill(0);
    let next = new Array(n).fill(0);
    let help_list = new Array(n).fill(0);
    let count = 0;

    while (true){
        let maximum = 0;
        let delta_list = []

        for (let i = 0; i < n; i++){
            let sum = 0;
            for (let j = 0; j < n; j++){
                if (i !== j){
                    sum += A[i][j]*help_list[j];
                }
            }
            next[i] = 1/A[i][i] * (b[i]-sum);

            // this is a feature of the Gauss-Seidel method that distinguishes it from the Jacobi method
            help_list[i] = next[i];
        }

        // this is a feature of the relaxation method
        for (let i = 0; i < n; i++){
            next[i] = relax * next[i] + (1 - relax) * prev[i];
            // fill the list for checking the exit condition
            delta_list.push(Math.abs(next[i] - prev[i]))
            prev[i] = next[i];
        }

        // find the maximum difference for checking the exit condition
        for (let i = 0; i < n; i++){
            if (maximum < delta_list[i]){
                maximum = delta_list[i];
            }
        }

        // check the exit condition, or if 1000 iterations have already passed, or the obtained result is accurate enough
        if (maximum < epsilon || count > 1000){
            break;
        }
        count += 1;
    }
    return next;
}


function matrixRank(matrix) {
    let rows = matrix.length;
    let cols = matrix[0].length;
    let rank = Math.min(rows, cols);

    for (let row = 0; row < rank; row++) {
        if (matrix[row][row] !== 0) {
            for (let col = 0; col < rows; col++) {
                if (col !== row) {
                    let multiplier = matrix[col][row] / matrix[row][row];
                    for (let i = row; i < cols; i++) {
                        matrix[col][i] -= multiplier * matrix[row][i];
                    }
                }
            }
        } else {
            let reduce = true;
            for (let i = row + 1; i < rows; i++) {
                if (matrix[i][row] !== 0) {
                    let temp = matrix[row];
                    matrix[row] = matrix[i];
                    matrix[i] = temp;
                    reduce = false;
                    break;
                }
            }
            if (reduce) {
                rank--;
                for (let i = 0; i < rows; i++) {
                    matrix[i][row] = matrix[i][rank];
                }
            }
            row--;
        }
    }
    return rank;
}


/**
 This function checks whether the coefficient matrix A obtained from a system of linear equations
 is suitable for solving by the relaxation method.
 It iterates over each row of the matrix, and for each row, calculates the sum of absolute values
 of its off-diagonal elements. If the sum is greater than the diagonal element, the function
 immediately returns false, indicating that the matrix does not satisfy the condition for convergence
 of the relaxation method.
 If the function completes the iteration without returning false, it means that the matrix satisfies
 the condition for convergence of the relaxation method, and the function returns true.
 @param {Array<Array<number>>} A - The coefficient matrix obtained from a system of linear equations
 @returns {boolean} - true if the matrix satisfies the condition for convergence of the relaxation method,
 false otherwise
 */
function check_A(A) {
    for (let i = 0; i < A.length; i++){
        let sum = 0;
        for (let j = 0; j < A.length; j++) {
            if (i !== j){
                sum += A[i][j];
            }
        }
        if (sum > A[i][i]){
            return false;
        }
    }
    return true;
}


/**
 Solves a system of linear equations using Gaussian elimination method
 @param {Array<Array<number>>} A - the coefficient matrix
 @param {Array<number>} b - the right-hand side vector
 @returns {Array<number>} - the solution vector
 */
function solveGaussianElimination(A, b) {
    // Get the dimension of matrix A
    const n = A.length;

    // Create a copy of matrix A and vector b
    const augmentedMatrix = [];
    for (let i = 0; i < n; i++) {
        augmentedMatrix.push([...A[i], b[i]]);
    }

    // Forward elimination step of Gaussian elimination method
    for (let i = 0; i < n; i++) {
        // Find the row with maximum element in the column
        let maxRow = i;
        for (let j = i + 1; j < n; j++) {
            if (Math.abs(augmentedMatrix[j][i]) > Math.abs(augmentedMatrix[maxRow][i])) {
                maxRow = j;
            }
        }

        // Swap the rows if necessary
        if (maxRow !== i) {
            [augmentedMatrix[i], augmentedMatrix[maxRow]] = [augmentedMatrix[maxRow], augmentedMatrix[i]];
        }

        // Eliminate the elements below the pivot
        for (let j = i + 1; j < n; j++) {
            const ratio = augmentedMatrix[j][i] / augmentedMatrix[i][i];
            for (let k = i; k < n + 1; k++) {
                augmentedMatrix[j][k] -= ratio * augmentedMatrix[i][k];
            }
        }
    }

    // Backward substitution step of Gaussian elimination method
    const x = new Array(n);
    for (let i = n - 1; i >= 0; i--) {
        let sum = 0;
        for (let j = i + 1; j < n; j++) {
            sum += augmentedMatrix[i][j] * x[j];
        }
        x[i] = (augmentedMatrix[i][n] - sum) / augmentedMatrix[i][i];
    }

    return x;
}

// Returns augment matrix
function augmentMatrix(A, b) {
    let n = A.length;
    let m = A[0].length;
    let result = [];

    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < m; j++) {
            row.push(A[i][j]);
        }
        row.push(b[i]);
        result.push(row);
    }
    return result;
}

// This function finds the best relaxation parameter based on the dimension of the coefficient matrix
 function find_Best_Relax(n){
    return 2/(1 + Math.sin(Math.PI*(1/(n+1))));
 }

 // This functioon can show if x results is correct
function check_Result(A, b, x){
    let results = '';
    for (let i = 0; i < A.length; i++){
        let sum = 0;
        for (let j = 0; j < A[i].length; j++){
            sum += A[i][j] * x[j];
        }
        results += 'In result b '+i+' = '+b[i]+' = '+sum +'\n';
    }
    return results;
}

let A = [];
let b = [];
let o = 0.2;
let eps = 0.0001;

for(let q = 0; q < 100; q++){
    let max_num = Math.floor(Math.random() * (7 - 3) + 3);
    A = [];
    b = [];
    for (let i = 0; i < max_num; i++){
        let temp_list = [];
        for (let j = 0; j < max_num; j++){
            temp_list.push(Math.random());
        }
        A.push(temp_list);
        b.push(Math.random());
        A[i][i] = Math.random() * (7 - 3) + 3;
    }
    console.log("Result with relaxation      "+solveLinearEquations(A, b, o, eps));
    console.log("Result with best 'w'        "+solveLinearEquations(A, b, find_Best_Relax(b.length), eps));
    console.log("Result with Gaussian method "+solveGaussianElimination(A, b));
    console.log("--------------------------------------------------------------------------------");
}

A = [[5, 3, 1], [1, 6, 2], [3, 2, 8]];
b = [5, 3, 2.1];
console.log("Result            "+solveLinearEquations(A, b, o, eps));
console.log("Result with Gauss "+solveGaussianElimination(A, b));
