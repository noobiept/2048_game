/// <reference path='../typings/tsd.d.ts' />
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

    - to doo:

        - use tweenjs for the movement (doesnt really need the move_animation.js stuff (since not cancelling animation in the middle of it))
        - the end conditions
            - win when there's a block with 2048 value
        - add control to change the grid size
        - add control with the limits to the values that can spawn (default 2-4, but can be 2-8, 2-16 etc)
 */

var G = {
        CANVAS: null,
        STAGE: null,
        MAP_LENGTH: 4,
        GRID_LINE_SIZE: 2
    };

window.onload = function()
{
G.CANVAS = document.querySelector( '#Canvas' );
G.STAGE = new createjs.Stage( G.CANVAS );

G.CANVAS.width = 600;
G.CANVAS.height = 400;

Game.init();

createjs.Ticker.on( 'tick', tick );
};



function tick( event )
{
G.STAGE.update();
}
