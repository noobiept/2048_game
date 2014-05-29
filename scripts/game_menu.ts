module GameMenu
{
export function init()
{
var gridLength = document.querySelector( '#gridLength' );
var gridLengthLabel = document.querySelector( '#gridLengthLabel' );

var length = G.MAP_LENGTH;

$( gridLengthLabel ).text( length );

$( gridLength ).slider({
        range: 'min',
        value: length,
        min: 4,
        max: 10,
        slide: function( event, ui )
            {
            $( gridLengthLabel ).text( ui.value );
            },

        stop: function( event, ui )
            {
            Game.setMapLength( ui.value );
            Game.addRandomBlock();
            }
    });


var spawnRange = document.querySelector( '#spawnRange' );
var spawnRangeLabel = document.querySelector( '#spawnRangeLabel' );

var min = 2;
var max = 4;

var values = [ 2, 4, 8, 16, 32 ];

$( spawnRangeLabel ).text( '[ ' + min + ', ' + max + ' ]' );

$( spawnRange ).slider({
        range: true,
        min: 0,
        max: values.length  - 1,
        values: [ values.indexOf( min ), values.indexOf( max ) ],
        slide: function( event, ui )
            {
            var min = values[ ui.values[ 0 ] ];
            var max = values[ ui.values[ 1 ] ];

            $( spawnRangeLabel ).text( '[ ' + min + ', ' + max + ' ]' );
            },
        stop: function( event, ui )
            {
            var min = values[ ui.values[ 0 ] ];
            var max = values[ ui.values[ 1 ] ];

            Game.setSpawnValues( min, max );
            Game.addRandomBlock();
            }
    });
}


}