(function () {

    let classX = 'X';
    let classO = 'O';
    let currentX;
    let createTableBtn = document.getElementById('btn-create');
    let emptyNumFieldsBtn = document.getElementById('btn-empty');
    let startGameBtn = document.getElementById('btn-start');
    let messageBox = document.getElementById("table msg-box-turn");
    let winnerMessageBox = document.getElementById("table msg-box-winner");
    let drawMessageBox = document.getElementById("table msg-box-draw");
    let tableDiv = document.getElementById("table-div");
    let playerXNameInput = document.getElementById('playerX-name');
    let playerONameInput = document.getElementById('playerO-name');
    let rowsInput = document.getElementById('rows');
    let colsInput = document.getElementById('cols');
    let playerXName;
    let playerOName; 
    let rows;
    let cols;
    let cellArray = [];
    let tableIsReady = false;
    let isWinning = false;

    function inputNames() {
        playerXName = playerXNameInput.value && playerXNameInput.value !== null? playerXNameInput.value : classX;
        playerOName = playerONameInput.value && playerONameInput.value !== null? playerONameInput.value : classO;
    }

    function emptyNumFields() {
        rowsInput.value = '';
        colsInput.value = '';
    }

    function readSizeInput() {
        rows = +rowsInput.value;
        cols = +colsInput.value;
    }

    function readNamesInput() {
        playerXName = playerXNameInput.value;
        playerOName = playerONameInput.value;

        inputNames();
    }

    function createTable() {
        tableIsReady ? deleteTable() : '';
        readSizeInput()

        rows = rows || 10;
        cols = cols || 10;
        let table = document.createElement("table");

        for (let i = 0; i < rows; i += 1) {
            let tr = table.insertRow();
            for (let j = 0; j < cols; j += 1) {
                let td = tr.insertCell();
            }
        }
        tableDiv.appendChild(table);
        tableIsReady = true;
    }

    function deleteTable() {
        clearMessages();
        clearInputsAfterEnd();

        tableDiv.innerHTML = null;
        tableIsReady = false;
    }

    function startGame() {
        clearMessages();

        playerXNameInput.disabled = true;
        playerONameInput.disabled = true;
        isWinning = false;
        cellArray = document.querySelectorAll("td");
        cellArray = Array.from(cellArray);

        cellArray.forEach((element) => {
            element.removeAttribute('class');
            element.textContent = '';
            element.removeEventListener('click', addMarkClickHandler)
            element.addEventListener("click", addMarkClickHandler, {
                once: true
            })
        })
        tableIsReady ? playersTurnMessage() : '';
    }

    function endGame(message) {
        message === 'X' || message === 'O' ?
            winnerMessageBox.innerHTML = `Player ${message === 'X' ? (playerXName ? playerXName : message ) : 
        (playerOName ? playerOName : message )}'s won!` :
            drawMessageBox.innerHTML = `${message}`;
    }

    function addMarkClickHandler(e) {
        let clickedCell = e.target;
        let currentClass = currentX ? classX : classO;

        markCell(clickedCell, currentClass);
        !isWinning ? (switchPlayers(), playersTurnMessage()) : (clearPlayersTurnMsgBox(), freezeBoardAfterWinning());
        
    }

    function markCell(clickedCell, currentClass) {
        clickedCell.innerHTML = currentClass;
        clickedCell.setAttribute('class', currentClass);

        checkRows(cols, currentClass);
        checkCols(cols, currentClass);
        checkDiagonalsRL(cols, currentClass);
        checkDiagonalsLR(cols, currentClass);
    }

    function checkRows(cols, currentClass) {
        cellArray = Array.from(cellArray)
        let marksArrayRows = [];

        for (let i = 0; i < cellArray.length; i += 1) {
            if (((cellArray[i].getAttribute('class') === currentClass &&
                    cellArray[i] !== (
                        (cellArray[cellArray.length - 1]) ||
                        (cellArray[cellArray.length - 2]) ||
                        (cellArray[cellArray.length - 3]) ||
                        (cellArray[cellArray.length - 4]))) && (i + 1) % cols !== 0) &&
                ((cellArray[i + 1].getAttribute('class') === currentClass) && (i + 1 + 1) % cols !== 0) &&
                ((cellArray[i + 2].getAttribute('class') === currentClass) && (i + 2 + 1) % cols !== 0) &&
                ((cellArray[i + 3].getAttribute('class') === currentClass) && (i + 3 + 1) % cols !== 0) &&
                ((cellArray[i + 4].getAttribute('class') === currentClass))) {

                marksArrayRows.push(
                    cellArray[i],
                    cellArray[i + 1],
                    cellArray[i + 2],
                    cellArray[i + 3],
                    cellArray[i + 4]);

                isWinning = true;

                endGame(currentClass);
            } else {
                checkIfDraws();
            }
        }
    }

    function checkCols(cols, currentClass) {
        cellArray = Array.from(cellArray);
        let marksArrayCols = [];

        for (let i = 0; i < cellArray.length; i += 1) {
            if (cellArray[i].getAttribute('class') === currentClass &&
                (i < cellArray.length - (1 + cols * 4) || i === cellArray.length - (1 + cols * 4)) &&
                (cellArray[i + cols].getAttribute('class') === currentClass) &&
                (cellArray[i + cols * 2].getAttribute('class') === currentClass) &&
                (cellArray[i + cols * 3].getAttribute('class') === currentClass) &&
                (cellArray[i + cols * 4].getAttribute('class') === currentClass)
            ) {
                marksArrayCols.push(
                    cellArray[i],
                    cellArray[i + cols],
                    cellArray[i + cols * 2],
                    cellArray[i + cols * 3],
                    cellArray[i + cols * 4]);

                isWinning = true;

                endGame(currentClass);
            } else {
                checkIfDraws();
            }
        }
    }

    function checkDiagonalsRL(cols, currentClass) {
        cellArray = Array.from(cellArray);
        let marksArrayDiagRL = [];

        for (let i = 5 - 1; i < cellArray.length; i += 1) {
            if (cellArray[i].getAttribute('class') === currentClass &&
                (i === cellArray.length - (1 + cols * 4) || (i < cellArray.length - (1 + cols * 4) && (i % cols) >= 4)) &&
                ((cellArray[i + cols - 1].getAttribute('class') === currentClass) && (i + cols - 1) % cols >= 3) &&
                ((cellArray[i + cols * 2 - 2].getAttribute('class') === currentClass) && (i + cols * 2 - 2) % cols >= 2) &&
                ((cellArray[i + cols * 3 - 3].getAttribute('class') === currentClass) && (i + cols * 3 - 3) % cols >= 1) &&
                ((cellArray[i + cols * 4 - 4].getAttribute('class') === currentClass) && (i + cols * 4 - 4) % cols >= 0)
            ) {
                marksArrayDiagRL.push(
                    cellArray[i],
                    cellArray[i + cols - 1],
                    cellArray[i + cols * 2 - 2],
                    cellArray[i + cols * 3 - 3],
                    cellArray[i + cols * 4 - 4])

                isWinning = true;

                endGame(currentClass);
            } else {
                checkIfDraws();
            }
        }
    }

    function checkDiagonalsLR(cols, currentClass) {
        cellArray = Array.from(cellArray);
        let marksArrayDiagLR = [];

        for (let i = 0; i < cellArray.length; i += 1) {
            if (cellArray[i].getAttribute('class') === currentClass &&
                (i === cellArray.length - (cols * 4 + 5) || (i < cellArray.length - (cols * 4 + 5) && (i % cols) <= cols - 5)) &&
                ((cellArray[i + cols + 1].getAttribute('class') === currentClass) && (i + cols + 1) % cols <= cols - 4) &&
                ((cellArray[i + cols * 2 + 2].getAttribute('class') === currentClass) && (i + cols * 2 + 2) % cols <= cols - 3) &&
                ((cellArray[i + cols * 3 + 3].getAttribute('class') === currentClass) && (i + cols * 3 + 3) % cols <= cols - 2) &&
                ((cellArray[i + cols * 4 + 4].getAttribute('class') === currentClass) && (i + cols * 4 + 4) % cols <= cols - 1)
            ) {
                marksArrayDiagLR.push(
                    cellArray[i],
                    cellArray[i + cols + 1],
                    cellArray[i + cols * 2 + 2],
                    cellArray[i + cols * 3 + 3],
                    cellArray[i + cols * 4 + 4])

                isWinning = true;

                endGame(currentClass);
            } else {
                checkIfDraws()
            }
        }
    }

    function checkIfDraws() {
        let resultIsDraw = cellArray.every(element => {
            return element.getAttribute('class') === 'X' || element.getAttribute('class') === 'O'
        });
        let drawMessage = 'Draw!'
        resultIsDraw ? endGame(drawMessage) : '';
    }

    function freezeBoardAfterWinning() {
        cellArray = Array.from(cellArray);
        cellArray.forEach(element => {
            element.removeEventListener('click', addMarkClickHandler)
        });
    }

    function switchPlayers() {
        currentX = !currentX;
    }

    function playersTurnMessage() {
        inputNames()
        currentX ? messageBox.innerHTML = `Player ${playerXName}'s turn` :
            messageBox.innerHTML = `Player ${playerOName}'s turn`;
    }

    function clearPlayersTurnMsgBox() {
            messageBox.innerHTML = '';
    }

    function clearMessages() {
        messageBox.innerHTML = '';
        winnerMessageBox.innerHTML = '';
        drawMessageBox.innerHTML = '';
    }

    function clearInputsAfterEnd() {
        playerXNameInput.disabled = false;
        playerONameInput.disabled = false;
        playerXNameInput.value = '';
        playerONameInput.value = '';
    }

    window.addEventListener('load', () => {
        rowsInput.addEventListener('input', readSizeInput);
        colsInput.addEventListener('input', readSizeInput);
        emptyNumFieldsBtn.addEventListener('click', emptyNumFields);
        createTableBtn.addEventListener('click', createTable);
        playerXNameInput.addEventListener('input', readNamesInput);
        playerONameInput.addEventListener('input', readNamesInput);
        startGameBtn.addEventListener('click', startGame);
    })

})();