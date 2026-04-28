import * as Engine from '@drk4/game-engine';

interface OptionsData {
    gridLength: number;
    spawnRange: number[];
}
type OptionsKey = 'gridLength' | 'spawnRange';

let OPTIONS: OptionsData = {
    gridLength: 4,
    spawnRange: [2, 4]
};

function isOptionsData(value: unknown): value is OptionsData {
    if (value === null || typeof value !== 'object') {
        return false;
    }

    const options = value as Record<string, unknown>;

    return (
        typeof options.gridLength === 'number' &&
        Array.isArray(options.spawnRange) &&
        options.spawnRange.every((item) => typeof item === 'number')
    );
}

export function load(callback: () => void) {
    const options: unknown = Engine.Utilities.getObject('2048_options');

    if (isOptionsData(options)) {
        OPTIONS = options;
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

function saveOptions() {
    Engine.Utilities.saveObject('2048_options', OPTIONS);
}
