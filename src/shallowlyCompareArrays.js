/**
 * Checks if two arrays are shallowly equal, defined as:
 * - Having the same .length
 * - All top-level elements are equal according to `Object.is`, and are in the same order
 *
 * Note this also returns true for non-arrays, as long as the values are strictly equal.
 *
 * @param  {any[]} a - first array to compare
 * @param  {any[]} b - second array to compare
 *
 * @return {boolean} - true if given values are considered equal
 */
function shallowlyCompareArrays(a, b) {
	// Because this function is purpose built for `runEffect`, which will always be comparing
	// two different arrays, there is no need to first check referential equality as an
	// optimization. It just isn't needed.

	// Check length and then top-level elements
	if (a.length === b.length) {
		// For loop so we can return early
		for (let i = a.length - 1; i >= 0; i--) {
			// If any element pair isn't equal, arrays aren't equal
			if (!Object.is(a[i], b[i])) {
				return false;
			}
		}

		// If loop wasn't broken, values are shallowly equal
		return true;
	}

	// At this point, values are not equal
	return false;
}

module.exports = shallowlyCompareArrays;
