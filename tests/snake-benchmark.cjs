// Zero-delay comparison: node tests/snake-benchmark.cjs --games=20 --size=12 --baseline=HEAD
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { performance } = require('node:perf_hooks');

const options = Object.fromEntries(process.argv.slice(2).map(argument => argument.replace(/^--/, '').split('=')));
const games = Number(options.games || 10);
const boardSize = Number(options.size || 12);
const stopFill = Number(options['until-fill'] || 1);
assert.ok(Number.isSafeInteger(games) && games > 0);
assert.ok(Number.isInteger(boardSize) && boardSize >= 12 && boardSize <= 24);
assert.ok(stopFill > 0 && stopFill <= 1);
const root = path.resolve(__dirname, '..');

function benchmark(source, label) {
  let seed = 1;
  const math = Object.create(Math);
  math.random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  const start = source.indexOf('const SNAKE_MIN_SIZE =') >= 0
    ? source.indexOf('const SNAKE_MIN_SIZE =') : source.indexOf('const SNAKE_SIZE =');
  const end = source.indexOf('if (heroPhotoTrigger &&', start);
  assert.ok(start >= 0 && end > start);
  const game = new Function('Math', 'easterEggBoard', 'setInterval', 'clearInterval', `${source.slice(start, end)}
    return {
      reset: resetEasterGame,
      resize: typeof setSnakeBoardSize === 'function' ? setSnakeBoardSize : null,
      get target() { return SNAKE_TARGET_LENGTH; },
      step: stepSnakeGame,
      shortest: findShortestSnakePath,
      state: () => ({ body: snakeBody, food: snakeFood, plan: snakeAutoPlan, won: snakeWon, dead: snakeGameOver }),
    };`)(math, null, () => 1, () => {});
  const runs = [];
  const tickTimes = [];
  const started = performance.now();
  let maxAppleSteps = 0;
  const movesByFill = [0, 0, 0, 0];
  const shortestApplesByFill = [0, 0, 0, 0];
  const applesByFill = [0, 0, 0, 0];
  for (let first = 1; first <= games; first += 1) {
    seed = first;
    if (game.resize) game.resize(boardSize);
    else {
      assert.equal(boardSize, 12, 'This baseline only supports 12x12');
      game.reset();
    }
    let state = game.state();
    let steps = 0;
    let appleSteps = 0;
    while (!state.won && !state.dead && state.body.length < Math.ceil(game.target * stopFill) && steps < game.target * game.target) {
      const before = state;
      const budget = state.plan?.path.length;
      const fill = Math.min(3, Math.floor(before.body.length * 4 / game.target));
      const shortest = appleSteps === 0 ? game.shortest(before.body, before.food) : null;
      const tick = performance.now();
      game.step();
      tickTimes.push(performance.now() - tick);
      state = game.state();
      steps += 1;
      movesByFill[fill] += 1;
      if (appleSteps === 0) {
        applesByFill[fill] += 1;
        const plannedLength = state.body.length > before.body.length ? 1 : state.plan?.path.length + 1;
        if (shortest && plannedLength <= shortest.length) shortestApplesByFill[fill] += 1;
      }
      appleSteps += 1;
      maxAppleSteps = Math.max(maxAppleSteps, appleSteps);
      assert.ok(appleSteps < game.target, `Apple stalled: ${label}, seed=${first}, step=${steps}`);
      if (state.body.length > before.body.length) {
        appleSteps = 0;
        if (options.progress && state.body.length % 50 === 0) {
          console.log(JSON.stringify({ label, size: boardSize, seed: first, length: state.body.length,
            steps, seconds: Number(((performance.now() - started) / 1000).toFixed(1)) }));
        }
      }
      else if (budget && state.plan) {
        assert.ok(state.plan.path.length < budget, 'Food budget must decrease');
      }
    }
    assert.ok(!state.dead && state.body.length === Math.ceil(game.target * stopFill)
      && (stopFill < 1 || state.won), `Target not reached: ${label}, seed=${first}, steps=${steps}`);
    runs.push(steps);
  }
  const seconds = Number(((performance.now() - started) / 1000).toFixed(2));
  tickTimes.sort((a, b) => a - b);
  const result = {
    label, size: boardSize, games, stopFill, meanSteps: Number((runs.reduce((a, b) => a + b, 0) / games).toFixed(1)),
    longest: Math.max(...runs), maxAppleSteps, seconds,
    p99TickMs: Number(tickTimes[Math.floor(tickTimes.length * 0.99)].toFixed(2)),
    maxTickMs: Number(tickTimes[tickTimes.length - 1].toFixed(2)), runs,
    movesByFill, shortestApplesByFill, applesByFill,
  };
  console.log(JSON.stringify(result));
  return result;
}

if (require.main === module) {
  if (options.baseline) {
    const source = execFileSync('git', ['show', `${options.baseline}:scripts.js`], { cwd: root, encoding: 'utf8' });
    benchmark(source, options.baseline);
  }
  benchmark(fs.readFileSync(path.join(root, 'scripts.js'), 'utf8'), 'working-tree');
}

module.exports = { benchmark };
