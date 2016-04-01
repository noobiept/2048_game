module Data
{
interface OptionsData {
    gridLength: number;
    spawnRange: number[];
}
type OptionsKey = 'gridLength' | 'spawnRange';

var OPTIONS: OptionsData = {
    gridLength: 4,
    spawnRange: [ 2, 4 ]
}


export function load( callback: () => any )
    {
    AppStorage.getData( [ '2048_options' ], function( data )
        {
        var options = data[ '2048_options' ];

        if ( options )
            {
            OPTIONS = options;
            }

        callback();
        });
    }


export function setOption( key: OptionsKey, value: any )
    {
    OPTIONS[ key ] = value;
    saveOptions();
    }


export function getOption( key: OptionsKey )
    {
    return OPTIONS[ key ];
    }


function saveOptions()
    {
    AppStorage.setData({ '2048_options': OPTIONS });
    }
}