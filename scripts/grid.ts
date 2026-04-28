export interface BlockLike {
    column: number;
    line: number;
    value: number;
    setValue(value: number): void;
    moveTo(column: number, line: number): void;
    remove(): void;
}

export interface CellPosition {
    column: number;
    line: number;
}

export enum GameStatus {
    Ongoing = 0,
    Victory = 1,
    Loss = -1
}

export class Grid {
    readonly length: number;
    private cells: (BlockLike | null)[][];

    constructor(length: number) {
        this.length = length;
        this.cells = [];

        for (var column = 0; column < length; column++) {
            this.cells[column] = [];

            for (var line = 0; line < length; line++) {
                this.cells[column][line] = null;
            }
        }
    }

    placeBlock(block: BlockLike): void {
        this.cells[block.column][block.line] = block;
    }

    getEmptyCells(): CellPosition[] {
        var emptyCells: CellPosition[] = [];

        for (var column = 0; column < this.length; column++) {
            for (var line = 0; line < this.length; line++) {
                if (this.cells[column][line] === null) {
                    emptyCells.push({ column: column, line: line });
                }
            }
        }

        return emptyCells;
    }

    hasEmptyCells(): boolean {
        for (var column = 0; column < this.length; column++) {
            for (var line = 0; line < this.length; line++) {
                if (this.cells[column][line] === null) {
                    return true;
                }
            }
        }

        return false;
    }

    clear(): void {
        for (var column = 0; column < this.length; column++) {
            for (var line = 0; line < this.length; line++) {
                this.removeBlock(this.cells[column][line]);
            }
        }
    }

    moveLeft(): boolean {
        var moved = false;

        // combine: scan from the destination edge outward so the leftmost pair merges first.
        // a tile that just merged cannot merge again on the same move
        for (var line = 0; line < this.length; line++) {
            var firstBlock: BlockLike | null = null;

            for (var column = 0; column < this.length; column++) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (firstBlock === null) {
                        firstBlock = block;
                    } else {
                        if (firstBlock.value == block.value) {
                            firstBlock.setValue(firstBlock.value * 2);

                            this.removeBlock(block);
                            firstBlock = null;
                            moved = true;
                        } else {
                            firstBlock = block;
                        }
                    }
                }
            }
        }

        // count and move
        // loop in the opposite direction
        for (var line = 0; line < this.length; line++) {
            var position = 0;

            for (var column = position; column < this.length; column++) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (block.column !== position) {
                        moved = true;
                    }

                    this.moveBlock(block, position, line);

                    position++;
                }
            }
        }

        return moved;
    }

    moveRight(): boolean {
        var moved = false;

        // combine: scan from the destination edge outward so the rightmost pair merges first.
        // a tile that just merged cannot merge again on the same move
        for (var line = 0; line < this.length; line++) {
            var firstBlock: BlockLike | null = null;

            for (var column = this.length - 1; column >= 0; column--) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (firstBlock === null) {
                        firstBlock = block;
                    } else {
                        if (firstBlock.value == block.value) {
                            firstBlock.setValue(firstBlock.value * 2);

                            this.removeBlock(block);
                            firstBlock = null;
                            moved = true;
                        } else {
                            firstBlock = block;
                        }
                    }
                }
            }
        }

        // count and move
        // loop in the opposite direction
        for (var line = 0; line < this.length; line++) {
            var position = this.length - 1;

            for (var column = position; column >= 0; column--) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (block.column !== position) {
                        moved = true;
                    }

                    this.moveBlock(block, position, line);

                    position--;
                }
            }
        }

        return moved;
    }

    moveUp(): boolean {
        var moved = false;

        // combine: scan from the destination edge outward so the topmost pair merges first.
        // a tile that just merged cannot merge again on the same move
        for (var column = 0; column < this.length; column++) {
            var firstBlock: BlockLike | null = null;

            for (var line = 0; line < this.length; line++) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (firstBlock === null) {
                        firstBlock = block;
                    } else {
                        if (firstBlock.value == block.value) {
                            firstBlock.setValue(firstBlock.value * 2);

                            this.removeBlock(block);
                            firstBlock = null;
                            moved = true;
                        } else {
                            firstBlock = block;
                        }
                    }
                }
            }
        }

        // count and move
        // loop in the opposite direction
        for (var column = 0; column < this.length; column++) {
            var position = 0;

            for (var line = position; line < this.length; line++) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (block.line !== position) {
                        moved = true;
                    }

                    this.moveBlock(block, column, position);

                    position++;
                }
            }
        }

        return moved;
    }

    moveDown(): boolean {
        var moved = false;

        // combine: scan from the destination edge outward so the bottommost pair merges first.
        // a tile that just merged cannot merge again on the same move
        for (var column = 0; column < this.length; column++) {
            var firstBlock: BlockLike | null = null;

            for (var line = this.length - 1; line >= 0; line--) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (firstBlock === null) {
                        firstBlock = block;
                    } else {
                        if (firstBlock.value == block.value) {
                            firstBlock.setValue(firstBlock.value * 2);

                            this.removeBlock(block);
                            firstBlock = null;
                            moved = true;
                        } else {
                            firstBlock = block;
                        }
                    }
                }
            }
        }

        // count and move
        // loop in the opposite direction
        for (var column = 0; column < this.length; column++) {
            var position = this.length - 1;

            for (var line = position; line >= 0; line--) {
                var block = this.cells[column][line];

                if (block !== null) {
                    if (block.line !== position) {
                        moved = true;
                    }

                    this.moveBlock(block, column, position);

                    position--;
                }
            }
        }

        return moved;
    }

    /*
        - win:
            - when there's a block with a 2048 value

        - loose:
            - no more empty spaces and no adjacent blocks with the same value

        - returns:
            - 0 if game hasn't ended
            - 1 if ended in victory
            - -1 if ended in a loss
     */
    hasGameEnded(): GameStatus {
        for (var column = 0; column < this.length; column++) {
            for (var line = 0; line < this.length; line++) {
                var block = this.cells[column][line];

                if (block && block.value >= 2048) {
                    return GameStatus.Victory;
                }
            }
        }

        if (this.hasEmptyCells()) {
            return GameStatus.Ongoing;
        }

        var left, right, up, down;

        // the grid is all filled, need to check if there's adjacent blocks with the same value
        for (var column = 0; column < this.length; column++) {
            for (var line = 0; line < this.length; line++) {
                var block = this.cells[column][line];

                if (column <= 0) {
                    left = null;
                } else {
                    left = this.cells[column - 1][line];
                }

                if (column >= this.length - 1) {
                    right = null;
                } else {
                    right = this.cells[column + 1][line];
                }

                if (line <= 0) {
                    up = null;
                } else {
                    up = this.cells[column][line - 1];
                }

                if (line >= this.length - 1) {
                    down = null;
                } else {
                    down = this.cells[column][line + 1];
                }

                if (
                    (left && left.value == block!.value) ||
                    (right && right.value == block!.value) ||
                    (up && up.value == block!.value) ||
                    (down && down.value == block!.value)
                ) {
                    return GameStatus.Ongoing;
                }
            }
        }

        return GameStatus.Loss;
    }

    private removeBlock(block: BlockLike | null): void {
        if (block !== null) {
            this.cells[block.column][block.line] = null;
            block.remove();
        }
    }

    private moveBlock(block: BlockLike, newColumn: number, newLine: number): void {
        this.cells[block.column][block.line] = null;
        block.moveTo(newColumn, newLine);
        this.cells[newColumn][newLine] = block;
    }
}

export function getSpawnValues(range: number[]): number[] {
    var min = range[0];
    var max = range[1];
    var value = min;
    var possibleValues: number[] = [];

    while (value <= max) {
        possibleValues.push(value);

        value *= 2;
    }

    return possibleValues;
}
