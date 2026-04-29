const SWIPE_THRESHOLD = 30;

export type Direction = 'left' | 'right' | 'up' | 'down';

export function getSwipeDirection(offsetX: number, offsetY: number): Direction | null {
    if (Math.max(Math.abs(offsetX), Math.abs(offsetY)) < SWIPE_THRESHOLD) {
        return null;
    }

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
        return offsetX > 0 ? 'right' : 'left';
    }

    return offsetY > 0 ? 'down' : 'up';
}
