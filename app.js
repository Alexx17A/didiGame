const gameArea = document.getElementById('game-area');
const player = document.querySelector('#player');
const didi = document.querySelectorAll('#didi')[0];

let playerSpeed = 2;  
let DidiSpeed = 1;

let playerPosition = { x: 0, y: 0 };
let DidiPosition = { x: 300, y: 300 };

let gameConfig = {
    difficulty: 'medium',
    backgroundColor: '#f0f0f0',
    darkMode: false,
    characterSize: 50,
};

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
};

let isPaused = false;
let startTime = null;
let timerInterval = null;
let bestRecord = localStorage.getItem('bestRecord') || 0;

function detectCollision() {
    const deltaX = Math.abs(playerPosition.x - DidiPosition.x);
    const deltaY = Math.abs(playerPosition.y - DidiPosition.y);

    if (deltaX <= gameConfig.characterSize && deltaY <= gameConfig.characterSize) {
        clearInterval(timerInterval);
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime > bestRecord) {
            bestRecord = elapsedTime;
            localStorage.setItem('bestRecord', bestRecord);
        }

        const result = confirm('¡VE A LA FIESTA DE DIDI PARA QUE TE PERDONE! ¿Quieres volver a empezar?');
        if (result) {
            resetGame();
        } else {
            alert('¡Perdiste!');
        }
    }
}

function gameLoop() {
    if (!isPaused) {
        movePlayer();
        moveDidi();
        updatePosition();
        detectCollision();
    }
    requestAnimationFrame(gameLoop);
}

function moveDidi() {
    if (DidiPosition.x < playerPosition.x)
        DidiPosition.x += DidiSpeed;
    else if (DidiPosition.x > playerPosition.x)
        DidiPosition.x -= DidiSpeed;

    if (DidiPosition.y < playerPosition.y)
        DidiPosition.y += DidiSpeed;
    else if (DidiPosition.y > playerPosition.y)
        DidiPosition.y -= DidiSpeed;
}

function movePlayer() {
    if (keys.ArrowUp && playerPosition.y > 0) {
        playerPosition.y -= playerSpeed;
    }
    if (keys.ArrowDown && playerPosition.y < gameArea.clientHeight - gameConfig.characterSize) {
        playerPosition.y += playerSpeed;
    }
    if (keys.ArrowLeft && playerPosition.x > 0) {
        playerPosition.x -= playerSpeed;
    }
    if (keys.ArrowRight && playerPosition.x < gameArea.clientWidth - gameConfig.characterSize) {
        playerPosition.x += playerSpeed;
    }
}

function updatePosition() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    player.style.width = `${gameConfig.characterSize}px`;
    player.style.height = `${gameConfig.characterSize}px`;

    didi.style.transform = `translate(${DidiPosition.x}px, ${DidiPosition.y}px)`;
    didi.style.width = `${gameConfig.characterSize}px`;
    didi.style.height = `${gameConfig.characterSize}px`;

    gameArea.style.backgroundColor = gameConfig.backgroundColor;
}

function updateTimerDisplay() {
    const elapsed = Date.now() - startTime;
    document.getElementById('timer').textContent = `Tiempo: ${(elapsed / 1000).toFixed(1)}s`;
    document.getElementById('bestRecord').textContent = `Mejor récord: ${(bestRecord / 1000).toFixed(1)}s`;
}

function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(updateTimerDisplay, 100);
}

function resetGame() {
    clearInterval(timerInterval);
    playerPosition = { x: 0, y: 0 };
    DidiPosition = { x: 300, y: 300 };
    updatePosition();
    startTimer();
}

let pausedTime = 0;  // Guardará el tiempo que ha estado pausado.

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseButton').textContent = isPaused ? 'Reanudar' : 'Pausa';

    if (isPaused) {
        pausedTime = Date.now() - startTime;  // Guardar el tiempo transcurrido antes de la pausa para que no se borre lo transcurrido
        clearInterval(timerInterval);  // Pausar el cronómetro
    } else {
        startTime = Date.now() - pausedTime;  // Ajustar el tiempo para continuar desde donde se dejó
        timerInterval = setInterval(updateTimerDisplay, 100);  // Reanudar el cronómetro, tenia el problema de que si se pausaba se reinciaba el contador creo ya lo arregle xd
    }
}

function createTimerDisplay() {
    const timerDisplay = document.createElement('div');
    timerDisplay.id = 'timer-display';
    timerDisplay.innerHTML = `
        <div id="timer">Tiempo: 0.0s</div>
        <div id="bestRecord">Mejor récord: ${(bestRecord / 1000).toFixed(1)}s</div>
        <button id="pauseButton">Pausa</button>
    `;
    timerDisplay.style.position = 'absolute';
    timerDisplay.style.top = '10px';
    timerDisplay.style.left = '10px';
    timerDisplay.style.color = 'black';
    timerDisplay.style.backgroundColor = 'white';
    timerDisplay.style.padding = '10px';
    timerDisplay.style.borderRadius = '5px';
    timerDisplay.style.border = '1px solid black';
    document.body.appendChild(timerDisplay);

    document.getElementById('pauseButton').addEventListener('click', togglePause);
}

window.addEventListener('keydown', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (keys.hasOwnProperty(event.key)) {
        keys[event.key] = false;
    }
});

window.addEventListener('load', () => {
    Object.keys(keys).forEach((key) => (keys[key] = false));
    createTimerDisplay();
    createConfigMenu();
    adjustGameArea();
    startTimer();
    gameLoop();
});

function adjustGameArea() {
    gameArea.style.width = '90vw';
    gameArea.style.height = '90vh';
    gameArea.style.margin = 'auto';
    gameArea.style.position = 'relative';
    gameArea.style.border = '2px solid black';
}

function createConfigMenu() {
    const configMenu = document.createElement('div');
    configMenu.id = 'config-menu';
    configMenu.innerHTML = `
        <h2>Configuración</h2>
        <label>
            Dificultad:
            <select id="difficulty">
                <option value="easy">Fácil</option>
                <option value="medium" selected>Media</option>
                <option value="hard">Difícil</option>
            </select>
        </label>
        <br>
        <label>
            Fondo:
            <input type="color" id="backgroundColor" value="#f0f0f0">
        </label>
        <br>
        <label>
            Modo oscuro:
            <input type="checkbox" id="darkMode">
        </label>
        <br>
        <label>
            Tamaño personajes:
            <input type="number" id="characterSize" value="50" min="30" max="100">
        </label>
    `;
    configMenu.style.position = 'absolute';
    configMenu.style.top = '10px';
    configMenu.style.right = '10px';
    configMenu.style.backgroundColor = 'white';
    configMenu.style.padding = '10px';
    configMenu.style.borderRadius = '5px';
    configMenu.style.boxShadow = '0px 4px 6px rgba(0,0,0,0.1)';
    configMenu.style.color = 'black';
    configMenu.style.border = '1px solid black';
    document.body.appendChild(configMenu);

    document.getElementById('difficulty').addEventListener('change', (e) => {
        updateConfig('difficulty', e.target.value);
    });

    document.getElementById('backgroundColor').addEventListener('input', (e) => {
        updateConfig('backgroundColor', e.target.value);
    });

    document.getElementById('darkMode').addEventListener('change', (e) => {
        updateConfig('darkMode', e.target.checked);
    });

    document.getElementById('characterSize').addEventListener('input', (e) => {
        updateConfig('characterSize', parseInt(e.target.value));
    });
}
function updateConfig(key, value) {
    // Actualiza la configuración con el nuevo valor
    gameConfig[key] = value;

    // Aplica los cambios en la interfaz
    switch (key) {
        case 'difficulty':
            // Ajusta la velocidad de los personajes según la dificultad
            if (value === 'easy') {
                playerSpeed = 3;
                DidiSpeed = 1;
            } else if (value === 'medium') {
                playerSpeed = 2;
                DidiSpeed = 1;
            } else if (value === 'hard') {
                playerSpeed = 1;
                DidiSpeed = 2;
            }
            break;
        case 'backgroundColor':
            gameArea.style.backgroundColor = value;
            break;
        case 'darkMode':
            if (value) {
                document.body.style.backgroundColor = '#333';
                document.body.style.color = '#fff';
            } else {
                document.body.style.backgroundColor = '#fff';
                document.body.style.color = '#000';
            }
            break;
        case 'characterSize':
            gameConfig.characterSize = value;
            player.style.width = `${value}px`;
            player.style.height = `${value}px`;
            didi.style.width = `${value}px`;
            didi.style.height = `${value}px`;
            break;
    }
}
