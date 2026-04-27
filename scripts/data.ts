import * as Engine from '@drk4/game-engine';

interface OptionsData {
    gridLength: number;
    spawnRange: number[];
}
type OptionsKey = 'gridLength' | 'spawnRange';

var OPTIONS: OptionsData = {
    gridLength: 4,
    spawnRange: [2, 4]
};

export function load(callback: () => any) {
    var options = Engine.Utilities.getObject('2048_options');

    if (options) {
        OPTIONS = options;
    }

    callback();
}

export function setOption(key: OptionsKey, value: any) {
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
