import * as Engine from '@drk4/game-engine';
import { GRID_LINE_SIZE } from './globals';

export class Block
{
    value: number;
    column: number;
    line: number;

    backgroundElement: Engine.Rectangle;
    valueElement: Engine.Text;
    containerElement: Engine.Container;

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

    this.containerElement.opacity = 0;
    new Engine.Tween( this.containerElement ).to( { opacity: 1 }, 0.5 ).start();
    }

setupShape()
    {
    var size = Block.size;
    var textSize = 30;

    var background = new Engine.Rectangle({
            x: 0,
            y: 0,
            width: size,
            height: size,
            color: Block.colors[ '2' ],
            fill: true
        });

    var value = new Engine.Text({
            x: 0,
            y: 0,
            text: '',
            fontSize: textSize,
            fontFamily: 'monospace',
            textAlign: 'center',
            textBaseline: 'middle',
            color: 'black',
            fill: true
        });

    var container = new Engine.Container();

    container.addChild( background );
    container.addChild( value );

    Engine.getCanvas().addChild( container );

    this.backgroundElement = background;
    this.valueElement = value;
    this.containerElement = container;
    }

positionIn( column, line )
    {
    var size = Block.size;
    var lineSize = GRID_LINE_SIZE;

    this.column = column;
    this.line = line;

    this.containerElement.x = (size + lineSize) * column + size / 2;
    this.containerElement.y = (size + lineSize) * line + size / 2;
    }

moveTo( column, line )
    {
    var size = Block.size;
    var lineSize = GRID_LINE_SIZE;

    this.column = column;
    this.line = line;

    var x = (size + lineSize) * column + size / 2;
    var y = (size + lineSize) * line + size / 2;

    new Engine.Tween( this.containerElement ).to( { x: x, y: y }, 0.1 ).start();
    }

setValue( value )
    {
    this.value = value;
    this.valueElement.text = String( value );

    this.setBackgroundColor( Block.colors[ value.toString() ] )
    }

setBackgroundColor( color )
    {
    this.backgroundElement.color = color;
    }

remove()
    {
    var _this = this;

    new Engine.Tween( this.containerElement ).to( { opacity: 0 }, 0.2 ).call( function()
        {
        _this.containerElement.remove();
        }).start();
    }
}
