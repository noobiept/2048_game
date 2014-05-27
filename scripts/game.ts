/// <reference path='block.ts' />
/// <reference path='utilities.ts' />

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
        BLOCKS[ column ][ line ] = new Block({
                column: column,
                line: line
            });
        }
    }

addRandomBlock();

document.body.addEventListener( 'keyup', keyUpEvents );
}


export function addRandomBlock()
{
var position;

    // get the block
position = getRandomInt( 0, Block.emptyBlocks.length - 1 );

var block = Block.emptyBlocks[ position ];

    // get the value
var possibleValues = [ 2, 4 ];

position = getRandomInt( 0, possibleValues.length - 1 );

var value = possibleValues[ position ];


block.setValue( value );
}


function play( direction: Direction )
{
var lines = [];

if ( direction == Direction.left )
    {
    for (var line = 0 ; line < G.MAP_LENGTH ; line++)
        {
        lines[ line ] = [];

        for (var column = G.MAP_LENGTH - 1 ; column >= 0 ; column--)
            {
            lines[ line ].push( BLOCKS[ column ][ line ] );
            }
        }
    }

else if ( direction == Direction.right )
    {
    for (var line = 0 ; line < G.MAP_LENGTH ; line++)
        {
        lines[ line ] = [];

        for (var column = 0 ; column < G.MAP_LENGTH ; column++)
            {
            lines[ line ].push( BLOCKS[ column ][ line ] );
            }
        }
    }

else if ( direction == Direction.up )
    {
    for (var column = 0 ; column < G.MAP_LENGTH ; column++)
        {
        lines[ column ] = [];

        for (var line = G.MAP_LENGTH - 1 ; line >= 0 ; line--)
            {
            lines[ column ].push( BLOCKS[ column ][ line ] );
            }
        }
    }

else if ( direction == Direction.down )
    {
    for (var column = 0 ; column < G.MAP_LENGTH ; column++)
        {
        lines[ column ] = [];

        for (var line = 0 ; line < G.MAP_LENGTH ; line++)
            {
            lines[ column ].push( BLOCKS[ column ][ line ] );
            }
        }
    }

else
    {
    console.log( 'error, wrong direction.' );
    return;
    }


combine( lines );
moveAll( lines );
}




function combine( lines )
{
for (var a = 0 ; a < lines.length ; a++)
    {
    var line = lines[ a ];
    var firstBlock = null;

    for (var b = 0 ; b < line.length ; b++)
        {
        var block = line[ b ];

        if ( !block.isEmpty )
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
                    firstBlock.setValue( 0 );
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
}

/*
    Move all the used blocks to the end of the array
 */

function moveAll( lines )
{
var block;

for (var a = 0 ; a < lines.length ; a++)
    {
    var line = lines[ a ];
    var usedBlocksValues = [];
    var b;

    for (b = 0 ; b < line.length ; b++)
        {
        block = line[ b ];

        if ( !block.isEmpty )
            {
            usedBlocksValues.push( block.value );
            }
        }

        var emptyBlocksLength = line.length - usedBlocksValues.length;

        for (b = 0 ; b < line.length ; b++)
            {
            block = line[ b ];

            if ( b < emptyBlocksLength )
                {
                block.setValue( 0 );
                }

            else
                {
                block.setValue( usedBlocksValues[ b - emptyBlocksLength ] );
                }
            }
    }

}


function keyUpEvents( event )
{
var key = event.keyCode;

if ( key == EVENT_KEY.leftArrow )
    {
    play( Direction.left );
    addRandomBlock();
    }

else if ( key == EVENT_KEY.rightArrow )
    {
    play( Direction.right );
    addRandomBlock();
    }

else if ( key == EVENT_KEY.upArrow )
    {
    play( Direction.up );
    addRandomBlock();
    }

else if ( key == EVENT_KEY.downArrow )
    {
    play( Direction.down );
    addRandomBlock();
    }
}



}