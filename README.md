# run-effect

[![npm](https://img.shields.io/npm/v/run-effect.svg?style=flat-square)](https://www.npmjs.com/package/run-effect) [![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg?style=flat-square)](https://github.com/facebook/jest)

Declaratively run side effects only when dependencies change. Usable in any JavaScript code.

Currently runs effect functions syncronously.


## Install

```
npm install --save run-effect
```


## Usage

```
runEffect(
	effectId: any,
	dependencies: any[],
	effect: Function,
	comparator: ?Function
);
```

`runEffect` takes either 3 or 4 arguments:

- **effectId** gives an identity to the effect that will be run. This should be unique across your whole program. It can be type - a string, Symbol, or even an object reference. Just make sure the value is stable, or the effect will always run and a memory leak will be created.
- **dependencies** is an array of values that your effect relies on. The effect will always be run the first time, but on subsequent calls the elements of the given array will be compared to the values given previously and the effect will only be run if there are any differences.
- **effect** a function contain the actual effects to be executed.
- **comparitor [optional]** a function with the following signature: `(prevDependencies, dependencies) => Boolean` used to compare previous and current dependencies. Return `true` to avoid running the effect (no change) or `false` to indicate a change and run the effect. Defaults to a shallow array comparison.


## Examples

Log two values anytime either of them have changed:

```
runEffect('effect-name', [value1, value2], () => {
  console.log(value1, value2);
});
```

Respond to changes in browser width, but ignore any changes to height:

```
window.addEventListener('resize', () => {
	runEffect('resize', [window.innerWidth], handleWidthChange);
});
```


## Improvements

- Support running delayed effects, e.g. `runEffect.raf`, `runEffect.timeout`, `runEffect.microTask`. These should run only the latest effect at the scheduled time, not simply defer all effects (that's easy in user land).
- Support returning cleanup function from effects. Should be called anytime an effect is run after an effect with the cleanup function ran.
- Provide dev mode warnings if same identifier is reused across multiple call sites? Not sure if this is even something desireable in all cases.
- TypeScript types


This library is not a replacement for throttling/debouncing helpers or memoization helpers.


## Credit

React's `useEffect` hook inspired me to envision how the same model for controlling imperative syncronization (or other side effects) in React can be applied to arbitrary JavaScript programs.
