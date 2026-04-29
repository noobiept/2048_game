import * as Engine from '@drk4/game-engine';
import {
    getBestVictoryTime as getConfigBestVictoryTime,
    saveVictoryTimeRecord,
    type HighScoreConfig,
    type HighScoreData
} from './high_score';

interface OptionsData {
    gridLength: number;
    spawnRange: number[];
}
type OptionsKey = 'gridLength' | 'spawnRange';

const BEST_VICTORY_TIMES_KEY = '2048_bestVictoryTimes';

let OPTIONS: OptionsData = {
    gridLength: 4,
    spawnRange: [2, 4]
};
let BEST_VICTORY_TIMES: HighScoreData = {};

function isOptionsData(value: unknown): value is OptionsData {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    const options = value as Record<string, unknown>;

    return (
        typeof options.gridLength === 'number' &&
        Array.isArray(options.spawnRange) &&
        options.spawnRange.length === 2 &&
        options.spawnRange.every((item) => typeof item === 'number')
    );
}

function isHighScoreData(value: unknown): value is HighScoreData {
    if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        return false;
    }

    return Object.entries(value).every(
        ([key, item]) => key.length > 0 && typeof item === 'number' && Number.isFinite(item)
    );
}

export function load(callback: () => void) {
    const options: unknown = Engine.Utilities.getObject('2048_options');
    const bestVictoryTimes: unknown = Engine.Utilities.getObject(BEST_VICTORY_TIMES_KEY);

    if (isOptionsData(options)) {
        OPTIONS = options;
    }

    if (isHighScoreData(bestVictoryTimes)) {
        BEST_VICTORY_TIMES = bestVictoryTimes;
    }

    callback();
}

export function setOption<Key extends OptionsKey>(key: Key, value: OptionsData[Key]) {
    OPTIONS[key] = value;
    saveOptions();
}

export function getOption(key: 'gridLength'): number;
export function getOption(key: 'spawnRange'): number[];
export function getOption(key: OptionsKey): number | number[] {
    return OPTIONS[key];
}

export function getBestVictoryTime(): number | null {
    return getConfigBestVictoryTime(BEST_VICTORY_TIMES, getCurrentHighScoreConfig());
}

export function saveVictoryTime(time: number): boolean {
    if (!saveVictoryTimeRecord(BEST_VICTORY_TIMES, getCurrentHighScoreConfig(), time)) {
        return false;
    }

    Engine.Utilities.saveObject(BEST_VICTORY_TIMES_KEY, BEST_VICTORY_TIMES);

    return true;
}

function getCurrentHighScoreConfig(): HighScoreConfig {
    return {
        gridLength: OPTIONS.gridLength,
        spawnRange: OPTIONS.spawnRange
    };
}

function saveOptions() {
    Engine.Utilities.saveObject('2048_options', OPTIONS);
}
