import * as Engine from '@drk4/game-engine';
import * as Data from './data';
import * as Game from './game';

window.onload = function () {
    Data.load(initGame);
};

function initGame() {
    const container = document.querySelector<HTMLElement>('#Canvas')!;
    Engine.init(container, 1, 1);

    Game.init();
}
