export interface HighScoreConfig {
    gridLength: number;
    spawnRange: number[];
}

export type HighScoreData = Record<string, number>;

export function getHighScoreKey(config: HighScoreConfig): string {
    const spawnRange = [...config.spawnRange].sort((a, b) => a - b);

    return 'grid=' + config.gridLength + ';spawn=' + spawnRange[0] + '-' + spawnRange[1];
}

export function isVictoryTimeRecord(time: number, bestTime: number | null): boolean {
    return bestTime === null || time < bestTime;
}

export function getBestVictoryTime(
    highScores: HighScoreData,
    config: HighScoreConfig
): number | null {
    const bestVictoryTime = highScores[getHighScoreKey(config)];

    return bestVictoryTime ?? null;
}

export function saveVictoryTimeRecord(
    highScores: HighScoreData,
    config: HighScoreConfig,
    time: number
): boolean {
    const key = getHighScoreKey(config);
    const bestVictoryTime = highScores[key] ?? null;

    if (!isVictoryTimeRecord(time, bestVictoryTime)) {
        return false;
    }

    highScores[key] = time;

    return true;
}

export function formatVictoryTime(time: number): string {
    const totalTenths = Math.floor(time / 100);
    const tenths = totalTenths % 10;
    const totalSeconds = Math.floor(totalTenths / 10);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    if (hours > 0) {
        return hours + ':' + padTime(minutes) + ':' + padTime(seconds) + '.' + tenths;
    }

    if (minutes > 0) {
        return minutes + ':' + padTime(seconds) + '.' + tenths;
    }

    return seconds + '.' + tenths + 's';
}

function padTime(value: number): string {
    return String(value).padStart(2, '0');
}
