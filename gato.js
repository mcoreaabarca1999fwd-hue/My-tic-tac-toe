//Casillas
const casillas = Array.from({ length: 9 }, (_, i) => document.getElementById(`casilla${i}`));
//Botones
const restartBtn = document.getElementById('restartBtn');
const btnRes = document.getElementById('btnRes');

//Texto de estado
const statusText = document.getElementById('statusText')

//Movimientos
let movimientosTablero = 0;

//Marcadores
const vicsX = document.getElementById('vicsX');
const vicsO = document.getElementById('vicsO');
let contadorX = parseInt(localStorage.getItem('marcadorX')) || 0;
let contadorO = parseInt(localStorage.getItem('marcadorO')) || 0;

vicsX.textContent = "Jugador: " + contadorX;
vicsO.textContent = "Bot: " + contadorO;

statusText.textContent = "Turno del Jugador (=)";


// --- Funciones ---

// Movimientos jugador
const movimientos = () => {
    casillas.forEach((casilla) => {
        casilla.addEventListener('click', () => {
            if (casilla.innerText === '') {
                casilla.innerText = '=';
                movimientosTablero++;
                if (!validaGanador()) {
                    statusText.textContent = "Turno del Bot (@)";
                    setTimeout(movCirculo, 500); // máquina responde después de 0.5s
                }
            }
        });
    });
};
movimientos();

// Movimiento Bot (aleatorio)
const movCirculo = () => {
    const casillasVacias = casillas.filter((vacia) => vacia.textContent === '');
    if (casillasVacias.length === 0) return;

    const maquina = Math.floor(Math.random() * casillasVacias.length);

    movimientosTablero++;

    casillasVacias[maquina].innerText = '@';
    validaGanador();
    statusText.textContent = "Turno del Jugador (=)";
};

// Validación del ganador
const validaGanador = () => {
    let alguienGano = false;
    const posiblesGanes = [
        [0,1,2], [3,4,5], [6,7,8], // filas
        [0,3,6], [1,4,7], [2,5,8], // columnas
        [0,4,8], [2,4,6]           // diagonales
    ];
    
    for (let [pos1, pos2, pos3] of posiblesGanes) {
        if (
            casillas[pos1].textContent !== '' &&
            casillas[pos1].textContent === casillas[pos2].textContent &&
            casillas[pos1].textContent === casillas[pos3].textContent
        ) {
            alguienGano = true;
            bloquearTablero();

            if (casillas[pos1].textContent === '=') {
                statusText.textContent = "🎉 ¡Jugador gana!";
                contadorX++;
                localStorage.setItem('marcadorX', contadorX);
                vicsX.textContent = "Jugador: " + contadorX;
            } else {
                statusText.textContent = "🤖 ¡Bot gana!";
                contadorO++;
                localStorage.setItem('marcadorO', contadorO);
                vicsO.textContent = "Bot: " + contadorO;
            }
            return true;
        }
    }

    // Empate
    if (movimientosTablero >= 9 && !alguienGano) {
        statusText.textContent = "🤝 Empate";
        bloquearTablero();
        setTimeout(() => {
        }, 100);
        return true;
    }
    return false;
};

// Bloquear tablero
function bloquearTablero() {
    casillas.forEach(casilla => casilla.style.pointerEvents = "none");
}

// Desbloquear tablero
function desbloquearTablero() {
    casillas.forEach(casilla => casilla.style.pointerEvents = "auto");
}

// --- Botones ---

// Reiniciar tablero y marcador
restartBtn.addEventListener('click', () => {
    casillas.forEach(casilla => casilla.innerText = '');
    contadorX = 0;
    contadorO = 0;
    vicsX.textContent = "Jugador: " + contadorX;
    vicsO.textContent = "Bot: " + contadorO;
    localStorage.setItem('marcadorX', contadorX);
    localStorage.setItem('marcadorO', contadorO);
    movimientosTablero = 0;
    desbloquearTablero();
    statusText.textContent = "Turno del Jugador (=)";
});

// Reiniciar solo tablero
btnRes.addEventListener('click', () => {
    casillas.forEach(casilla => casilla.innerText = '');
    movimientosTablero = 0;
    desbloquearTablero();
    statusText.textContent = "Turno del Jugador (=)";
});