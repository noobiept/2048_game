/// <reference path='../typings/browser.d.ts' />
/// <reference path='game.ts' />

/*
    - 4x4 grids
    - arrows keys to move left/right/up/down
    - if two tiles of the same number collide while moving, they will merge into a tile with the total value of the two
    - tiles can only be merged once in each move
    - every turn, a new tile randomly appears on an empty spot on the map, with a value of 2 or 4
    - when 2 tiles combine, we add the resulting value to the score
    - game is won when a tile with a value of 2048 appears
    - game ends when there's no more possible moves (no empty spaces, and no adjacent tiles with the same value)
 */

interface Global {
    CANVAS: HTMLCanvasElement;
    STAGE: createjs.Stage;
    MAP_LENGTH: number;
    GRID_LINE_SIZE: number;
    SPAWN_VALUES: number[];
}

var G: Global = {
        CANVAS: null,
        STAGE: null,
        MAP_LENGTH: 4,
        GRID_LINE_SIZE: 2,
        SPAWN_VALUES: [ 2, 4 ]
    };

window.onload = function()
{
G.CANVAS = <HTMLCanvasElement> document.querySelector( '#Canvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
createjs.Ticker.timingMode = createjs.Ticker.RAF;

Game.init();

createjs.Ticker.on( 'tick', tick );
};


function tick( event )
{
G.STAGE.update();
}
