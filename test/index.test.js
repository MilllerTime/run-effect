const runEffect = require('../src/index');

it('runs an effect function', () => {
	let ran = false;
	const effect = () => ran = true;
	runEffect(effect);
	expect(ran).toBe(true);
});
