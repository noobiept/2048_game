interface MenuOptions {
    gridLength: number;
    spawnRange: number[];
    onGridLengthChange: (value: number) => void;
    onSpawnRangeChange: (min: number, max: number) => void;
}

export function init(options: MenuOptions) {
    initGridLength(options.gridLength, options.onGridLengthChange);
    initSpawnRange(options.spawnRange, options.onSpawnRangeChange);
}

function initGridLength(length: number, onChange: (value: number) => void) {
    const input = document.querySelector<HTMLInputElement>('#gridLength')!;
    const label = document.querySelector<HTMLElement>('#gridLengthLabel')!;

    input.value = String(length);
    label.textContent = String(length);

    input.addEventListener('input', () => {
        label.textContent = input.value;
    });

    input.addEventListener('change', () => {
        const value = Number(input.value);
        onChange(value);
    });
}

function initSpawnRange(range: number[], onChange: (min: number, max: number) => void) {
    const minInput = document.querySelector<HTMLInputElement>('#spawnRangeMin')!;
    const maxInput = document.querySelector<HTMLInputElement>('#spawnRangeMax')!;
    const fill = document.querySelector<HTMLElement>('#spawnRangeFill')!;
    const label = document.querySelector<HTMLElement>('#spawnRangeLabel')!;

    const values = [2, 4, 8, 16, 32];
    const trackMin = Number(minInput.min);
    const trackMax = Number(minInput.max);
    const trackSpan = trackMax - trackMin;

    minInput.value = String(values.indexOf(range[0]));
    maxInput.value = String(values.indexOf(range[1]));

    const updateUi = () => {
        const minIdx = Number(minInput.value);
        const maxIdx = Number(maxInput.value);
        label.textContent = '[ ' + values[minIdx] + ', ' + values[maxIdx] + ' ]';
        fill.style.left = ((minIdx - trackMin) / trackSpan) * 100 + '%';
        fill.style.right = ((trackMax - maxIdx) / trackSpan) * 100 + '%';
    };

    const commit = () => {
        const min = values[Number(minInput.value)];
        const max = values[Number(maxInput.value)];
        onChange(min, max);
    };

    minInput.addEventListener('input', () => {
        if (Number(minInput.value) > Number(maxInput.value)) {
            maxInput.value = minInput.value;
        }
        updateUi();
    });

    maxInput.addEventListener('input', () => {
        if (Number(maxInput.value) < Number(minInput.value)) {
            minInput.value = maxInput.value;
        }
        updateUi();
    });

    minInput.addEventListener('change', commit);
    maxInput.addEventListener('change', commit);

    updateUi();
}
