import { describe, expect, test } from 'vitest';
import { getSwipeDirection } from './input';

describe('swipe direction detection', () => {
    test('ignores gestures below the movement threshold', () => {
        expect(getSwipeDirection(29, 0)).toBeNull();
        expect(getSwipeDirection(0, -29)).toBeNull();
    });

    test.each([
        { offsetX: -40, offsetY: 5, direction: 'left' },
        { offsetX: 40, offsetY: -5, direction: 'right' },
        { offsetX: 5, offsetY: -40, direction: 'up' },
        { offsetX: -5, offsetY: 40, direction: 'down' }
    ])('detects $direction swipes', ({ offsetX, offsetY, direction }) => {
        expect(getSwipeDirection(offsetX, offsetY)).toBe(direction);
    });

    test('uses the dominant axis for diagonal gestures', () => {
        expect(getSwipeDirection(80, 30)).toBe('right');
        expect(getSwipeDirection(30, -80)).toBe('up');
    });
});
