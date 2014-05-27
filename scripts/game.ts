/// <reference path='block.ts' />
/// <reference path='utilities.ts' />
/// <reference path='move_animation.ts' />

module Game
{
var BLOCKS = [];

enum Direction { left, right, up, down }


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

addRandomBlock();

document.body.addEventListener( 'keyup', keyUpEvents );
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


var block = new Block({
        column: column,
        line: line,
        value: value
    });

BLOCKS[ blockPosition.column ][ blockPosition.line ] = block;
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
            BLOCKS[ block.column ][ block.line ] = null;
            block.moveTo( position, line );
            BLOCKS[ position ][ line ] = block;
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
            BLOCKS[ block.column ][ block.line ] = null;
            block.moveTo( position, line );
            BLOCKS[ position ][ line ] = block;
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
            BLOCKS[ block.column ][ block.line ] = null;
            block.moveTo( column, position );
            BLOCKS[ column ][ position ] = block;
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
            BLOCKS[ block.column ][ block.line ] = null;
            block.moveTo( column, position );
            BLOCKS[ column ][ position ] = block;
            position--;
            }
        }
    }
}




function removeBlock( block )
{
BLOCKS[ block.column ][ block.line ] = null;

block.remove();
}



function keyUpEvents( event )
{
var key = event.keyCode;

if ( key == EVENT_KEY.leftArrow )
    {
    moveLeft();
    addRandomBlock();
    }

else if ( key == EVENT_KEY.rightArrow )
    {
    moveRight();
    addRandomBlock();
    }

else if ( key == EVENT_KEY.upArrow )
    {
    moveUp();
    addRandomBlock();
    }

else if ( key == EVENT_KEY.downArrow )
    {
    moveDown();
    addRandomBlock();
    }
}



}