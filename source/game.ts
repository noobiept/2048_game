import * as Engine from '@drk4/game-engine';
import { Block } from './block';
import * as GameMenu from './game_menu';
import * as Data from './data';
import { GRID_LINE_SIZE } from './globals';
import { Grid, GameStatus, getSpawnValues } from './grid';

let GRID: Grid;
const GRID_LINES: Engine.Rectangle[] = [];

export function init() {
    const gridLength = Data.getOption('gridLength');
    const spawnRange = Data.getOption('spawnRange');

    setMapLength(gridLength);

    GameMenu.init({
        gridLength: gridLength,
        spawnRange: spawnRange,
        onGridLengthChange: setGridLengthOption,
        onSpawnRangeChange: setSpawnRangeOption
    });
    addRandomBlock();

    document.body.addEventListener('keyup', keyUpEvents);
}

function setGridLengthOption(value: number) {
    Data.setOption('gridLength', value);
    setMapLength(value);
    addRandomBlock();
}

function setSpawnRangeOption(min: number, max: number) {
    Data.setOption('spawnRange', [min, max]);
    GRID.clear();
    addRandomBlock();
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

    const possibleValues = getSpawnValues(Data.getOption('spawnRange'));

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
    GRID.clear();

    addRandomBlock();
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
    let moved = false;

    switch (key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
            moved = GRID.moveLeft();
            break;

        case 'ArrowRight':
        case 'd':
        case 'D':
            moved = GRID.moveRight();
            break;

        case 'ArrowUp':
        case 'w':
        case 'W':
            moved = GRID.moveUp();
            break;

        case 'ArrowDown':
        case 's':
        case 'S':
            moved = GRID.moveDown();
            break;
    }

    if (moved === true) {
        if (GRID.hasEmptyCells()) {
            addRandomBlock();
        }

        const gameEnded = GRID.hasGameEnded();

        if (gameEnded !== GameStatus.Ongoing) {
            let title = 'Game over';

            if (gameEnded === GameStatus.Victory) {
                title = 'Victory!';
            }

            const dialog = new Engine.Utilities.Dialog({
                title: title,
                body: createMessageBody('Starting a new round.'),
                onClose: restart
            });

            dialog.open();
        }
    }
}

function createMessageBody(text: string) {
    const body = document.createElement('div');
    body.textContent = text;
    body.className = 'GameOverMessage';

    return body;
}
