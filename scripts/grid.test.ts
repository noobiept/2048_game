import { describe, expect, test, vi } from 'vitest';
import { Grid, GameStatus, getSpawnValues, type BlockLike } from './grid';

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
    } satisfies BlockLike;
}

function gridWith(blocks: ReturnType<typeof createBlock>[], length = 4) {
    const grid = new Grid(length);
    blocks.forEach((block) => grid.placeBlock(block));
    return grid;
}

describe('spawn values', () => {
    test('expands selected endpoints into powers of two', () => {
        expect(getSpawnValues([2, 32])).toEqual([2, 4, 8, 16, 32]);
    });

    test('keeps a single value range as one spawn value', () => {
        expect(getSpawnValues([8, 8])).toEqual([8]);
    });
});

describe('movement change detection', () => {
    const directions = [
        {
            name: 'left',
            move: (grid: Grid) => grid.moveLeft(),
            pinnedAt: { column: 0, line: 0 },
            mergeSurvivor: { column: 0, line: 0 },
            mergeConsumed: { column: 1, line: 0 }
        },
        {
            name: 'right',
            move: (grid: Grid) => grid.moveRight(),
            pinnedAt: { column: 3, line: 0 },
            mergeSurvivor: { column: 3, line: 0 },
            mergeConsumed: { column: 2, line: 0 }
        },
        {
            name: 'up',
            move: (grid: Grid) => grid.moveUp(),
            pinnedAt: { column: 0, line: 0 },
            mergeSurvivor: { column: 0, line: 0 },
            mergeConsumed: { column: 0, line: 1 }
        },
        {
            name: 'down',
            move: (grid: Grid) => grid.moveDown(),
            pinnedAt: { column: 0, line: 3 },
            mergeSurvivor: { column: 0, line: 3 },
            mergeConsumed: { column: 0, line: 2 }
        }
    ];

    test.each(directions)(
        '$name returns false and leaves the tile in place when nothing can move',
        ({ move, pinnedAt }) => {
            const block = createBlock(pinnedAt.column, pinnedAt.line);
            const grid = gridWith([block]);

            expect(move(grid)).toBe(false);
            expect(block.column).toBe(pinnedAt.column);
            expect(block.line).toBe(pinnedAt.line);
        }
    );

    test('left returns true when a tile slides', () => {
        const block = createBlock(1, 0);
        const grid = gridWith([block]);

        expect(grid.moveLeft()).toBe(true);
        expect(block.column).toBe(0);
        expect(block.line).toBe(0);
    });

    test.each(directions)(
        '$name returns true when adjacent tiles merge',
        ({ move, mergeSurvivor, mergeConsumed }) => {
            const survivor = createBlock(mergeSurvivor.column, mergeSurvivor.line);
            const consumed = createBlock(mergeConsumed.column, mergeConsumed.line);
            const grid = gridWith([survivor, consumed]);

            expect(move(grid)).toBe(true);
            expect(survivor.value).toBe(4);
            expect(consumed.remove).toHaveBeenCalledOnce();
        }
    );
});

describe('movement details', () => {
    test('moveLeft slides across gaps without changing the line', () => {
        const block = createBlock(3, 1);
        const grid = gridWith([block]);

        expect(grid.moveLeft()).toBe(true);
        expect(block.column).toBe(0);
        expect(block.line).toBe(1);
    });

    test('moveLeft merges each line independently in one call', () => {
        const topLeft = createBlock(0, 0);
        const topRight = createBlock(1, 0);
        const bottomLeft = createBlock(0, 2);
        const bottomRight = createBlock(1, 2);

        const grid = gridWith([topLeft, topRight, bottomLeft, bottomRight]);

        expect(grid.moveLeft()).toBe(true);
        expect(topLeft.value).toBe(4);
        expect(bottomLeft.value).toBe(4);
        expect(topRight.remove).toHaveBeenCalledOnce();
        expect(bottomRight.remove).toHaveBeenCalledOnce();
    });

    test('moveLeft merges the leftmost pair when three same-value tiles are present', () => {
        const left = createBlock(0, 0);
        const middle = createBlock(1, 0);
        const right = createBlock(2, 0);

        const grid = gridWith([left, middle, right]);

        expect(grid.moveLeft()).toBe(true);
        expect(left.value).toBe(4);
        expect(middle.remove).toHaveBeenCalledOnce();
        expect(right.value).toBe(2);
        expect(right.column).toBe(1);
    });

    test('moveLeft performs two non-overlapping merges in one row', () => {
        const a = createBlock(0, 0);
        const b = createBlock(1, 0);
        const c = createBlock(2, 0);
        const d = createBlock(3, 0);

        const grid = gridWith([a, b, c, d]);

        expect(grid.moveLeft()).toBe(true);
        expect(a.value).toBe(4);
        expect(a.column).toBe(0);
        expect(c.value).toBe(4);
        expect(c.column).toBe(1);
        expect(b.remove).toHaveBeenCalledOnce();
        expect(d.remove).toHaveBeenCalledOnce();
    });
});

describe('grid state queries', () => {
    test('hasEmptyCells is true on a fresh grid', () => {
        expect(new Grid(4).hasEmptyCells()).toBe(true);
    });

    test('hasEmptyCells is false when every cell holds a block', () => {
        const blocks = [];
        for (let column = 0; column < 2; column++) {
            for (let line = 0; line < 2; line++) {
                blocks.push(createBlock(column, line));
            }
        }

        expect(gridWith(blocks, 2).hasEmptyCells()).toBe(false);
    });

    test('getEmptyCells lists every cell of an empty grid', () => {
        const cells = new Grid(2).getEmptyCells();

        expect(cells).toHaveLength(4);
        expect(cells).toContainEqual({ column: 0, line: 0 });
        expect(cells).toContainEqual({ column: 0, line: 1 });
        expect(cells).toContainEqual({ column: 1, line: 0 });
        expect(cells).toContainEqual({ column: 1, line: 1 });
    });

    test('getEmptyCells excludes occupied cells', () => {
        const grid = gridWith([createBlock(0, 0)], 2);
        const cells = grid.getEmptyCells();

        expect(cells).toHaveLength(3);
        expect(cells).not.toContainEqual({ column: 0, line: 0 });
    });
});

describe('clear', () => {
    test('removes every block and leaves the grid empty', () => {
        const blocks = [createBlock(0, 0), createBlock(2, 1), createBlock(3, 3)];
        const grid = gridWith(blocks);

        grid.clear();

        blocks.forEach((block) => expect(block.remove).toHaveBeenCalledOnce());
        expect(grid.hasEmptyCells()).toBe(true);
        expect(grid.getEmptyCells()).toHaveLength(16);
    });
});

describe('hasGameEnded', () => {
    test('returns Victory when a 2048 tile is present', () => {
        const grid = gridWith([createBlock(0, 0, 2048)]);

        expect(grid.hasGameEnded()).toBe(GameStatus.Victory);
    });

    test('returns Ongoing while empty cells remain', () => {
        const grid = gridWith([createBlock(0, 0)]);

        expect(grid.hasGameEnded()).toBe(GameStatus.Ongoing);
    });

    test('returns Ongoing on a full grid that still has an adjacent matching pair', () => {
        const grid = gridWith(
            [
                createBlock(0, 0, 2),
                createBlock(0, 1, 2),
                createBlock(1, 0, 4),
                createBlock(1, 1, 8)
            ],
            2
        );

        expect(grid.hasGameEnded()).toBe(GameStatus.Ongoing);
    });

    test('returns Loss on a full grid with no possible merges', () => {
        const grid = gridWith(
            [
                createBlock(0, 0, 2),
                createBlock(0, 1, 4),
                createBlock(1, 0, 4),
                createBlock(1, 1, 2)
            ],
            2
        );

        expect(grid.hasGameEnded()).toBe(GameStatus.Loss);
    });

    //   pre-move      post-move      post-spawn
    //   2  4          _  4           2  4
    //   2  2    →     4  2     →     4  2
    test('returns Loss when a move opens a cell, the spawn fills it, and no merges remain', () => {
        const grid = gridWith(
            [
                createBlock(0, 0, 2),
                createBlock(1, 0, 4),
                createBlock(0, 1, 2),
                createBlock(1, 1, 2)
            ],
            2
        );

        grid.moveDown();
        expect(grid.hasGameEnded()).toBe(GameStatus.Ongoing);

        grid.placeBlock(createBlock(0, 0, 2));

        expect(grid.hasGameEnded()).toBe(GameStatus.Loss);
    });

    test('returns Victory when a move produces a 2048 tile', () => {
        const grid = gridWith(
            [
                createBlock(0, 0, 1024),
                createBlock(1, 0, 2),
                createBlock(0, 1, 1024),
                createBlock(1, 1, 4)
            ],
            2
        );

        grid.moveUp();

        expect(grid.hasGameEnded()).toBe(GameStatus.Victory);
    });
});
