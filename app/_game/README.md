## Summary

This is a framework agnostic Mine Sweeper game; it can be published as a standalone package and can be integrated with any display layer e.g. React, Vue

### core.ts

The game core which includes fundamental Mine Sweeper logics

The game core is not designed to be "inherited" because we'd favor composition over inheritance, plus, the methods of core is designed to be composed/reused, not inherited/extended/overwritten

- Board: a Row size X Column size game board of Cells
- Cell: a single clickable square on the screen; here we split the management to two 2D arrays: mine data and state; mine data is generally numbers indicating how many mines are nearby the cell; state indicates if the cell is opened, flagged or closed
- Deploy mines: put X mines on the board
- Swap a mine cell with a non-mine cell: if we dont want a player to land on a mine with first click, use this method
- Open cell: open a single cell if has mines nearby, otherwise trigger a flood open from it
- Flag cell: toggle the cell state between flagged and closed
- Clear adjacent cells: open all 8 adjacent cells excluding flagged cells
- For 8 neighbors: a convenient 2D for loop to apply a predicate to all 8 neighbors of a cell

### /modes

`modes` classes can leverage the generic core APIs provided by `core` to build unique game rules

The classes should be aware of winning and losing the game, also expose APIs for running the game and pairing with user interactions

#### Classic mode

- Won: if all non-mine cells are opened
- Lost: if at least 1 mine cell is opened
- Clear adjacent cells when double clicking a cell which has enough adjacent flagged cells

#### Detonation mode

- Won: if all mine cells are opened
- Lost: if click count is less than remaining mine count
- Does not has the flag-cell feature so that user can also not double click the cell
