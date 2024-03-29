/// <reference path='../typings/browser.d.ts' />
/// <reference path='game.ts' />

interface Global {
    CANVAS: HTMLCanvasElement;
    STAGE: createjs.Stage;
    GRID_LINE_SIZE: number;
}

var G: Global = {
        CANVAS: null,
        STAGE: null,
        GRID_LINE_SIZE: 2
    };


window.onload = function()
{
Data.load( initGame );
};


function initGame()
{
G.CANVAS = <HTMLCanvasElement> document.querySelector( '#Canvas' );
G.STAGE = new createjs.Stage( G.CANVAS );
createjs.Ticker.timingMode = createjs.Ticker.RAF;

Game.init();

createjs.Ticker.on( 'tick', tick );
}


function tick( event )
{
G.STAGE.update();
}
