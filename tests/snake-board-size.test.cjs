const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const source = fs.readFileSync(path.join(__dirname, '..', 'scripts.js'), 'utf8');
const start = source.indexOf('const SNAKE_MIN_SIZE =');
const end = source.indexOf('if (heroPhotoTrigger &&', start);
assert.ok(start >= 0 && end > start);
const exportsSource = `return {
  resize: setSnakeBoardSize, reset: resetEasterGame, step: stepSnakeGame,
  simulatePath: simulateSnakePath, simulate: simulateSnakeMove, ordered: hasSnakeCycleOrder, direction: getDirectionBetween,
  safePath: findSafeSnakeFoodPath, pathCost: getSnakePathEdgeCost,
  get size() { return SNAKE_SIZE; }, get target() { return SNAKE_TARGET_LENGTH; },
  get cycleLength() { return SNAKE_CYCLE_LENGTH; }, get reserved() { return SNAKE_RESERVED_CELL; },
  get cycle() { return snakeHamiltonianCycle; }, get templates() { return SNAKE_CYCLE_TEMPLATES; },
  state: () => ({ body: snakeBody, food: snakeFood, dead: snakeGameOver, won: snakeWon, auto: snakeAutoSolve, plan: snakeAutoPlan }),
  arrange: (body, food, cycle) => {
    snakeBody = body; snakeFood = food; snakeGameOver = false; snakeWon = false; snakeAutoPlan = null;
    snakeHamiltonianCycle = cycle; snakeHamiltonianIndex = indexSnakeCycle(cycle);
    snakeDirection = getDirectionBetween(body[1], body[0]); snakeNextDirection = snakeDirection;
    snakeFoodPathCache.clear();
  },
};`;

function createGame(seed = 1) {
  const math = Object.create(Math);
  math.random = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 0x100000000;
  };
  return new Function('Math', 'easterEggBoard', 'setInterval', 'clearInterval',
    source.slice(start, end) + exportsSource)(math, null, () => 1, () => {});
}

function checkCycle(game, cycle) {
  assert.equal(cycle.length, game.cycleLength);
  assert.equal(new Set(cycle.map(p => p.y * game.size + p.x)).size, game.cycleLength);
  cycle.forEach((p, i) => {
    assert.ok(p.x >= 0 && p.x < game.size && p.y >= 0 && p.y < game.size);
    assert.notEqual(p.y * game.size + p.x, game.reserved);
    assert.ok(game.direction(p, cycle[(i + 1) % cycle.length]));
  });
}

function runBoard(size, seed) {
  const game = createGame(seed);
  game.resize(size);
  let state = game.state();
  let steps = 0;
  let appleSteps = 0;
  let maxAppleSteps = 0;
  const checked = new Map();
  while (!state.dead && !state.won && steps < game.target * game.target) {
    const before = state;
    const budget = before.plan?.path.length;
    game.step();
    state = game.state();
    steps += 1;
    appleSteps += 1;
    maxAppleSteps = Math.max(maxAppleSteps, appleSteps);
    assert.equal(state.dead, false, `size=${size}, seed=${seed}, step=${steps}`);
    assert.ok(appleSteps < game.target, `No tail-chasing loops: ${size}, step=${steps}`);
    if (state.body.length > before.body.length) appleSteps = 0;
    else if (budget) assert.ok(state.plan.path.length < budget, 'Certified food distance decreases');
    if (size % 2 && state.body.length < game.cycleLength) {
      assert.notEqual(state.food.y * size + state.food.x, game.reserved, 'Reserve the corner until the final apple');
    }
    if (state.plan) {
      let indices = checked.get(state.plan.cycle);
      if (!indices) {
        checkCycle(game, state.plan.cycle);
        indices = new Int16Array(game.target).fill(-1);
        state.plan.cycle.forEach((p, i) => { indices[p.y * size + p.x] = i; });
        checked.set(state.plan.cycle, indices);
      }
      // An unchanged plan only lost its already-verified first move. Recheck
      // the whole route when it is replaced, not once per remaining suffix.
      if (state.plan !== before.plan) {
        const landing = game.simulatePath(state.body, state.food, state.plan.path);
        assert.ok(landing, 'Complete pending route is collision-free');
        if (state.plan.finalCorner) assert.equal(landing.length, game.target);
        else assert.ok(game.ordered(landing, indices), 'Safe completion certificate after eating');
      }
    }
  }
  assert.equal(state.won, true, `size=${size}, seed=${seed} did not clear`);
  assert.equal(state.body.length, size * size);
  assert.equal(new Set(state.body.map(p => p.y * size + p.x)).size, size * size);
  assert.equal(state.food, null);
  return { size, seed, steps, maxAppleSteps };
}

if (isMainThread) {
  test('Size input beside Reset accepts all integers from 12 through 24', () => {
    const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    const group = html.match(/<div class="easter-reset-group">([\s\S]*?)<\/button>/)?.[1];
    assert.ok(group);
    const input = group.match(/<input\b[^>]*id="easter-size"[^>]*>/)?.[0];
    assert.ok(input);
    for (const attribute of ['type="number"', 'min="12"', 'max="24"', 'step="1"', 'required']) {
      assert.ok(input.includes(attribute));
    }
    assert.match(group, /id="easter-reset"/);
    assert.match(html, /Odd boards save one corner for the final apple/);
    assert.match(html, /奇數棋盤的自動模式會保留一個角落/);
  });

  test('Every integer size from 12 to 24 has valid tours, fresh indices and an ordered starting body', () => {
    const game = createGame();
    for (const size of [12, 24, 13, 23, 14, 22, 15, 21, 16, 20, 17, 19, 18, 12]) {
      assert.equal(game.resize(size), true);
      assert.equal(game.size, size);
      assert.equal(game.target, size * size);
      assert.equal(game.cycleLength, size * size - size % 2);
      assert.equal(game.state().plan, null);
      assert.equal(game.state().body.length, 3);
      assert.ok(game.ordered(game.state().body));
      game.templates.forEach(template => {
        checkCycle(game, template.cycle);
        template.cycle.forEach((p, i) => assert.equal(template.indices[p.y * size + p.x], i));
        if (size % 2) assert.equal(template.indices[game.reserved], -1);
      });
    }
  });

  test('Out-of-range, fractional and nonnumeric sizes do not change or reset the current game', () => {
    const game = createGame();
    game.resize(17);
    const before = game.state();
    for (const size of [11, 25, 12.5, NaN, Infinity, '18', null]) {
      assert.equal(game.resize(size), false);
      assert.equal(game.size, 17);
      assert.equal(game.state().body, before.body);
      assert.equal(game.state().food, before.food);
    }
  });

  test('An optimal route retains an optimal suffix as the tail moves, on odd and even boards', () => {
    const game = createGame();
    for (const size of [12, 13, 18, 23, 24]) {
      game.resize(size);
      const { cycle, indices } = game.templates[0];
      for (let sample = 0; sample < 8; sample += 1) {
        const head = Math.floor(sample * cycle.length / 8);
        for (const portion of [0.1, 0.5, 0.8]) {
          const length = Math.floor(cycle.length * portion);
          const body = Array.from({ length }, (_, i) => cycle[(head - i + cycle.length) % cycle.length]);
          const food = cycle[(head + Math.floor((cycle.length - length) * 0.8)) % cycle.length];
          const route = game.safePath(body, food, indices);
          assert.ok(route?.length);
          if (route.length < 2) continue;
          const moved = game.simulatePath(body, food, route.slice(0, 1));
          const suffix = route.slice(1);
          const searchedAgain = game.safePath(moved, food, indices);
          assert.equal(suffix.length, searchedAgain.length, `size=${size}`);
          assert.equal(game.pathCost(moved, suffix), game.pathCost(moved, searchedAgain));
        }
      }
    }
  });

  test('Batched route simulation matches individual moves at every board size', () => {
    const game = createGame();
    let seed = 983;
    const random = n => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed % n;
    };
    let successes = 0;
    let collisions = 0;
    for (let size = 12; size <= 24; size += 1) {
      game.resize(size);
      const cycle = game.cycle;
      for (let sample = 0; sample < 200; sample += 1) {
        const head = random(cycle.length);
        const length = 3 + random(cycle.length - 3);
        const body = Array.from({ length }, (_, i) => cycle[(head - i + cycle.length) % cycle.length]);
        const original = JSON.stringify(body);
        const food = sample % 5 ? cycle[random(cycle.length)] : null;
        let route;
        if (sample % 2) {
          route = Array.from({ length: random(30) }, () => ['up', 'right', 'down', 'left'][random(4)]);
        } else {
          route = Array.from({ length: random(50) }, (_, i) => game.direction(cycle[(head + i) % cycle.length], cycle[(head + i + 1) % cycle.length]));
        }
        let expected = body;
        for (const direction of route) {
          expected = game.simulate(expected, direction, food)?.body ?? null;
          if (!expected) break;
        }
        assert.deepEqual(game.simulatePath(body, food, route), expected);
        assert.equal(JSON.stringify(body), original, 'Do not mutate a live game during lookahead');
        if (expected) successes += 1;
        else collisions += 1;
      }
    }
    assert.ok(successes > 500 && collisions > 500);
  });

  test('Odd-board final corner is safely reached from every head position on a full 13x13 tour', () => {
    const game = createGame();
    game.resize(13);
    const cycle = game.cycle;
    for (let head = 0; head < cycle.length; head += 1) {
      const body = Array.from({ length: cycle.length }, (_, i) => cycle[(head - i + cycle.length) % cycle.length]);
      game.arrange(body, { x: 12, y: 12 }, cycle);
      let steps = 0;
      while (!game.state().won && !game.state().dead && steps++ < cycle.length) game.step();
      assert.equal(game.state().dead, false);
      assert.equal(game.state().won, true, `head=${head}`);
      assert.equal(game.state().body.length, 169);
      assert.deepEqual(game.state().body[0], { x: 12, y: 12 });
    }
  });

  test('Reset and Enter resize the rendered grid; editing the size does not steer the snake', () => {
    const elements = new Map();
    const listeners = new Map();
    function element() {
      const classes = new Set();
      const properties = new Map();
      return {
        children: [], attributes: new Map(), value: '', textContent: '',
        set innerHTML(value) { this.children = []; this.html = value; },
        setAttribute(name, value) { this.attributes.set(name, String(value)); },
        appendChild(child) { this.children.push(child); },
        addEventListener(name, callback) { this[name] = callback; },
        style: { setProperty: (key, value) => properties.set(key, String(value)), removeProperty: key => properties.delete(key), properties },
        classList: { add: (...names) => names.forEach(n => classes.add(n)), remove: (...names) => names.forEach(n => classes.delete(n)), contains: n => classes.has(n), toggle: (n, on) => on ? classes.add(n) : classes.delete(n) },
        reportValidity() { return this.value.trim() !== '' && Number.isInteger(Number(this.value)) && Number(this.value) >= 12 && Number(this.value) <= 24; },
      };
    }
    const document = {
      getElementById(id) { if (!elements.has(id)) elements.set(id, element()); return elements.get(id); },
      querySelectorAll: () => [], createElement: element,
      addEventListener: (name, callback) => listeners.set(name, callback),
    };
    document.getElementById('easter-size').value = '12';
    let timers = new Set();
    let timer = 0;
    const uiStart = source.indexOf('const easterEggBackdrop =');
    const uiEnd = source.indexOf('/* ---------------- Sticky Nav State', uiStart);
    const game = new Function('document', 'setInterval', 'clearInterval', 'currentLang', 'trackEvent', 'bodyElement', 'modalBackdrop',
      source.slice(uiStart, uiEnd) + exportsSource)(document, () => { timers.add(++timer); return timer; }, id => timers.delete(id), 'en', () => {}, element(), null);
    elements.get('hero-photo-trigger').click();
    const input = elements.get('easter-size');
    const board = elements.get('easter-board');
    const reset = elements.get('easter-reset');
    input.value = '24'; input.input();
    assert.equal(elements.get('easter-size-mirror').textContent, '24');
    assert.equal(game.size, 12, 'Wait for Reset or Enter before replacing a live board');
    reset.click();
    assert.equal(board.children.length, 576);
    assert.equal(board.style.properties.get('--snake-size'), '24');
    assert.equal(board.attributes.get('aria-rowcount'), '24');
    assert.equal(board.attributes.get('aria-colcount'), '24');
    assert.match(elements.get('easter-score').textContent, /3 \/ 576/);
    assert.equal(timers.size, 1, 'Do not leave an old game loop running after resizing');
    input.value = '13'; input.input(); input.keydown({ key: 'Enter', preventDefault() {} });
    assert.equal(game.size, 13);
    assert.equal(board.children.length, 169);
    listeners.get('keydown')({ target: input, key: 'ArrowUp', code: 'ArrowUp' });
    assert.equal(game.state().auto, true, 'Number input arrow keys must not switch to manual play');
    input.value = '25'; reset.click();
    assert.equal(game.size, 13);
    assert.equal(board.children.length, 169);
    input.value = '12'; input.input(); reset.click();
    assert.equal(game.size, 12);
    assert.equal(board.children.length, 144, 'Remove all stale cells when shrinking the board');
    assert.equal(timers.size, 1);
  });

  test('Every supported size clears the whole board in zero-delay headless games', async () => {
    const pending = Array.from({ length: 13 }, (_, i) => ({ size: i + 12, seed: 1 }));
    const results = [];
    async function runWorker() {
      while (pending.length) {
        const task = pending.shift();
        const result = await new Promise((resolve, reject) => {
          const worker = new Worker(__filename, { workerData: task });
          worker.once('message', resolve);
          worker.once('error', reject);
          worker.once('exit', code => { if (code) reject(new Error(`Worker exited ${code}`)); });
        });
        results.push(result);
        console.log(JSON.stringify(result));
      }
    }
    await Promise.all(Array.from({ length: 4 }, runWorker));
    results.sort((a, b) => a.size - b.size);
    console.log(JSON.stringify({ boardSizes: results }));
    assert.equal(results.length, 13);
  });
} else {
  parentPort.postMessage(runBoard(workerData.size, workerData.seed));
}
