import { describe, expect, test, vi } from 'vitest';
import { __testing } from './game';

vi.mock('./data', () => ({
    getOption(key: string) {
        if (key === 'gridLength') {
            return 4;
        }

        if (key === 'spawnRange') {
            return [2, 4];
        }
    }
}));

function createEmptyGrid() {
    return Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => null));
}

function createBlock(column: number, line: number, value = 2) {
    return {
        column,
        line,
        value,
        setValue(nextValue: number) {
            this.value = nextValue;
        },
        moveTo(nextColumn: number, nextLine: number) {
            this.column = nextColumn;
            this.line = nextLine;
        },
        remove: vi.fn()
    };
}

function setGrid(blocks: ReturnType<typeof createBlock>[]) {
    const grid = createEmptyGrid();

    blocks.forEach((block) => {
        grid[block.column][block.line] = block;
    });

    __testing.setBlocks(grid);
}

describe('spawn values', () => {
    test('expands selected endpoints into powers of two', () => {
        expect(__testing.getSpawnValues([2, 32])).toEqual([2, 4, 8, 16, 32]);
    });

    test('keeps a single value range as one spawn value', () => {
        expect(__testing.getSpawnValues([8, 8])).toEqual([8]);
    });
});

describe('movement change detection', () => {
    const directions = [
        {
            name: 'left',
            move: () => __testing.moveLeft(),
            pinnedAt: { column: 0, line: 0 },
            mergeSurvivor: { column: 0, line: 0 },
            mergeConsumed: { column: 1, line: 0 }
        },
        {
            name: 'right',
            move: () => __testing.moveRight(),
            pinnedAt: { column: 3, line: 0 },
            mergeSurvivor: { column: 3, line: 0 },
            mergeConsumed: { column: 2, line: 0 }
        },
        {
            name: 'up',
            move: () => __testing.moveUp(),
            pinnedAt: { column: 0, line: 0 },
            mergeSurvivor: { column: 0, line: 0 },
            mergeConsumed: { column: 0, line: 1 }
        },
        {
            name: 'down',
            move: () => __testing.moveDown(),
            pinnedAt: { column: 0, line: 3 },
            mergeSurvivor: { column: 0, line: 3 },
            mergeConsumed: { column: 0, line: 2 }
        }
    ];

    test.each(directions)(
        '$name returns false and leaves the tile in place when nothing can move',
        ({ move, pinnedAt }) => {
            const block = createBlock(pinnedAt.column, pinnedAt.line);
            setGrid([block]);

            expect(move()).toBe(false);
            expect(block.column).toBe(pinnedAt.column);
            expect(block.line).toBe(pinnedAt.line);
        }
    );

    test('left returns true when a tile slides', () => {
        const block = createBlock(1, 0);
        setGrid([block]);

        expect(__testing.moveLeft()).toBe(true);
        expect(block.column).toBe(0);
        expect(block.line).toBe(0);
    });

    test.each(directions)(
        '$name returns true when adjacent tiles merge',
        ({ move, mergeSurvivor, mergeConsumed }) => {
            const survivor = createBlock(mergeSurvivor.column, mergeSurvivor.line);
            const consumed = createBlock(mergeConsumed.column, mergeConsumed.line);
            setGrid([survivor, consumed]);

            expect(move()).toBe(true);
            expect(survivor.value).toBe(4);
            expect(consumed.remove).toHaveBeenCalledOnce();
        }
    );
});
