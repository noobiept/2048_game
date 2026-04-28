import * as Engine from '@drk4/game-engine';
import { Block } from './block';
import * as GameMenu from './game_menu';
import * as Data from './data';
import { GRID_LINE_SIZE } from './globals';
import { Grid, GameStatus, getSpawnValues } from './grid';

var GRID: Grid;
var GRID_LINES = [];

export function init() {
    var gridLength = Data.getOption('gridLength');
    var spawnRange = Data.getOption('spawnRange');

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

function drawLine(x, y, width, height) {
    var line = new Engine.Rectangle({
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
    var emptyCells = GRID.getEmptyCells();

    var position = Engine.Utilities.getRandomInt(0, emptyCells.length - 1);
    var cell = emptyCells[position];

    var possibleValues = getSpawnValues(Data.getOption('spawnRange'));

    position = Engine.Utilities.getRandomInt(0, possibleValues.length - 1);

    var value = possibleValues[position];

    var block = new Block({
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
    for (var a = 0; a < GRID_LINES.length; a++) {
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

    var blockSize = Block.size;
    var lineSize = GRID_LINE_SIZE;

    var size = length * blockSize + (length - 1) * lineSize;
    Engine.getCanvas().updateDimensions(size, size);

    for (var a = 1; a < length; a++) {
        var position = blockSize * a + (a - 1) * lineSize;
        var lineLength = length * blockSize + (length - 1) * lineSize;

        drawLine(position, 0, lineSize, lineLength);
        drawLine(0, position, lineLength, lineSize);
    }
}

function keyUpEvents(event: KeyboardEvent) {
    var key = event.key;
    var moved = false;

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
        var gameEnded = GRID.hasGameEnded();

        if (gameEnded !== GameStatus.Ongoing) {
            var title = 'Game over';

            if (gameEnded === GameStatus.Victory) {
                title = 'Victory!';
            }

            var dialog = new Engine.Utilities.Dialog({
                title: title,
                body: createMessageBody('Starting a new round.'),
                onClose: restart
            });

            dialog.open();
        } else {
            if (GRID.hasEmptyCells()) {
                addRandomBlock();
            }
        }
    }
}

function createMessageBody(text: string) {
    var body = document.createElement('div');
    body.textContent = text;
    body.className = 'GameOverMessage';

    return body;
}
