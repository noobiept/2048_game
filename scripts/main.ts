import * as Data from './data';
import * as Game from './game';
import { G } from './globals';


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
