import { describe, expect, test } from 'vitest';
import {
    formatVictoryTime,
    getBestVictoryTime,
    getHighScoreKey,
    isVictoryTimeRecord,
    saveVictoryTimeRecord,
    type HighScoreData
} from './high_score';

describe('high score keys', () => {
    test('builds a key from the game configuration', () => {
        expect(getHighScoreKey({ gridLength: 4, spawnRange: [2, 4] })).toBe('grid=4;spawn=2-4');
    });

    test('normalizes the spawn range order', () => {
        expect(getHighScoreKey({ gridLength: 5, spawnRange: [32, 8] })).toBe('grid=5;spawn=8-32');
    });
});

describe('victory time records', () => {
    test('accepts the first victory time as a record', () => {
        expect(isVictoryTimeRecord(45_000, null)).toBe(true);
    });

    test('accepts a lower victory time as a new record', () => {
        expect(isVictoryTimeRecord(30_000, 45_000)).toBe(true);
    });

    test('rejects equal or slower victory times', () => {
        expect(isVictoryTimeRecord(45_000, 45_000)).toBe(false);
        expect(isVictoryTimeRecord(60_000, 45_000)).toBe(false);
    });
});

describe('configuration high scores', () => {
    test('returns null when the current configuration has no record', () => {
        const highScores: HighScoreData = {
            'grid=4;spawn=2-4': 45_000
        };

        expect(getBestVictoryTime(highScores, { gridLength: 5, spawnRange: [2, 4] })).toBeNull();
    });

    test('stores records separately per configuration', () => {
        const highScores: HighScoreData = {};

        expect(
            saveVictoryTimeRecord(highScores, { gridLength: 4, spawnRange: [2, 4] }, 45_000)
        ).toBe(true);
        expect(
            saveVictoryTimeRecord(highScores, { gridLength: 5, spawnRange: [2, 4] }, 60_000)
        ).toBe(true);

        expect(getBestVictoryTime(highScores, { gridLength: 4, spawnRange: [2, 4] })).toBe(45_000);
        expect(getBestVictoryTime(highScores, { gridLength: 5, spawnRange: [2, 4] })).toBe(60_000);
    });

    test('does not overwrite a configuration record with equal or slower times', () => {
        const highScores: HighScoreData = {
            'grid=4;spawn=2-4': 45_000
        };

        expect(
            saveVictoryTimeRecord(highScores, { gridLength: 4, spawnRange: [2, 4] }, 45_000)
        ).toBe(false);
        expect(
            saveVictoryTimeRecord(highScores, { gridLength: 4, spawnRange: [2, 4] }, 60_000)
        ).toBe(false);

        expect(getBestVictoryTime(highScores, { gridLength: 4, spawnRange: [2, 4] })).toBe(45_000);
    });

    test('overwrites a configuration record with a faster time', () => {
        const highScores: HighScoreData = {
            'grid=4;spawn=2-4': 45_000
        };

        expect(
            saveVictoryTimeRecord(highScores, { gridLength: 4, spawnRange: [2, 4] }, 30_000)
        ).toBe(true);

        expect(getBestVictoryTime(highScores, { gridLength: 4, spawnRange: [2, 4] })).toBe(30_000);
    });
});

describe('victory time formatting', () => {
    test('keeps one decimal digit for seconds', () => {
        expect(formatVictoryTime(49_900)).toBe('49.9s');
        expect(formatVictoryTime(50_000)).toBe('50.0s');
        expect(formatVictoryTime(50_100)).toBe('50.1s');
    });

    test('keeps one decimal digit for longer times', () => {
        expect(formatVictoryTime(61_200)).toBe('1:01.2');
        expect(formatVictoryTime(3_661_200)).toBe('1:01:01.2');
    });
});
