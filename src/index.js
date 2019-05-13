const shallowlyCompareArrays = require('./shallowlyCompareArrays');


const effectMap = new Map();


/**
 * Throws a TypeError if condition isn't truthy.
 *
 * @param  {?any} condition  The result of a condition.
 * @param  {string} errorMessage  The error message to throw if `condition` is falsy.
 *
 * @return {void}
 */
function typeInvariant(condition, errorMessage) {
	if (!condition) {
		throw new TypeError(errorMessage);
	}
}


/**
 * Run a syncronous side effect any time dependencies change.
 *
 * @param  {any}       effectId      Unique ID of effect.
 * @param  {any[]}     dependencies  Effect dependencies.
 * @param  {Function}  effect        The effect to run.
 * @param  {?Function} comparator    Custom dependency comparison function. Called with two
 *                                   arguments: previous dependency array, and the current
 *                                   dependency array. Returns whether values should be
 *                                   considered equal. Only called when there are two dependency
 *                                   arrays to compare.
 *
 * @return {void}
 */
function runEffect(effectId, dependencies, effect, comparator=shallowlyCompareArrays) {
	typeInvariant(effectId, 'Must specify an effect identifier');
	typeInvariant(dependencies == null || Array.isArray(dependencies), '`dependencies` must an array, or null/undefined');
	typeInvariant(typeof effect === 'function', '`effect` must be a function');
	typeInvariant(typeof comparator === 'function', '`comparator` must be a function');

	const registeredEffect = effectMap.get(effectId);

	if (registeredEffect) {
		const prevDependencies = registeredEffect.dependencies;
		if (!prevDependencies || !dependencies || !comparator(prevDependencies, dependencies)) {
			effect();
			registeredEffect.dependencies = dependencies;
		}
	} else {
		effectMap.set(effectId, { dependencies });
		effect();
	}
}

module.exports = runEffect;
