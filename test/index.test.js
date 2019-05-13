const runEffect = require('../src/index');


let _currentId = 0;
function getId() {
	return ++_currentId;
}


it('always runs effect on first invokation', () => {
	const effect1 = jest.fn();
	const effect2 = jest.fn();
	const effect3 = jest.fn();
	runEffect(getId(), null, effect1);
	runEffect(getId(), [], effect2);
	runEffect(getId(), ['dep'], effect3);
	expect(effect1).toHaveBeenCalled();
	expect(effect2).toHaveBeenCalled();
	expect(effect3).toHaveBeenCalled();
});


it('always runs effect with no dependency array', () => {
	const effectId = getId();
	const effect = jest.fn();

	runEffect(effectId, null, effect);
	runEffect(effectId, null, effect);
	runEffect(effectId, null, effect);

	expect(effect).toHaveBeenCalledTimes(3);
});


it('only runs effect once with empty dependency array', () => {
	const effectId = getId();
	const effect = jest.fn();

	runEffect(effectId, [], effect);
	runEffect(effectId, [], effect);
	runEffect(effectId, [], effect);

	expect(effect).toHaveBeenCalledTimes(1);
});


it('only runs effect once with unchanging dependencies', () => {
	const effectId = getId();
	const effect = jest.fn();

	runEffect(effectId, ['dep1', 42], effect);
	runEffect(effectId, ['dep1', 42], effect);
	runEffect(effectId, ['dep1', 42], effect);

	expect(effect).toHaveBeenCalledTimes(1);
});


it('handles switching from no dependency array to an empty dependency array', () => {
	const effectId = getId();
	const effect = jest.fn();

	// Runs once initially
	runEffect(effectId, [], effect);
	expect(effect).toHaveBeenCalledTimes(1);
	// Runs when switching to no dependency array
	runEffect(effectId, null, effect);
	expect(effect).toHaveBeenCalledTimes(2);
	// Runs again, because that's what it does with no dependency array
	runEffect(effectId, null, effect);
	expect(effect).toHaveBeenCalledTimes(3);
	// Runs when switching back to a dependency array, even if empty
	runEffect(effectId, [], effect);
	expect(effect).toHaveBeenCalledTimes(4);
	// Does not run when keeping same dependency array
	runEffect(effectId, [], effect);
	expect(effect).toHaveBeenCalledTimes(4);
});


it('runs effect when any dependencies change', () => {
	// Note: this isn't tested very extensively, because it would just be testing
	// `shallowlyCompareArrays` functionality. There are already tests for that.
	// This test just ensures we're using `shallowlyCompareArrays`.

	const effectId = getId();
	const effect = jest.fn();

	// Runs once initially
	runEffect(effectId, [1, 2, 3], effect);
	expect(effect).toHaveBeenCalledTimes(1);
	// No change - does not run
	runEffect(effectId, [1, 2, 3], effect);
	expect(effect).toHaveBeenCalledTimes(1);
	// New addition - run
	runEffect(effectId, [1, 2, 3, 4], effect);
	expect(effect).toHaveBeenCalledTimes(2);
	// No change - does not run
	runEffect(effectId, [1, 2, 3, 4], effect);
	expect(effect).toHaveBeenCalledTimes(2);
	// Change - run
	runEffect(effectId, [1, 2, 5, 4], effect);
	expect(effect).toHaveBeenCalledTimes(3);
});


it('always runs latest effect function', () => {
	const effectId = getId();
	const effect1 = jest.fn();
	const effect2 = jest.fn();
	const effect3 = jest.fn();

	runEffect(effectId, [1, 2], effect1);
	runEffect(effectId, [1, 2], effect2);
	runEffect(effectId, [1, 3], effect3);

	expect(effect1).toHaveBeenCalledTimes(1);
	expect(effect2).not.toHaveBeenCalled();
	expect(effect3).toHaveBeenCalledTimes(1);
});


it('can use custom comparitor', () => {
	const effectId = getId();
	const effect = jest.fn();
	// Custom comparitor expects a single dependency and only reports a change if the
	// value changes by 10 or more.
	const comparitor = jest.fn((prevDeps, deps) => {
		return Math.abs(deps[0] - prevDeps[0]) < 10;
	});

	// Runs once initially
	runEffect(effectId, [0], effect, comparitor);
	expect(effect).toHaveBeenCalledTimes(1);
	// Should not run so long as value changes by less than 10.
	runEffect(effectId, [2], effect, comparitor);
	runEffect(effectId, [-5], effect, comparitor);
	runEffect(effectId, [9], effect, comparitor);
	expect(effect).toHaveBeenCalledTimes(1);
	// Changing value by 10 or more should run effect.
	runEffect(effectId, [10], effect, comparitor);
	expect(effect).toHaveBeenCalledTimes(2);
	runEffect(effectId, [15], effect, comparitor);
	expect(effect).toHaveBeenCalledTimes(2);
	runEffect(effectId, [20], effect, comparitor);
	expect(effect).toHaveBeenCalledTimes(3);
});
