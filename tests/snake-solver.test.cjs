// Run with: node --test tests/snake-solver.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const { availableParallelism } = require('node:os');

const source = fs.readFileSync(path.join(__dirname, '..', 'scripts.js'), 'utf8');
const start = source.indexOf('const SNAKE_MIN_SIZE =');
const end = source.indexOf('if (heroPhotoTrigger &&', start);
assert.ok(start >= 0 && end > start, 'Load the actual game implementation');
let randomState = 1;
const seededMath = Object.create(Math);
seededMath.random = () => {
  randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
  return randomState / 0x100000000;
};
const game = new Function('Math', 'easterEggBoard', 'setInterval', 'clearInterval', `${source.slice(start, end)}
  return ({
    size: SNAKE_TARGET_LENGTH,
    threshold: Math.floor(SNAKE_TARGET_LENGTH * 0.8),
    get cycle() { return snakeHamiltonianCycle; },
    baseCycle: SNAKE_HAMILTONIAN_CYCLE,
    templates: SNAKE_CYCLE_TEMPLATES,
    start: SNAKE_START,
    ordered: hasSnakeCycleOrder,
    simulate: simulateSnakeMove,
    direction: getDirectionBetween,
    color: getSnakeSegmentColor,
    next: getAutoSolveDirection,
    shortest: findShortestSnakePath,
    alternatives: findShortestSnakeAlternatives,
    certify: certifySnakeFoodPath,
    safePlan: findSafeSnakeFoodPlan,
    safePath: findSafeSnakeFoodPath,
    firstStepPlan: findSafeSnakeFirstStepPlan,
    shortcut: shortcutSnakeFoodPlan,
    tailShortcut: findSnakeTailShortcutPlan,
    tailGap: getSnakeTailGap,
    compactCycle: compactSnakeCompletionCycle,
    approachPlan: findSnakeFoodApproachPlan,
    setPlan: (path, cycle) => { snakeAutoPlan = { path: [...path], cycle }; },
    completeCycle: buildSnakeCompletionCycle,
    simulatePath: simulateSnakePath,
    setFood: (food) => { snakeFood = food; snakeAutoPlan = null; snakeFoodPathCache.clear(); },
    step: stepSnakeGame,
    reset: resetEasterGame,
    state: () => ({ body: snakeBody, food: snakeFood, won: snakeWon, dead: snakeGameOver, auto: snakeAutoSolve, plan: snakeAutoPlan }),
    arrange: (body, food, direction = null, cycle = SNAKE_HAMILTONIAN_CYCLE) => {
      snakeBody = body.map(cloneSegment);
      snakeFood = food && cloneSegment(food);
      snakeDirection = direction || getDirectionBetween(body[1], body[0]) || 'right';
      snakeNextDirection = snakeDirection;
      snakeAutoSolve = true;
      snakeGameOver = false;
      snakeWon = false;
      snakeAutoPlan = null;
      snakeFoodPathCache.clear();
      snakeHamiltonianCycle = cycle;
      snakeHamiltonianIndex = indexSnakeCycle(snakeHamiltonianCycle);
    },
    cycleIndex: getCycleIndex,
    cycleDistance: getCycleDistance,
  })`)(seededMath, null, () => 1, () => {});

function checkBody(body) {
  assert.equal(new Set(body.map(({ x, y }) => `${x},${y}`)).size, body.length, 'No self-overlap');
  for (let i = 1; i < body.length; i += 1) {
    assert.equal(Math.abs(body[i].x - body[i - 1].x) + Math.abs(body[i].y - body[i - 1].y), 1, 'Body stays connected');
  }
}

function checkCycle(cycle) {
  assert.equal(cycle.length, 144);
  assert.equal(new Set(cycle.map(({ x, y }) => `${x},${y}`)).size, 144);
  cycle.forEach((point, i) => assert.ok(game.direction(point, cycle[(i + 1) % 144]), 'Every cycle edge is adjacent'));
}

const referenceNeighbors = Array.from({ length: 144 }, (_, id) => {
  const x = id % 12;
  const y = Math.floor(id / 12);
  const neighbors = [];
  if (y > 0) neighbors.push(id - 12);
  if (x < 11) neighbors.push(id + 1);
  if (y < 11) neighbors.push(id + 12);
  if (x > 0) neighbors.push(id - 1);
  return neighbors;
});

function referenceBfs(body, target, order = 0, metrics = null) {
  const start = body[0].y * 12 + body[0].x;
  const end = target.y * 12 + target.x;
  const blocked = new Uint8Array(144);
  body.slice(1, -1).forEach(p => { blocked[p.y * 12 + p.x] = 1; });
  const parents = new Int16Array(144).fill(-1);
  const queue = [start];
  parents[start] = start;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor];
    if (metrics) metrics.expanded = (metrics.expanded || 0) + 1;
    if (id === end) {
      const points = [];
      for (let cell = end; cell !== start; cell = parents[cell]) points.push({ x: cell % 12, y: Math.floor(cell / 12) });
      points.reverse();
      return points.map((p, i) => game.direction(i ? points[i - 1] : body[0], p));
    }
    const neighbors = referenceNeighbors[id];
    for (let offset = 0; offset < neighbors.length; offset += 1) {
      const next = neighbors[(offset + order) % neighbors.length];
      if (parents[next] !== -1 || (blocked[next] && next !== end)) continue;
      parents[next] = id;
      queue.push(next);
    }
  }
  return null;
}

function edgeDepth({ x, y }) {
  return Math.min(x, y, 11 - x, 11 - y);
}

function routeEdgeCost(start, route) {
  const offsets = { up: [0, -1], right: [1, 0], down: [0, 1], left: [-1, 0] };
  let { x, y } = start;
  let cost = 0;
  for (const direction of route) {
    const [dx, dy] = offsets[direction];
    x += dx;
    y += dy;
    cost += edgeDepth({ x, y });
  }
  return cost;
}

function referenceOuterRoute(body, target, canStep = null) {
  const start = body[0].y * 12 + body[0].x;
  const end = target.y * 12 + target.x;
  const blocked = new Set(body.slice(1, -1).map(p => p.y * 12 + p.x));
  const distances = new Int16Array(144).fill(-1);
  const edgeCosts = new Int16Array(144).fill(32767);
  const queue = [start];
  distances[start] = edgeCosts[start] = 0;
  // FIFO finishes the entire preceding layer before using its minimum edge costs.
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const id = queue[cursor];
    if (id === end) return { length: distances[id], edgeCost: edgeCosts[id] };
    for (const next of referenceNeighbors[id]) {
      if (blocked.has(next) && next !== end) continue;
      if (canStep && !canStep(id, next)) continue;
      const distance = distances[id] + 1;
      if (distances[next] !== -1 && distance > distances[next]) continue;
      const cost = edgeCosts[id] + edgeDepth({ x: next % 12, y: Math.floor(next / 12) });
      if (distances[next] === -1) {
        distances[next] = distance;
        queue.push(next);
      }
      edgeCosts[next] = Math.min(edgeCosts[next], cost);
    }
  }
  return null;
}

if (isMainThread) {
test('A* chooses the most peripheral shortest route, including obstacles and unreachable targets', () => {
  let seed = 4287;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 0x100000000; };
  for (let sample = 0; sample < 5000; sample += 1) {
    const cells = Array.from({ length: 144 }, (_, id) => ({ x: id % 12, y: Math.floor(id / 12) }));
    for (let i = 143; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [cells[i], cells[j]] = [cells[j], cells[i]];
    }
    const body = cells.slice(0, 3 + sample % 137);
    const target = cells.at(-1);
    const outer = referenceOuterRoute(body, target);
    for (let order = 0; order < 4; order += 1) {
      const actual = game.shortest(body, target, order);
      const expected = referenceBfs(body, target, order);
      assert.equal(actual?.length ?? null, expected?.length ?? null, `sample=${sample}, order=${order}`);
      assert.equal(actual?.length ?? null, outer?.length ?? null);
      if (actual) {
        assert.equal(routeEdgeCost(body[0], actual), outer.edgeCost, `Outermost shortest route: sample=${sample}, order=${order}`);
        assert.ok(game.simulatePath(body, target, actual));
      }
    }
  }
});

test('Equal-length routes prefer each of the four edges, never a fixed leftward bias', () => {
  let body = [{ x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }];
  let food = { x: 1, y: 2 };
  let expected = ['left', 'left', 'left', 'up', 'up', 'up', 'up'];
  const rotatePoint = ({ x, y }) => ({ x: 11 - y, y: x });
  const rotateDirection = { up: 'right', right: 'down', down: 'left', left: 'up' };
  for (let rotation = 0; rotation < 4; rotation += 1) {
    for (let order = 0; order < 4; order += 1) assert.deepEqual(game.shortest(body, food, order), expected);
    game.arrange(body, food);
    assert.equal(game.next(), expected[0], 'Auto Solve actually follows the preferred safe route');
    body = body.map(rotatePoint);
    food = rotatePoint(food);
    expected = expected.map(direction => rotateDirection[direction]);
  }
});

test('A longer outer detour never replaces a shorter central route', () => {
  const body = [{ x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }];
  assert.deepEqual(game.shortest(body, { x: 4, y: 2 }), ['up', 'up', 'up', 'up']);
});

test('Cut a safe three-sided detour into a direct turn in every orientation', () => {
  const rotatePoint = ({ x, y }) => ({ x: 11 - y, y: x });
  const rotateDirection = { up: 'right', right: 'down', down: 'left', left: 'up' };
  let body = game.start;
  let food = { x: 4, y: 7 };
  let detour = ['right', 'down', 'left'];
  let direct = 'down';
  for (let rotation = 0; rotation < 4; rotation += 1) {
    game.arrange(body, food);
    const cycle = game.certify(detour);
    assert.ok(cycle);
    const plan = game.shortcut({ path: detour, cycle });
    assert.deepEqual(plan.path, [direct]);
    assert.ok(game.simulatePath(body, food, plan.path));
    checkCycle(plan.cycle);
    game.setPlan(detour, cycle);
    assert.equal(game.next(), direct, 'Actual Auto Solve takes the direct turn');
    body = body.map(rotatePoint);
    food = rotatePoint(food);
    detour = detour.map(direction => rotateDirection[direction]);
    direct = rotateDirection[direct];
  }
});

test('Do not cut a corner through body cells that have not vacated yet', () => {
  const body = [{ x: 4, y: 4 }, { x: 3, y: 4 }, { x: 3, y: 5 }, { x: 4, y: 5 }, { x: 4, y: 6 }];
  const food = { x: 4, y: 7 };
  game.arrange(body, food);
  const detour = ['right', 'down', 'left', 'down', 'down'];
  assert.ok(game.simulatePath(body, food, detour));
  assert.equal(game.simulatePath(body, food, ['down', 'down', 'down']), null);
  const cycle = game.certify(detour);
  assert.ok(cycle);
  const plan = { path: detour, cycle };
  assert.equal(game.shortcut(plan), plan, 'Retain the safe route when a direct turn hits the body');
});

test('A local shortcut keeps the already certified completion tour when it still fits', () => {
  const food = { x: 4, y: 10 };
  game.arrange(game.start, food);
  const path = ['right', 'down', 'left', 'down', 'down', 'down', 'down'];
  const cycle = game.certify(path);
  assert.ok(cycle);
  const shortened = game.shortcut({ path, cycle });
  assert.equal(shortened.path.length, path.length - 2);
  assert.deepEqual(game.simulatePath(game.start, food, shortened.path), game.simulatePath(game.start, food, path));
  assert.equal(shortened.cycle, cycle, 'Do not rewire the completion tour just because a detour was removed');
  const original = { path, cycle };
  assert.equal(game.shortcut(original, 'right'), original, 'Do not replace the selected shortest heading with an unrelated shortcut');
});

test('After eating, a tighter safe tour removes artificial gaps without moving the body', () => {
  const body = [{ x: 4, y: 5 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }];
  const original = JSON.stringify(body);
  const span = cycle => {
    const indices = new Int16Array(144);
    cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
    return body.slice(1).reduce((sum, p, i) => sum
      + (indices[body[i].y * 12 + body[i].x] - indices[p.y * 12 + p.x] + 144) % 144, 0);
  };
  assert.equal(span(game.baseCycle), 139);
  const compact = game.compactCycle(body, game.baseCycle);
  assert.equal(span(compact), body.length - 1, 'Shrink the loose tour all the way to the actual body span');
  assert.equal(JSON.stringify(body), original);
  checkCycle(compact);
  const indices = new Int16Array(144);
  compact.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
  assert.ok(game.ordered(body, indices));
  const contiguous = Array.from({ length: 60 }, (_, i) => game.baseCycle[(144 - i) % 144]);
  assert.equal(game.compactCycle(contiguous, game.baseCycle), game.baseCycle, 'Leave an already tight tour unchanged');
});

test('A short snake is not forced to sweep merely because its safety tour is loose', () => {
  const body = [{ x: 4, y: 5 }, { x: 4, y: 6 }, { x: 3, y: 6 }, { x: 2, y: 6 }];
  const span = indices => body.slice(1).reduce((sum, p, i) => sum
    + (indices[body[i].y * 12 + body[i].x] - indices[p.y * 12 + p.x] + 144) % 144, 0);
  const old = game.templates.filter(t => game.ordered(body, t.indices)).sort((a, b) => span(a.indices) - span(b.indices))[0];
  game.arrange(body, { x: 0, y: 0 });
  const compact = game.compactCycle(body, old.cycle);
  const indices = new Int16Array(144);
  compact.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
  let freed = 0;
  for (let id = 0; id < 144; id += 1) {
    const food = { x: id % 12, y: Math.floor(id / 12) };
    if (body.some(p => p.x === food.x && p.y === food.y)) continue;
    const shortest = game.shortest(body, food);
    const before = game.safePath(body, food, old.indices);
    const after = game.safePath(body, food, indices);
    if (after.length !== shortest.length || before.length < after.length + 4) continue;
    assert.ok(game.simulatePath(body, food, after));
    assert.ok(game.ordered(game.simulatePath(body, food, after), indices));
    freed += 1;
  }
  assert.ok(freed > 0, 'Open safe shortest routes by changing the proof, not by taking a normalization lap');
});

test('Auto Solve tries a different apple entry before accepting a long sweep', () => {
  randomState = 1;
  game.reset();
  let exercised = false;
  for (let step = 0; step < 2500 && !game.state().won; step += 1) {
    const before = game.state();
    const budget = before.plan?.path.length ?? game.cycleDistance(game.cycleIndex(before.body[0]), game.cycleIndex(before.food));
    game.next();
    const plan = game.state().plan;
    if (plan?.appleApproach && plan !== before.plan) {
      assert.ok(plan.path.length <= budget);
      let body = before.body;
      for (let i = 0; i < plan.path.length; i += 1) {
        const result = game.simulate(body, plan.path[i], before.food);
        assert.ok(result);
        assert.equal(result.ateFood, i === plan.path.length - 1, 'Reach the apple only at the last move of the certified approach');
        body = result.body;
      }
      const indices = new Int16Array(144);
      plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
      assert.ok(game.ordered(body, indices));
      exercised = true;
      break;
    }
    game.step();
    assert.equal(game.state().dead, false);
  }
  assert.ok(exercised);
});

test('Intercept the moving tail from three cells away instead of chasing its old position', () => {
  const body = [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 2, y: 4 }, { x: 1, y: 4 }];
  const food = { x: 0, y: 4 };
  game.arrange(body, food);
  assert.equal(game.tailGap(body), 3);
  assert.ok(game.shortest(body, food).length > 4, 'Static obstacles hide the moving-tail shortcut');
  const cycle = game.certify(['left', 'left', 'left', 'left']);
  assert.ok(cycle);
  const plan = game.tailShortcut(4, cycle);
  assert.ok(plan);
  assert.equal(plan.path.length, 4);
  assert.equal(plan.cycle, cycle, 'Retain the existing completion certificate');
  assert.equal(plan.tailShortcutSteps, 1);
  assert.equal(plan.path[0], 'left');
  const interception = game.simulatePath(body, food, plan.path.slice(0, plan.tailShortcutSteps));
  assert.equal(game.tailGap(interception), 1);
  assert.notDeepEqual(interception[0], body.at(-1), 'Intercept the future tail, not its stale cell');
  const landing = game.simulatePath(body, food, plan.path);
  const indices = new Int16Array(144);
  plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
  assert.ok(landing && game.ordered(landing, indices));
  assert.equal(game.tailShortcut(3, cycle), null, 'Do not buy tail proximity by extending the food budget');
});

test('Actual Auto Solve uses cells released by the moving tail in a shorter complete food route', () => {
  randomState = 1;
  game.reset();
  let intercepted = false;
  for (let step = 0; step < 2000 && !game.state().won; step += 1) {
    const before = game.state();
    const staticPath = game.shortest(before.body, before.food);
    game.next();
    const plan = game.state().plan;
    if (plan && (!staticPath || plan.path.length < staticPath.length)) {
      const initiallyBlocked = new Set(before.body.slice(1, -1).map(p => p.y * 12 + p.x));
      let body = before.body;
      let crossesReleasedCell = false;
      for (const direction of plan.path) {
        const result = game.simulate(body, direction, before.food);
        assert.ok(result, 'The shortcut is collision-free at its actual arrival time');
        body = result.body;
        crossesReleasedCell ||= initiallyBlocked.has(body[0].y * 12 + body[0].x);
      }
      if (crossesReleasedCell) {
        const indices = new Int16Array(144);
        plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
        assert.ok(game.ordered(body, indices), 'The entire shortcut retains a full-board completion proof');
        intercepted = true;
        break;
      }
    }
    game.step();
    assert.equal(game.state().dead, false);
  }
  assert.equal(intercepted, true, 'Exercise the production decision, not just the isolated helper');
});

test('Odd-length snakes aim for the closest possible two-cell tail gap', () => {
  const body = [{ x: 4, y: 4 }, { x: 4, y: 3 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 }];
  const food = { x: 0, y: 4 };
  game.arrange(body, food);
  const cycle = game.certify(['left', 'left', 'left', 'left']);
  assert.ok(cycle);
  assert.equal(game.tailGap(body), 4);
  const plan = game.tailShortcut(4, cycle);
  assert.ok(plan);
  assert.equal(plan.tailShortcutSteps, 1);
  const intercept = game.simulatePath(body, food, plan.path.slice(0, plan.tailShortcutSteps));
  assert.equal(game.tailGap(intercept), 2);
  assert.ok(game.simulatePath(body, food, plan.path));
});

test('Alternative routes stay shortest and are ranked by edge proximity', () => {
  const body = [{ x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 }];
  const food = { x: 1, y: 2 };
  const routes = [...game.alternatives(body, food, 7, 100)];
  assert.equal(routes.length, 35, 'Enumerate every route in this small shortest-path DAG');
  assert.equal(new Set(routes.map(route => route.join(','))).size, routes.length);
  let previousCost = -1;
  for (const route of routes) {
    assert.equal(route.length, 7);
    assert.ok(game.simulatePath(body, food, route));
    const cost = routeEdgeCost(body[0], route);
    assert.ok(cost >= previousCost, 'Consider closer-to-edge routes first, never longer detours');
    previousCost = cost;
  }
  assert.equal(routeEdgeCost(body[0], routes[0]), referenceOuterRoute(body, food).edgeCost);
  assert.equal([...game.alternatives(body, food, 8)].length, 0);
});

test('Above the former 80% threshold, keep taking the safe shortest route', () => {
  const body = Array.from({ length: 115 }, (_, i) => game.baseCycle[(144 - i) % 144]);
  const food = game.baseCycle[25];
  game.arrange(body, food);
  const shortest = referenceBfs(body, food).length;
  assert.ok(shortest < 25, 'The old endgame sweep would take 25 steps');
  for (let step = 0; step < shortest; step += 1) {
    const before = game.state();
    const distance = referenceBfs(before.body, food).length;
    game.step();
    assert.equal(game.state().dead, false);
    if (game.state().body.length > body.length) break;
    assert.equal(referenceBfs(game.state().body, food).length, distance - 1, 'Every step still belongs to a current shortest route');
  }
  assert.equal(game.state().body.length, 116);
  assert.deepEqual(game.state().body[0], food);
});

test('Do not abandon an available equal-length alternative for a longer sweep', () => {
  const body = [[10, 4], [10, 3], [10, 2], [9, 2], [8, 2], [7, 2], [7, 3], [7, 4],
    [7, 5], [8, 5], [9, 5], [10, 5], [10, 6], [10, 7], [11, 7]].map(([x, y]) => ({ x, y }));
  const cycleIds = '95,107,119,131,143,142,141,140,139,138,137,136,135,134,133,132,120,121,122,123,124,125,126,127,128,129,130,118,117,116,115,114,113,112,111,110,109,108,96,97,98,99,100,101,102,103,104,105,106,94,93,92,91,90,89,88,87,86,85,84,72,73,74,75,76,77,78,79,80,81,82,70,69,68,67,66,65,64,63,62,61,60,48,49,50,51,52,53,54,55,56,57,45,44,43,42,41,40,39,38,37,36,24,25,26,27,28,29,30,31,32,33,34,22,21,20,19,18,17,16,15,14,13,12,0,1,2,3,4,5,6,7,8,9,10,11,23,35,47,46,58,59,71,83';
  const cycle = cycleIds.split(',').map(Number).map(id => ({ x: id % 12, y: Math.floor(id / 12) }));
  checkCycle(cycle);
  game.arrange(body, { x: 5, y: 7 }, null, cycle);
  const state = game.state();
  assert.equal(state.body.length, 15);
  const shortest = game.shortest(state.body, state.food);
  assert.equal(shortest.length, 12);
  assert.equal(game.certify(shortest), null, 'The outermost shortest route has no completion certificate');
  const alternative = [...game.alternatives(state.body, state.food, shortest.length)].find(route => game.certify(route));
  assert.ok(alternative, 'Another route with exactly the same number of steps is safe');
  game.next();
  const plan = game.state().plan;
  assert.ok(plan.path.length <= shortest.length, 'A moving-tail route may even beat the static shortest distance');
  if (plan.path.length === shortest.length) {
    assert.ok(routeEdgeCost(state.body[0], plan.path) <= routeEdgeCost(state.body[0], alternative));
  }
  assert.ok(game.simulatePath(state.body, state.food, plan.path));
});

function referenceMovingRoute(body, food, indices, maxLength) {
  const id = p => p.y * 12 + p.x;
  const origin = indices[id(body[0])];
  const progress = p => (indices[id(p)] - origin + 144) % 144;
  const foodDistance = progress(food);
  let layer = [{ body, cost: 0 }];
  for (let step = 1; step <= maxLength; step += 1) {
    const nextLayer = new Map();
    let bestGoal = Infinity;
    for (const current of layer) {
      for (const direction of ['up', 'right', 'down', 'left']) {
        const result = game.simulate(current.body, direction, food);
        if (!result) continue;
        const head = result.body[0];
        if (progress(head) <= progress(current.body[0]) || progress(head) > foodDistance) continue;
        if (!game.ordered(result.body, indices)) continue;
        const cost = current.cost + edgeDepth(head);
        if (result.ateFood) {
          bestGoal = Math.min(bestGoal, cost);
          continue;
        }
        const key = result.body.map(id).join(',');
        if (!nextLayer.has(key) || cost < nextLayer.get(key).cost) nextLayer.set(key, { body: result.body, cost });
      }
    }
    if (Number.isFinite(bestGoal)) return { length: step, edgeCost: bestGoal };
    layer = [...nextLayer.values()];
  }
  return null;
}

test('Time-aware A* matches exact moving-body search: shortest first, perimeter only on ties', () => {
  let seed = 817;
  const random = n => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed % n;
  };
  let releasedCellRoutes = 0;
  let cases = 0;
  for (const { cycle, indices } of game.templates) {
    for (let sample = 0; sample < 40; sample += 1) {
      const body = [cycle[random(144)]];
      let span = 0;
      const length = 3 + random(14);
      for (let i = 1; i < length; i += 1) {
        const tail = body.at(-1);
        const tailId = tail.y * 12 + tail.x;
        const choices = referenceNeighbors[tailId].map(id => ({ x: id % 12, y: Math.floor(id / 12) }))
          .filter(p => !body.some(q => q.x === p.x && q.y === p.y))
          .filter(p => span + (indices[tailId] - indices[p.y * 12 + p.x] + 144) % 144 < 144);
        if (!choices.length) break;
        const next = choices[random(choices.length)];
        span += (indices[tailId] - indices[next.y * 12 + next.x] + 144) % 144;
        body.push(next);
      }
      assert.ok(game.ordered(body, indices));
      const occupied = new Set(body.map(p => p.y * 12 + p.x));
      const choices = cycle.filter(p => !occupied.has(p.y * 12 + p.x)
        && Math.abs(p.x - body[0].x) + Math.abs(p.y - body[0].y) <= 8);
      if (!choices.length) continue;
      const food = choices[random(choices.length)];
      const expected = referenceMovingRoute(body, food, indices, 8);
      const actual = game.safePath(body, food, indices, 8);
      cases += 1;
      assert.equal(actual?.length ?? null, expected?.length ?? null,
        JSON.stringify({ template: game.templates.findIndex(t => t.indices === indices), body, food }));
      if (!actual) continue;
      assert.equal(routeEdgeCost(body[0], actual), expected.edgeCost);
      let moving = body;
      let released = false;
      for (const direction of actual) {
        const result = game.simulate(moving, direction, food);
        assert.ok(result, 'Never enter a body cell before it is released, or cross the new trail');
        moving = result.body;
        assert.ok(game.ordered(moving, indices), 'Preserve the completion proof at every step, including growth');
        released ||= occupied.has(moving[0].y * 12 + moving[0].x);
      }
      if (released) releasedCellRoutes += 1;
    }
  }
  assert.equal(cases, 320);
  assert.ok(releasedCellRoutes > 0, 'Exercise future vacancies, not only initially empty routes');
});

test('Time-aware search never assumes the tail moves on an eating step', () => {
  const body = Array.from({ length: 144 }, (_, i) => game.baseCycle[(144 - i) % 144]);
  const indices = new Int16Array(144);
  game.baseCycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
  assert.equal(game.safePath(body, body.at(-1), indices, 1), null);
});

test('A vacating tail unlocks the gap beyond it, without an extra lap', () => {
  const body = [[6, 4], [6, 3], [7, 3], [8, 3], [8, 4], [7, 4]].map(([x, y]) => ({ x, y }));
  const food = { x: 4, y: 8 };
  const { indices } = game.templates[0];
  assert.ok(game.ordered(body, indices));
  const path = game.safePath(body, food, indices, 8);
  assert.equal(path.length, 8);
  assert.deepEqual(path.slice(0, 2), ['right', 'down'], 'Enter the released tail cell, then cut into the newly open gap');
  assert.ok(game.simulatePath(body, food, path));
  assert.equal(game.safePath(body, food, indices, 7), null, 'A tight food budget is never silently extended');
});

test('Safety-constrained routes still minimize steps before edge distance', () => {
  for (const { cycle, indices } of game.templates) {
    for (const length of [3, 20, 60, 90, 115, 130]) {
      for (let head = 0; head < 144; head += 19) {
        const body = Array.from({ length }, (_, i) => cycle[(head - i + 144) % 144]);
        for (const portion of [0.1, 0.5, 0.9]) {
          const foodDistance = 1 + Math.floor((143 - length) * portion);
          const food = cycle[(head + foodDistance) % 144];
          const tailDistance = 145 - length;
          const arcDistance = id => (indices[id] - head + 144) % 144;
          const expected = referenceOuterRoute(body, food, (from, to) => {
            const distance = arcDistance(to);
            return distance > arcDistance(from) && distance <= foodDistance && distance < tailDistance;
          });
          assert.ok(expected);
          const actual = game.safePath(body, food, indices);
          assert.equal(actual.length, expected.length);
          assert.equal(routeEdgeCost(body[0], actual), expected.edgeCost);
          const landing = game.simulatePath(body, food, actual);
          assert.ok(landing);
          assert.ok(game.ordered(landing, indices));
        }
      }
    }
  }
});

test('A shortest first step needs a complete retreat within the existing budget', () => {
  const body = Array.from({ length: 115 }, (_, i) => game.baseCycle[(144 - i) % 144]);
  const food = game.baseCycle[25];
  game.arrange(body, food);
  assert.equal(game.firstStepPlan('left', 25), null, 'Cannot move outside the board');
  assert.equal(game.firstStepPlan('right', 1), null, 'A safe single step alone is not a food-reaching plan');
  assert.equal(game.firstStepPlan('right', 2), null, 'Do not reset the remaining-step budget');
  const plan = game.firstStepPlan('right', 25);
  assert.ok(plan);
  assert.ok(plan.path.length <= 25);
  const landing = game.simulatePath(body, food, plan.path);
  assert.ok(landing);
  const indices = new Int16Array(144);
  plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
  assert.ok(game.ordered(landing, indices));
});

test('Benchmark A* against BFS on the same snake positions', () => {
  const cases = [];
  for (const length of [3, 20, 60, 90, 115, 140]) {
    for (let head = 0; head < 144; head += 3) {
      const body = Array.from({ length }, (_, i) => game.baseCycle[(head - i + 144) % 144]);
      for (const portion of [0.1, 0.5, 0.9]) {
        const distance = 1 + Math.floor((143 - length) * portion);
        cases.push({ body, food: game.baseCycle[(head + distance) % 144] });
      }
    }
  }
  const benchmark = (search) => {
    const metrics = { expanded: 0 };
    for (const { body, food } of cases) search(body, food);
    const start = performance.now();
    for (let repeat = 0; repeat < 5; repeat += 1) {
      for (const { body, food } of cases) search(body, food, 0, metrics);
    }
    return { ms: Math.round((performance.now() - start) * 100) / 100, expanded: metrics.expanded };
  };
  const bfs = benchmark(referenceBfs);
  const astar = benchmark(game.shortest);
  assert.ok(astar.expanded < bfs.expanded);
  console.log(JSON.stringify({ searches: cases.length * 5, bfs, astar }));
});

test('Cycle visits all 144 cells and closes; initial body is ordered', () => {
  game.arrange(game.start, { x: 4, y: 5 });
  assert.equal(new Set(game.cycle.map(({ x, y }) => `${x},${y}`)).size, 144);
  game.cycle.forEach((point, i) => assert.ok(game.direction(point, game.cycle[(i + 1) % 144])));
  assert.ok(game.ordered(game.start));
  assert.equal(game.state().auto, true);
});

test('Consecutive adjacent apples do not trigger a leftward normalization lap', () => {
  game.arrange(game.start, { x: 4, y: 5 });
  const apples = [
    { point: { x: 4, y: 5 }, direction: 'up' },
    { point: { x: 5, y: 5 }, direction: 'right' },
    { point: { x: 5, y: 6 }, direction: 'down' },
    { point: { x: 6, y: 6 }, direction: 'right' },
  ];
  for (const apple of apples) {
    game.setFood(apple.point);
    assert.equal(game.next(), apple.direction);
    game.step();
    assert.equal(game.state().body[0].x, apple.point.x);
    assert.equal(game.state().body[0].y, apple.point.y);
  }
});

test('Take the true one-step shortest path even when it goes against the old tour', () => {
  game.arrange(game.start, { x: 4, y: 5 });
  assert.equal(game.next(), 'up');
  game.step();
  assert.equal(game.state().body.length, 4);
  assert.ok(game.ordered(game.state().body), 'The new route fits the actual body after eating');
});

test('Early game uses a shortest safe shortcut rather than always sweeping', () => {
  game.arrange(game.start, { x: 4, y: 7 });
  assert.equal(game.next(), 'down');
  game.step();
  assert.equal(game.state().body.length, 4);
});

test('Every initial apple is reached in the actual BFS shortest distance', () => {
  for (let y = 0; y < 12; y += 1) {
    for (let x = 0; x < 12; x += 1) {
      const food = { x, y };
      if (game.start.some(p => p.x === x && p.y === y)) continue;
      game.arrange(game.start, food);
      const distance = game.shortest(game.start, food).length;
      for (let i = 0; i < distance; i += 1) game.step();
      const state = game.state();
      assert.equal(state.dead, false);
      assert.equal(state.body.length, 4, `Apple ${x},${y} took longer than ${distance} steps`);
      assert.equal(state.body[0].x, x);
      assert.equal(state.body[0].y, y);
    }
  }
});

test('A greedy body incompatible with the old tour safely adapts through full coverage', () => {
  randomState = 1;
  game.reset();
  let steps = 0;
  while (game.state().body.length < game.threshold && steps++ < 144 * 142) game.step();
  const transition = game.state();
  assert.equal(transition.body.length, game.threshold);
  assert.equal(transition.dead, false);
  assert.equal(transition.plan, null);
  const oldIndices = new Int16Array(144);
  game.baseCycle.forEach((p, i) => { oldIndices[p.y * 12 + p.x] = i; });
  assert.equal(game.ordered(transition.body, oldIndices), false, 'Exercise the original unsafe-switch scenario');
  assert.ok(game.ordered(transition.body), 'The replacement tour fits the actual body');
  while (!game.state().won && !game.state().dead && steps++ < 144 * 142) {
    game.step();
    const state = game.state();
    if (state.plan) {
      const landing = game.simulatePath(state.body, state.food, state.plan.path);
      assert.ok(landing, 'Any endgame shortcut is collision-free');
      const indices = new Int16Array(144);
      state.plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
      assert.ok(game.ordered(landing, indices), 'Every new route has a valid completion tour');
    } else {
      assert.ok(game.ordered(state.body));
    }
  }
  assert.equal(game.state().won, true);
  assert.equal(game.state().body.length, 144);
});

test('Around length 90, every step reduces the certified route to the same apple', () => {
  randomState = 7;
  game.reset();
  let steps = 0;
  while (game.state().body.length < 90 && steps++ < 144 * 142) game.step();
  for (let apple = 0; apple < 8; apple += 1) {
    const startLength = game.state().body.length;
    let appleSteps = 0;
    while (game.state().body.length === startLength && appleSteps++ < 144) {
      const before = game.state();
      const remaining = before.plan ? before.plan.path.length : game.cycleDistance(game.cycleIndex(before.body[0]), game.cycleIndex(before.food));
      game.step();
      const after = game.state();
      assert.equal(after.dead, false);
      if (after.body.length > startLength) break;
      const nextRemaining = after.plan ? after.plan.path.length : game.cycleDistance(game.cycleIndex(after.body[0]), game.cycleIndex(after.food));
      assert.ok(nextRemaining < remaining, 'Do not trade progress for another safe tail-chasing move');
    }
    assert.equal(game.state().body.length, startLength + 1);
    assert.ok(appleSteps < 144);
  }
});

test('All cycle rotations are safe through the 80% transition and last apple', () => {
  for (const length of [game.threshold - 1, game.threshold, game.threshold + 1, 143]) {
    for (let headIndex = 0; headIndex < 144; headIndex += 1) {
      const body = Array.from({ length }, (_, i) => game.baseCycle[(headIndex - i + 144) % 144]);
      const food = game.baseCycle[(headIndex + 1) % 144];
      game.arrange(body, food);
      game.step();
      const state = game.state();
      assert.equal(state.dead, false, `length=${length}, rotation=${headIndex}`);
      assert.equal(state.body.length, length + 1);
      assert.equal(state.won, length === 143);
      if (state.won) assert.equal(state.food, null);
      checkBody(state.body);
    }
  }
});

test('A full-length snake may move into the vacating tail, but may not grow into it', () => {
  const body = Array.from({ length: 144 }, (_, i) => game.cycle[(144 - i) % 144]);
  const tail = body.at(-1);
  const direction = game.direction(body[0], tail);
  assert.ok(game.simulate(body, direction, null));
  assert.equal(game.simulate(body, direction, tail), null);
});

test('Body fades continuously toward the tail; head remains light green', () => {
  assert.equal(game.color(0, 144), '#8fd18f');
  let last = [0, 0, 0];
  for (let i = 1; i < 144; i += 1) {
    const rgb = game.color(i, 144).match(/\d+/g).map(Number);
    assert.ok(rgb.every((channel, axis) => channel >= last[axis]));
    assert.ok(rgb.every(channel => channel <= 165), 'Tail stays green rather than fading to white');
    last = rgb;
  }
});

test('Seeded games clear the board with certified shortest paths and safe transitions', async () => {
  const games = Number(process.env.SNAKE_TEST_GAMES || 1000);
  const workers = games < 20 ? 1 : Math.min(6, availableParallelism(), games);
  const results = workers === 1 ? [runGames(1, games)] : await Promise.all(
    Array.from({ length: workers }, (_, i) => {
      const first = 1 + Math.floor(i * games / workers);
      const count = Math.floor((i + 1) * games / workers) - first + 1;
      return new Promise((resolve, reject) => {
        const worker = new Worker(__filename, { workerData: { first, games: count } });
        let result;
        worker.on('message', (value) => { result = value; });
        worker.once('error', reject);
        worker.once('exit', (code) => code === 0 && result ? resolve(result) : reject(new Error(`Worker exited with ${code}`)));
      });
    }),
  );
  const sum = (field) => results.reduce((total, result) => total + result[field], 0);
  const totalSteps = sum('totalSteps');
  assert.ok(sum('cycleChanges') > games, 'Adapt the completion route instead of forcing the body onto the old one');
  console.log(JSON.stringify({ games, cleared: games, meanSteps: Math.round(totalSteps / games), longestGame: Math.max(...results.map(r => r.longestGame)), maxAppleSteps: Math.max(...results.map(r => r.maxAppleSteps)), cycleChanges: sum('cycleChanges'), maxStepMs: Math.round(Math.max(...results.map(r => r.maxStepMs))), shortestMovePercent: Math.round(100 * sum('shortestMoves') / sum('earlyMoves')), shortestByLength: [0,1,2,3].map(i => Math.round(100 * results.reduce((sum,r)=>sum+r.shortestBins[i],0) / results.reduce((sum,r)=>sum+r.distanceBins[i],0))) }));
  assert.ok(totalSteps / games < 3400, 'Improve travel compared with the old fixed-tour solver');
});
}

function runGames(firstSeed, games) {
  let totalSteps = 0;
  let shortestMoves = 0;
  let earlyMoves = 0;
  let cycleChanges = 0;
  const distanceBins = [0, 0, 0, 0];
  const shortestBins = [0, 0, 0, 0];
  let longestGame = 0;
  let maxStepMs = 0;
  let maxAppleSteps = 0;
  const checkedCycles = new WeakSet();
  const validateCycle = (cycle) => {
    if (checkedCycles.has(cycle)) return;
    checkCycle(cycle);
    checkedCycles.add(cycle);
  };
  for (let seed = firstSeed; seed < firstSeed + games; seed += 1) {
    randomState = seed;
    game.reset();
    let state = game.state();
    let steps = 0;
    let appleSteps = 0;
    while (!state.won && !state.dead && steps < 144 * 142) {
      const before = state;
      const beforeCycle = game.cycle;
      const beforeDistance = before.plan ? before.plan.path.length : game.cycleDistance(game.cycleIndex(before.body[0]), game.cycleIndex(before.food));
      const beforeEdgeCost = before.plan ? routeEdgeCost(before.body[0], before.plan.path) : Infinity;
      const shortest = before.body.length < game.threshold ? game.shortest(before.body, before.food) : null;
      const stepStart = performance.now();
      game.step();
      maxStepMs = Math.max(maxStepMs, performance.now() - stepStart);
      state = game.state();
      steps += 1;
      appleSteps += 1;
      maxAppleSteps = Math.max(maxAppleSteps, appleSteps);
      assert.equal(state.dead, false, `seed=${seed}, length=${before.body.length}, step=${steps}`);
      if (state.body.length === before.body.length) {
        const afterDistance = state.plan ? state.plan.path.length : game.cycleDistance(game.cycleIndex(state.body[0]), game.cycleIndex(state.food));
        assert.ok(afterDistance < beforeDistance, `Chasing tail without progress at seed=${seed}, length=${state.body.length}, step=${steps}`);
        if (state.plan && afterDistance + 1 === beforeDistance) {
          const chosenEdgeCost = edgeDepth(state.body[0]) + routeEdgeCost(state.body[0], state.plan.path);
          assert.ok(chosenEdgeCost <= beforeEdgeCost, `Equal-length replan moved inward at seed=${seed}, step=${steps}`);
        }
      }
      if (state.plan) {
        validateCycle(state.plan.cycle);
        const landing = game.simulatePath(state.body, state.food, state.plan.path);
        assert.ok(landing, `Unsafe pending route at seed=${seed}, step=${steps}`);
        const indices = new Int16Array(144);
        state.plan.cycle.forEach((p, i) => { indices[p.y * 12 + p.x] = i; });
        assert.ok(game.ordered(landing, indices), `Invalid landing certificate at seed=${seed}, step=${steps}`);
      } else {
        validateCycle(game.cycle);
        assert.ok(game.ordered(state.body), `Unsafe cycle handoff at seed=${seed}, step=${steps}`);
      }
      if (before.body.length < game.threshold) {
        earlyMoves += 1;
        const bin = Math.min(3, Math.floor(before.body.length / 29));
        distanceBins[bin] += 1;
        const remaining = state.body.length > before.body.length ? [] : game.shortest(state.body, before.food);
        if (shortest && remaining && remaining.length < shortest.length) {
          shortestMoves += 1;
          shortestBins[bin] += 1;
        }
      }
      if (beforeCycle !== game.cycle) cycleChanges += 1;
      assert.ok(appleSteps < 144, `Apple stalled at seed=${seed}`);
      if (state.body.length > before.body.length) {
        checkBody(state.body);
        appleSteps = 0;
      }
    }
    assert.equal(state.won, true, `seed=${seed} did not finish`);
    assert.equal(state.body.length, 144);
    totalSteps += steps;
    longestGame = Math.max(longestGame, steps);
  }
  return { totalSteps, longestGame, cycleChanges, shortestMoves, earlyMoves, shortestBins, distanceBins, maxStepMs, maxAppleSteps };
}

if (!isMainThread) parentPort.postMessage(runGames(workerData.first, workerData.games));
