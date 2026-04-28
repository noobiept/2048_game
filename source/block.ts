import * as Engine from '@drk4/game-engine';
import { GRID_LINE_SIZE } from './globals';

interface BlockArgs {
    column: number;
    line: number;
    value: number;
}

export class Block {
    value: number;
    column: number;
    line: number;

    backgroundElement!: Engine.Rectangle;
    valueElement!: Engine.Text;
    containerElement!: Engine.Container;

    static size = 70;
    static colors: Record<number, string> = {
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

    constructor(args: BlockArgs) {
        this.column = args.column;
        this.line = args.line;

        this.setupShape();
        this.positionIn(this.column, this.line);

        this.value = 0;
        this.setValue(args.value);

        this.containerElement.opacity = 0;
        new Engine.Tween(this.containerElement).to({ opacity: 1 }, 0.5).start();
    }

    setupShape(): void {
        const size = Block.size;
        const textSize = 30;

        const background = new Engine.Rectangle({
            x: 0,
            y: 0,
            width: size,
            height: size,
            color: Block.colors['2'],
            fill: true
        });

        const value = new Engine.Text({
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

        const container = new Engine.Container();

        container.addChild(background);
        container.addChild(value);

        Engine.getCanvas().addChild(container);

        this.backgroundElement = background;
        this.valueElement = value;
        this.containerElement = container;
    }

    positionIn(column: number, line: number): void {
        const size = Block.size;
        const lineSize = GRID_LINE_SIZE;

        this.column = column;
        this.line = line;

        this.containerElement.x = (size + lineSize) * column + size / 2;
        this.containerElement.y = (size + lineSize) * line + size / 2;
    }

    moveTo(column: number, line: number): void {
        const size = Block.size;
        const lineSize = GRID_LINE_SIZE;

        this.column = column;
        this.line = line;

        const x = (size + lineSize) * column + size / 2;
        const y = (size + lineSize) * line + size / 2;

        new Engine.Tween(this.containerElement).to({ x: x, y: y }, 0.1).start();
    }

    setValue(value: number): void {
        this.value = value;
        this.valueElement.text = String(value);

        this.setBackgroundColor(Block.colors[value] ?? Block.colors[2048]);
    }

    setBackgroundColor(color: string): void {
        this.backgroundElement.color = color;
    }

    remove(): void {
        new Engine.Tween(this.containerElement)
            .to({ opacity: 0 }, 0.2)
            .call(() => {
                this.containerElement.remove();
            })
            .start();
    }
}
