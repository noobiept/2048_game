A sliding block puzzle game written in typescript.

Description
===========

- A grid with same value of column/lines (from 4 to 10).
- Arrows keys (or 'wasd' keys) to move all the blocks in a direction (left/right/up/down).
- If two tiles of the same number collide while moving, they will merge into a tile with the total value of the two.
- Tiles can only be merged once in each move.
- Every turn, a new tile randomly appears on an empty spot on the map, with a value of 2 or 4 (the values can be changed).
- When 2 tiles combine, we add the resulting value to the score.
- Game is won when a tile with a value of 2048 appears.
- Game ends when there's no more possible moves (no empty spaces, and no adjacent tiles with the same value).

Controls
========

Use the `arrow` keys or the `wasd` keys.

Libraries
=========

- typescript: `1.8`
- createjs
    - easelJS: `0.8`
    - tweenJS: `0.6`
- jquery: `2.2`
- jqueryUI: `1.11`
    - button
    - dialog
    - slider
    - flick theme
