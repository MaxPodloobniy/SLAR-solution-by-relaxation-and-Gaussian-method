const path = require('path');
const url = require('url');
const { app, BrowserWindow } = require('electron');
let win;

function clearInputs() {
    document.getElementById("relax_input").value = "";
    document.getElementById("e_input").value = "";
    const rows = document.getElementById("row_input").value.toString();

    for(let i = 0; i < parseInt(rows); i++){
        for(let j = 0; j < parseInt(rows); j++){
            document.getElementById('a_' + i + '_' + j).value = "";
        }
        document.getElementById('b_' + i).value = "";
    }
}


function getValues(rows, variant){
    if (variant === 'a_list'){
        let a_list = [];
        for(let j = 0; j < rows; j++){
            a_list.push(new Array(rows).fill(0));
        }

        let errors = '';
        for(let i = 0; i < rows; i++){
            for(let j = 0; j < rows; j++){
                const temp_a = document.getElementById('a_' + i + '_' + j).value.toString();
                if (checkString(temp_a)){
                    a_list[i][j] = parseFloat(temp_a);
                } else {
                    errors +='Incorrect value of a in row ' + (i+1) + ' column ' + (j+1) + '\n';
                }
            }
        }
        if (errors !== ''){
            alert(errors);
        } else {
            return a_list;
        }
    } else if (variant === 'b_list'){
        let b_list = new Array(rows).fill(0);
        let errors = '';
        for(let i = 0; i < rows; i++){
            const temp = document.getElementById('b_' + i).value.toString();
            if (checkString(temp)){
                b_list[i] = parseFloat(temp);
            } else {
                errors +='Incorrect value of b in line ' + (i+1)+'\n';
            }
        }
        if (errors === ''){
            return b_list;
        } else{
            alert(errors);
        }
    } else if (variant === 'e'){
        return parseFloat(document.getElementById('e_input').value.toString());
    } else if (variant === 'w'){
        let relax = document.getElementById('relax_input').value.toString();
        if (checkString(relax)){
            relax = parseFloat(relax);
            if (relax <= 1 && relax >= 0){
                return relax;
            } else {
                alert('The relaxation parameter must be in the interval [0, 1]');
            }
        } else if (relax === 'w'){
            return 2/(1 + Math.sin(Math.PI*(1/(rows+1))));
        } else {
            alert('Incorrect relaxation parameter value');
        }
    }
}

function checkString(str) {
    const validChars = '0123456789.-';
    for (let i = 0; i < str.length; i++) {
        if (validChars.indexOf(str.charAt(i)) === -1) {
            return false;
        }
    }

    return str.length > 0;
}


function createWindow() {
    win = new BrowserWindow({
        width: 400,
        height: 400,
    });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, 'index.html'),
            protocol: 'file:',
            slashes: true,
        })
    );

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});
