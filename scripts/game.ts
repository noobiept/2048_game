/// <reference path='block.ts' />
/// <reference path='utilities.ts' />
/// <reference path='move_animation.ts' />

module Game
{
var BLOCKS = [];

var GRID_LINES = [];


export function init()
{
var mapLength = G.MAP_LENGTH;

for (var column = 0 ; column < mapLength ; column++)
    {
    BLOCKS[ column ] = [];

    for (var line = 0 ; line < mapLength ; line++)
        {
        BLOCKS[ column ][ line ] = null;
        }
    }

MoveAnimation.init();

var blockSize = Block.size;
var lineSize = G.GRID_LINE_SIZE;
var mapLength = G.MAP_LENGTH;

for (var a = 1 ; a < mapLength ; a++)
    {
    var position = blockSize * a + (a - 1) * lineSize;
    var length = mapLength * blockSize + (mapLength - 1) * lineSize;

    drawLine( position, 0, lineSize, length );
    drawLine( 0, position, length, lineSize );
    }


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
var possibleValues = [ 2, 4 ];

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



function restart()
{
var mapLength = G.MAP_LENGTH;

for (var column = 0 ; column < mapLength ; column++)
    {
    for (var line = 0 ; line < mapLength ; line++)
        {
        var block = BLOCKS[ column ][ line ];

        removeBlock( block );
        }
    }

addRandomBlock();
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
 */

function hasGameEnded()
{
var mapLength = G.MAP_LENGTH;

    // check if there's an empty space (if there is, means the game hasn't ended)
if ( isThereEmptyBlocks() )
    {
    return false;
    }


var left, right, up, down;

    // the grid is all filled, need to check if there's adjacent blocks with the same value
for (var column = 0 ; column < mapLength ; column++)
    {
    for (var line = 0 ; line < mapLength ; line++)
        {
        var block = BLOCKS[ column ][ line ];

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
            return false;
            }
        }
    }

return true;
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
    if ( hasGameEnded() )
        {
        console.log( 'Game has ended.' );
        restart();
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