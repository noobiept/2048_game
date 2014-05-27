/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />

class Block
{
    value: number;
    isEmpty: boolean;
    column: number;
    line: number;

    backgroundElement;
    valueElement;
    containerElement;

    static size = 50;
    static colors = { '0': 'gray', '2': 'brown', '4': 'red', '8': 'blue' };
    static emptyBlocks = [];


constructor( args )
    {
    this.column = args.column;
    this.line = args.line;

    this.setupShape();
    this.positionIn( this.column, this.line );

    this.value = 0;
    this.isEmpty = false;   // its false so that the .setValue below works (to assume its changing from a occupied block to an empty one)
    this.setValue( 0 );
    }

setupShape()
    {
    var background = new createjs.Shape();
    var value = new createjs.Text( '', '30px monospace' );

    var container = new createjs.Container();

    container.addChild( background );
    container.addChild( value );

    G.STAGE.addChild( container );

    this.backgroundElement = background;
    this.valueElement = value;
    this.containerElement = container;
    }

positionIn( column, line )
    {
    var size = Block.size;

    this.containerElement.x = size * column;
    this.containerElement.y = size * line;
    }

moveTo( column, line )
    {

    }

setValue( value )
    {
    this.value = value;

    if ( value === 0 )
        {
        if ( !this.isEmpty )
            {
            this.isEmpty = true;
            this.valueElement.text = '';
            Block.emptyBlocks.push( this );
            }
        }

    else
        {
        if ( this.isEmpty )
            {
            this.isEmpty = false;

            var index = Block.emptyBlocks.indexOf( this );

            Block.emptyBlocks.splice( index, 1 );
            }


        this.valueElement.text = value;
        }

    this.setBackgroundColor( Block.colors[ value.toString() ] )
    }

setBackgroundColor( color )
    {
    var g = this.backgroundElement.graphics;

    g.clear();
    g.beginFill( color );
    g.drawRoundRect( 0, 0, Block.size, Block.size, 3 );
    g.endFill();
    }
}