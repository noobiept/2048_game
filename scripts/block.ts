/// <reference path='main.ts' />

class Block
{
    value: number;
    column: number;
    line: number;

    backgroundElement;
    valueElement;
    containerElement;

    static size = 70;
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

    this.value = 0;
    this.setValue( args.value );

    this.containerElement.alpha = 0;
    createjs.Tween.get( this.containerElement).to( { alpha: 1 }, 500 );
    }

setupShape()
    {
    var background = new createjs.Shape();
    var textSize = 30;
    var value = new createjs.Text( '', textSize + 'px monospace' );

    var size = Block.size;

    value.textAlign = 'center';
    value.x = size / 2;
    value.y = size / 2 - textSize / 2;

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

    var x = (size + lineSize) * column;
    var y = (size + lineSize) * line;

    createjs.Tween.get( this.containerElement ).to( { x: x, y: y }, 100 );
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
    var _this = this;

    createjs.Tween.get( this.containerElement ).to( { alpha: 0 }, 200 ).call( function()
        {
        G.STAGE.removeChild( _this.containerElement );
        });
    }
}
