const shallowlyCompareArrays = require('../src/shallowlyCompareArrays');

test('empty arrays are considered equal', () => {
	expect(shallowlyCompareArrays(
		[],
		[]
	)).toBe(true);
});

test('arrays with same values are considered equal', () => {
	expect(shallowlyCompareArrays(
		[1, 2, 3],
		[1, 2, 3]
	)).toBe(true);

	expect(shallowlyCompareArrays(
		['bunnies', 'sunshine'],
		['bunnies', 'sunshine']
	)).toBe(true);
});

test('NaN values are considered equal', () => {
	expect(shallowlyCompareArrays(
		[NaN],
		[NaN]
	)).toBe(true);
});

test('an empty array and an array with a falsy value are not equal', () => {
	expect(shallowlyCompareArrays(
		[''],
		[]
	)).toBe(false);
});

test('two arrays with different but falsy values are not equal', () => {
	expect(shallowlyCompareArrays(
		[false],
		[0]
	)).toBe(false);
});

test('an array with an extra element is considered different', () => {
	expect(shallowlyCompareArrays(
		[1, 2, 3],
		[1, 2, 3, 4]
	)).toBe(false);
});

test('an array with swapped elements is considered different', () => {
	expect(shallowlyCompareArrays(
		[1, 2, 3],
		[1, 3, 2]
	)).toBe(false);
});

test('-0 is not equal to +0', () => {
	expect(shallowlyCompareArrays(
		[-0],
		[0]
	)).toBe(false);
});
