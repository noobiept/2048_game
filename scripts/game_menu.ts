import * as Data from './data';
import * as Game from './game';

export function init()
{
initGridLength();
initSpawnRange();
}


function initGridLength()
{
const input = document.querySelector<HTMLInputElement>( '#gridLength' )!;
const label = document.querySelector<HTMLElement>( '#gridLengthLabel' )!;

const length = Data.getOption( 'gridLength' );
input.value = String( length );
label.textContent = String( length );

input.addEventListener( 'input', () =>
    {
    label.textContent = input.value;
    });

input.addEventListener( 'change', () =>
    {
    const value = Number( input.value );
    Data.setOption( 'gridLength', value );
    Game.setMapLength( value );
    Game.addRandomBlock();
    });
}


function initSpawnRange()
{
const minInput = document.querySelector<HTMLInputElement>( '#spawnRangeMin' )!;
const maxInput = document.querySelector<HTMLInputElement>( '#spawnRangeMax' )!;
const fill = document.querySelector<HTMLElement>( '#spawnRangeFill' )!;
const label = document.querySelector<HTMLElement>( '#spawnRangeLabel' )!;

const values = [ 2, 4, 8, 16, 32 ];
const range = Data.getOption( 'spawnRange' );
const trackMin = Number( minInput.min );
const trackMax = Number( minInput.max );
const trackSpan = trackMax - trackMin;

minInput.value = String( values.indexOf( range[ 0 ] ) );
maxInput.value = String( values.indexOf( range[ 1 ] ) );

const updateUi = () =>
    {
    const minIdx = Number( minInput.value );
    const maxIdx = Number( maxInput.value );
    label.textContent = '[ ' + values[ minIdx ] + ', ' + values[ maxIdx ] + ' ]';
    fill.style.left = ( ( minIdx - trackMin ) / trackSpan * 100 ) + '%';
    fill.style.right = ( ( trackMax - maxIdx ) / trackSpan * 100 ) + '%';
    };

const commit = () =>
    {
    const min = values[ Number( minInput.value ) ];
    const max = values[ Number( maxInput.value ) ];
    Data.setOption( 'spawnRange', [ min, max ] );
    Game.setSpawnValues( min, max );
    Game.addRandomBlock();
    };

minInput.addEventListener( 'input', () =>
    {
    if ( Number( minInput.value ) > Number( maxInput.value ) )
        {
        maxInput.value = minInput.value;
        }
    updateUi();
    });

maxInput.addEventListener( 'input', () =>
    {
    if ( Number( maxInput.value ) < Number( minInput.value ) )
        {
        minInput.value = maxInput.value;
        }
    updateUi();
    });

minInput.addEventListener( 'change', commit );
maxInput.addEventListener( 'change', commit );

updateUi();
}
