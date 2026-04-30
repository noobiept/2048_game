import * as Engine from '@drk4/game-engine';
import { Block } from './block';
import * as GameMenu from './game_menu';
import { getBestVictoryTime, getOption, saveVictoryTime, setOption } from './data';
import { GRID_LINE_SIZE } from './globals';
import { Grid, GameStatus, getSpawnValues } from './grid';
import { formatVictoryTime } from './high_score';
import { getSwipeDirection, type Direction } from './input';

let GRID: Grid;
let ROUND_TIMER: Engine.Utilities.Timer;
let GAME_ACTIVE = false;
const GRID_LINES: Engine.Rectangle[] = [];

let swipeStartX: number | null = null;
let swipeStartY: number | null = null;

export function init() {
    const gridLength = getOption('gridLength');
    const spawnRange = getOption('spawnRange');

    setMapLength(gridLength);

    GameMenu.init({
        gridLength: gridLength,
        spawnRange: spawnRange,
        onGridLengthChange: setGridLengthOption,
        onSpawnRangeChange: setSpawnRangeOption
    });
    ROUND_TIMER = new Engine.Utilities.Timer({
        updateElement: {
            element: document.querySelector<HTMLElement>('#roundTimer')!,
            format: (timer) => formatTime(timer.getTimeMilliseconds())
        }
    });
    updateBestVictoryTime();
    startRound();

    const canvasElement = document.querySelector<HTMLElement>('#Canvas')!;
    const restartButton = document.querySelector<HTMLButtonElement>('#restartButton')!;

    document.body.addEventListener('keyup', keyUpEvents);
    restartButton.addEventListener('click', restart);
    canvasElement.addEventListener('pointerdown', pointerDownEvent);
    canvasElement.addEventListener('pointerup', pointerUpEvent);
    canvasElement.addEventListener('pointercancel', pointerCancelEvent);
}

function setGridLengthOption(value: number) {
    setOption('gridLength', value);
    setMapLength(value);
    updateBestVictoryTime();
    startRound();
}

function setSpawnRangeOption(min: number, max: number) {
    setOption('spawnRange', [min, max]);
    updateBestVictoryTime();
    startRound();
}

function drawLine(x: number, y: number, width: number, height: number): void {
    const line = new Engine.Rectangle({
        x: x + width / 2,
        y: y + height / 2,
        width: width,
        height: height,
        color: 'rgb(170,170,170)',
        fill: true
    });

    GRID_LINES.push(line);

    Engine.getCanvas().addChild(line);
}

export function addRandomBlock() {
    const emptyCells = GRID.getEmptyCells();

    let position = Engine.Utilities.getRandomInt(0, emptyCells.length - 1);
    const cell = emptyCells[position];

    const possibleValues = getSpawnValues(getOption('spawnRange'));

    position = Engine.Utilities.getRandomInt(0, possibleValues.length - 1);

    const value = possibleValues[position];

    const block = new Block({
        column: cell.column,
        line: cell.line,
        value: value
    });

    GRID.placeBlock(block);
}

export function restart() {
    startRound();
}

function startRound() {
    GAME_ACTIVE = true;
    GRID.clear();

    addRandomBlock();
    ROUND_TIMER.start({ interval: 100 });
}

function clearGridLines() {
    for (let a = 0; a < GRID_LINES.length; a++) {
        Engine.getCanvas().removeChild(GRID_LINES[a]);
    }

    GRID_LINES.length = 0;
}

export function setMapLength(length: number) {
    if (GRID) {
        GRID.clear();
    }

    clearGridLines();

    GRID = new Grid(length);

    const blockSize = Block.size;
    const lineSize = GRID_LINE_SIZE;

    const size = length * blockSize + (length - 1) * lineSize;
    Engine.getCanvas().updateDimensions(size, size);

    for (let a = 1; a < length; a++) {
        const position = blockSize * a + (a - 1) * lineSize;
        const lineLength = length * blockSize + (length - 1) * lineSize;

        drawLine(position, 0, lineSize, lineLength);
        drawLine(0, position, lineLength, lineSize);
    }
}

function keyUpEvents(event: KeyboardEvent) {
    const key = event.key;

    switch (key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            move('left');
            break;

        case 'ArrowRight':
        case 'd':
        case 'D':
            move('right');
            break;

        case 'ArrowUp':
        case 'w':
        case 'W':
            move('up');
            break;

        case 'ArrowDown':
        case 's':
        case 'S':
            move('down');
            break;
    }
}

function pointerDownEvent(event: PointerEvent) {
    swipeStartX = event.clientX;
    swipeStartY = event.clientY;

    if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.setPointerCapture(event.pointerId);
    }
}

function pointerUpEvent(event: PointerEvent) {
    if (swipeStartX === null || swipeStartY === null) {
        return;
    }

    const offsetX = event.clientX - swipeStartX;
    const offsetY = event.clientY - swipeStartY;
    const direction = getSwipeDirection(offsetX, offsetY);

    pointerCancelEvent();

    if (direction !== null) {
        move(direction);
    }
}

function pointerCancelEvent() {
    swipeStartX = null;
    swipeStartY = null;
}

function move(direction: Direction) {
    if (!GAME_ACTIVE) {
        return;
    }

    let moved = false;

    switch (direction) {
        case 'left':
            moved = GRID.moveLeft();
            break;

        case 'right':
            moved = GRID.moveRight();
            break;

        case 'up':
            moved = GRID.moveUp();
            break;

        case 'down':
            moved = GRID.moveDown();
            break;
    }

    if (moved === true) {
        if (GRID.hasEmptyCells()) {
            addRandomBlock();
        }

        const gameEnded = GRID.hasGameEnded();

        if (gameEnded !== GameStatus.Ongoing) {
            GAME_ACTIVE = false;
            ROUND_TIMER.stop();

            let title = 'Game over';
            let message = 'Starting a new round.';

            if (gameEnded === GameStatus.Victory) {
                const victoryTime = ROUND_TIMER.getTimeMilliseconds();
                const newRecord = saveVictoryTime(victoryTime);
                const timeText = formatTime(victoryTime);

                title = 'Victory!';
                message = 'Time: ' + timeText + '\n';

                if (newRecord) {
                    message += 'New best time!';
                } else {
                    message += 'Best: ' + formatBestVictoryTime();
                }

                message += '\nStarting a new round.';
                updateBestVictoryTime();
            }

            const dialog = new Engine.Utilities.Dialog({
                title: title,
                body: createMessageBody(message),
                onClose: restart
            });

            dialog.open();
        }
    }
}

function updateBestVictoryTime() {
    document.querySelector<HTMLElement>('#bestVictoryTime')!.textContent = formatBestVictoryTime();
}

function formatBestVictoryTime() {
    const bestVictoryTime = getBestVictoryTime();

    if (bestVictoryTime === null) {
        return '-';
    }

    return formatTime(bestVictoryTime);
}

function formatTime(time: number) {
    return formatVictoryTime(time);
}

function createMessageBody(text: string) {
    const body = document.createElement('div');
    body.textContent = text;
    body.className = 'GameOverMessage';

    return body;
}
