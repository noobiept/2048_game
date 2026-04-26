export interface Global {
    CANVAS: HTMLCanvasElement;
    STAGE: any;
    GRID_LINE_SIZE: number;
}

export const G: Global = {
    CANVAS: null!,
    STAGE: null!,
    GRID_LINE_SIZE: 2,
};
