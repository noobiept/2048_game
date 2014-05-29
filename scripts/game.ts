/// <reference path='block.ts' />
/// <reference path='game_menu.ts' />
/// <reference path='utilities.ts' />

module Game
{
var BLOCKS = [];

var GRID_LINES = [];


export function init()
{
setMapLength( G.MAP_LENGTH );

GameMenu.init();

addRandomBlock();

document.body.addEventListener( 'keyup', keyUpEvents );
}


function drawLine( x, y, width, height )
{
var line = new createjs.Shape();

var g = line.graphics;

g.beginFill( 'rgb(170,170,170)' );
g.drawRoundRect( x, y, width, height, 5 );
g.endFill();

GRID_LINES.push( line );

G.STAGE.addChild( line );
}




export function addRandomBlock()
{
var emptyBlocks = getEmptyBlocks();

var position;

    // get the block
position = getRandomInt( 0, emptyBlocks.length - 1 );

var blockPosition = emptyBlocks[ position ];

var column = blockPosition.column;
var line = blockPosition.line;

    // get the value
var possibleValues = G.SPAWN_VALUES;

position = getRandomInt( 0, possibleValues.length - 1 );

var value = possibleValues[ position ];

addBlock({
        column: column,
        line: line,
        value: value
    });
}




function getEmptyBlocks()
{
var emptyBlocks = [];

for (var column = 0 ; column < G.MAP_LENGTH ; column++)
    {
    for (var line = 0 ; line < G.MAP_LENGTH ; line++)
        {
        if ( BLOCKS[ column ][ line ] === null )
            {
            emptyBlocks.push({
                    column: column,
                    line: line
                });
            }
        }
    }

return emptyBlocks;
}


function isThereEmptyBlocks()
{
var mapLength = G.MAP_LENGTH;

for (var column = 0 ; column < mapLength ; column++)
    {
    for (var line = 0 ; line < mapLength ; line++)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block === null )
            {
            return true;
            }
        }
    }

return false;
}


function moveLeft()
{
    // combine
for (var line = 0 ; line < G.MAP_LENGTH ; line++)
    {
    var firstBlock = null;

    for (var column = G.MAP_LENGTH - 1 ; column >= 0 ; column--)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            if ( firstBlock === null )
                {
                firstBlock = block;
                }

            else
                {
                if ( firstBlock.value == block.value )
                    {
                    block.setValue( block.value * 2 );

                    removeBlock( firstBlock );
                    break;  // only one combination per line
                    }

                else
                    {
                    firstBlock = block;
                    }
                }
            }
        }
    }


    // count and move
    // loop in the opposite direction
for (var line = 0 ; line < G.MAP_LENGTH ; line++)
    {
    var position = 0;

    for (var column = position ; column < G.MAP_LENGTH ; column++)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            moveBlock( block, position, line );

            position++;
            }
        }
    }
}


function moveRight()
{
    // combine
for (var line = 0 ; line < G.MAP_LENGTH ; line++)
    {
    var firstBlock = null;

    for (var column = 0 ; column < G.MAP_LENGTH ; column++)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            if ( firstBlock === null )
                {
                firstBlock = block;
                }

            else
                {
                if ( firstBlock.value == block.value )
                    {
                    block.setValue( block.value * 2 );

                    removeBlock( firstBlock );
                    break;  // only one combination per line
                    }

                else
                    {
                    firstBlock = block;
                    }
                }
            }
        }
    }


    // count and move
    // loop in the opposite direction
for (var line = 0 ; line < G.MAP_LENGTH ; line++)
    {
    var position = G.MAP_LENGTH - 1;

    for (var column = position ; column >= 0 ; column--)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            moveBlock( block, position, line );

            position--;
            }
        }
    }
}



function moveUp()
{
    // combine
for (var column = 0 ; column < G.MAP_LENGTH ; column++)
    {
    var firstBlock = null;

    for (var line = G.MAP_LENGTH - 1 ; line >= 0 ; line--)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            if ( firstBlock === null )
                {
                firstBlock = block;
                }

            else
                {
                if ( firstBlock.value == block.value )
                    {
                    block.setValue( block.value * 2 );

                    removeBlock( firstBlock );
                    break;  // only one combination per line
                    }

                else
                    {
                    firstBlock = block;
                    }
                }
            }
        }
    }


    // count and move
    // loop in the opposite direction
for (var column = 0 ; column < G.MAP_LENGTH ; column++)
    {
    var position = 0;

    for (var line = position ; line < G.MAP_LENGTH ; line++)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            moveBlock( block, column, position );

            position++;
            }
        }
    }
}



function moveDown()
{
    // combine
for (var column = 0 ; column < G.MAP_LENGTH ; column++)
    {
    var firstBlock = null;

    for (var line = 0 ; line < G.MAP_LENGTH ; line++)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            if ( firstBlock === null )
                {
                firstBlock = block;
                }

            else
                {
                if ( firstBlock.value == block.value )
                    {
                    block.setValue( block.value * 2 );

                    removeBlock( firstBlock );
                    break;  // only one combination per line
                    }

                else
                    {
                    firstBlock = block;
                    }
                }
            }
        }
    }


    // count and move
    // loop in the opposite direction
for (var column = 0 ; column < G.MAP_LENGTH ; column++)
    {
    var position = G.MAP_LENGTH - 1;

    for (var line = position ; line >= 0 ; line--)
        {
        var block = BLOCKS[ column ][ line ];

        if ( block !== null )
            {
            moveBlock( block, column, position );

            position--;
            }
        }
    }
}



export function restart()
{
clearBlocks();

addRandomBlock();
}


function clearBlocks()
{
for (var column = 0 ; column < BLOCKS.length ; column++)
    {
    var columnArray = BLOCKS[ column ];

    for (var line = 0 ; line < columnArray.length ; line++)
        {
        var block = BLOCKS[ column ][ line ];

        removeBlock( block );
        }
    }
}


function clear()
{
clearBlocks();

    // clear the grid lines
for (var a = 0 ; a < GRID_LINES.length ; a++)
    {
    G.STAGE.removeChild( GRID_LINES[ a ] );
    }

GRID_LINES.length = 0;
BLOCKS.length = 0;
}



export function setMapLength( length )
{
clear();

var blockSize = Block.size;
var lineSize = G.GRID_LINE_SIZE;

G.MAP_LENGTH = length;

G.CANVAS.width = length * blockSize;
G.CANVAS.height = length * blockSize;


for (var column = 0 ; column < length ; column++)
    {
    BLOCKS[ column ] = [];

    for (var line = 0 ; line < length ; line++)
        {
        BLOCKS[ column ][ line ] = null;
        }
    }


for (var a = 1 ; a < length ; a++)
    {
    var position = blockSize * a + (a - 1) * lineSize;
    var lineLength = length * blockSize + (length - 1) * lineSize;

    drawLine( position, 0, lineSize, lineLength );
    drawLine( 0, position, lineLength, lineSize );
    }
}



export function setSpawnValues( min, max )
{
clearBlocks();

var value = min;
var possibleValues = [];

while ( value <= max )
    {
    possibleValues.push( value );

    value *= 2;
    }

G.SPAWN_VALUES = possibleValues;
}



function addBlock( args )
{
var block = new Block( args );

BLOCKS[ args.column ][ args.line ] = block;
}



function removeBlock( block )
{
if ( block !== null )
    {
    BLOCKS[ block.column ][ block.line ] = null;

    block.remove();
    }
}


function moveBlock( block, newColumn, newLine )
{
BLOCKS[ block.column ][ block.line ] = null;

block.moveTo( newColumn, newLine );

BLOCKS[ newColumn ][ newLine ] = block;
}




/*
    - win:
        - when there's a block with a 2048 value

    - loose:
        - no more empty spaces and no adjacent blocks with the same value

    - returns:
        - 0 if game hasn't ended
        - 1 if ended in victory
        - -1 if ended in a loss
 */

function hasGameEnded()
{
var mapLength = G.MAP_LENGTH;

var column;
var line;
var block;


for (column = 0 ; column < mapLength ; column++)
    {
    for (line = 0 ; line < mapLength ; line++)
        {
        block = BLOCKS[ column ][ line ];

        if ( block && block.value >= 2048 )
            {
            return 1;
            }
        }
    }



    // check if there's an empty space (if there is, means the game hasn't ended)
if ( isThereEmptyBlocks() )
    {
    return 0;
    }


var left, right, up, down;

    // the grid is all filled, need to check if there's adjacent blocks with the same value
for (column = 0 ; column < mapLength ; column++)
    {
    for (line = 0 ; line < mapLength ; line++)
        {
        block = BLOCKS[ column ][ line ];

            // check all positions around this one
        if ( column <= 0 )
            {
            left = null;
            }

        else
            {
            left = BLOCKS[ column - 1 ][ line ];
            }

        if ( column >= mapLength - 1 )
            {
            right = null;
            }

        else
            {
            right = BLOCKS[ column + 1 ][ line ];
            }

        if ( line <= 0 )
            {
            up = null;
            }

        else
            {
            up = BLOCKS[ column ][ line - 1 ];
            }

        if ( line >= mapLength - 1 )
            {
            down = null;
            }

        else
            {
            down = BLOCKS[ column ][ line + 1 ];
            }



        if ( (left && left.value == block.value) ||
             (right && right.value == block.value) ||
             (up && up.value == block.value) ||
             (down && down.value == block.value) )
            {
            return 0;
            }
        }
    }

return -1;
}



function keyUpEvents( event )
{
var key = event.keyCode;
var moved = false;

if ( key == EVENT_KEY.leftArrow )
    {
    moveLeft();
    moved = true;
    }

else if ( key == EVENT_KEY.rightArrow )
    {
    moveRight();
    moved = true;
    }

else if ( key == EVENT_KEY.upArrow )
    {
    moveUp();
    moved = true;
    }

else if ( key == EVENT_KEY.downArrow )
    {
    moveDown();
    moved = true;
    }


if ( moved === true )
    {
    var gameEnded = hasGameEnded();

    if ( gameEnded !== 0 )
        {
        var message = document.querySelector( '#Message' );
        var text = 'Game has ended.\n\n';

        if ( gameEnded === 1 )
            {
            text += 'Victory!';
            }

        else
            {
            text += 'Defeat!';
            }


        $( message ).text( text );
        $( message ).dialog({
                dialogClass: 'no-close',
                modal: true,
                buttons: [{
                    text: 'Ok',
                    click: function()
                        {
                        $( this ).dialog( 'close' );

                        restart();
                        }
                }]
            });
        }

    else
        {
        if ( isThereEmptyBlocks() )
            {
            addRandomBlock();
            }
        }
    }
}



}