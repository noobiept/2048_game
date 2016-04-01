/// <reference path='../typings/browser.d.ts' />
/// <reference path='game.ts' />

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
