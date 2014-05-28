/// <reference path='../typings/tsd.d.ts' />
/// <reference path='main.ts' />

class Block
{
    value: number;
    column: number;
    line: number;

    backgroundElement;
    valueElement;
    containerElement;

    move: MoveAnimation.Move;

    static size = 50;
    static colors = {
        '2': 'rgb(243,243,241)',
        '4': 'rgb(192,243,241)',
        '8': 'rgb(243,177,241)',
        '16': 'rgb(243,163,138)',
        '32': 'rgb(164,170,118)',
        '64': 'rgb(123,181,230)',
        '128': 'rgb(197,255,183)',
        '256': 'rgb(241,113,153)',
        '512': 'rgb(255,243,191)',
        '1024': 'rgb(243,150,64)',
        '2048': 'rgb(116,108,255)'
    };


constructor( args )
    {
    this.column = args.column;
    this.line = args.line;

    this.setupShape();
    this.positionIn( this.column, this.line );

    this.move = new MoveAnimation.Move( this.containerElement );

    this.value = 0;
    this.setValue( args.value );
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
    var lineSize = G.GRID_LINE_SIZE;

    this.column = column;
    this.line = line;

    this.containerElement.x = (size + lineSize) * column;
    this.containerElement.y = (size + lineSize) * line;
    }

moveTo( column, line )
    {
    var size = Block.size;
    var lineSize = G.GRID_LINE_SIZE;

    this.column = column;
    this.line = line;

    this.move.start( (size + lineSize) * column, (size + lineSize) * line, 100 );
    }

setValue( value )
    {
    this.value = value;
    this.valueElement.text = value;

    this.setBackgroundColor( Block.colors[ value.toString() ] )
    }

setBackgroundColor( color )
    {
    var g = this.backgroundElement.graphics;

    g.clear();
    g.beginFill( color );
    g.drawRect( 0, 0, Block.size, Block.size );
    g.endFill();
    }

remove()
    {
    G.STAGE.removeChild( this.containerElement );
    }
}