## Summary

This is a Mine Sweeper game built by React components and a framework agnostic game core; it provides 2 game modes: Classic and Detonation

- Classic: win the game by opening all non-mine cells

- Detonation: win the game by opening all mine cells, with limited clicks

## Folders

Note for the folder naming: the `_` is a NextJS convention, it means the folder will not be recognized as a route so we can safely organize the contents

### \_components

Holding a set of UI components to build the game; they contain zero game logics so they can be easily composed

### \_game

Holding the framework agnostic game core; it has 1 `core` class to be the base of different game modes, and currently has 2 `mode` classes providing different game rules

The folder has the flexibility to be published independently and can be integrated with any display layer e.g. React or Vue or vanilla JS

### \_react_game

Holding the contents related to React layer including game config, hooks and some useful helpers

### \_utils

Holding the generic helpers for programming

### The routes

Here we have `/classic` and `/ignite` (a flawed naming for Detonation game mode), each of them holds a `page` component and is the display layer of the game; it integrates the corresponding game rules, displays UIs and manage user and UI states

Note for the `page` components: because `mode` classes are framework agnostic, so in some coditions, we need to handle React component rerender explicitly
