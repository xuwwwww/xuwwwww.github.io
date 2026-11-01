// Run with: node --test tests/snake-solver.test.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { Worker, isMainThread, parentPort, workerData } = require('node:worker_threads');
const { availableParallelism } = require('node:os');

const source = fs.readFileSync(path.join(__dirname, '..', 'scripts.js'), 'utf8');
const start = source.indexOf('const SNAKE_SIZE =');
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
    completeCycle: buildSnakeCompletionCycle,
    simulatePath: simulateSnakePath,
    setFood: (food) => { snakeFood = food; snakeAutoPlan = null; snakeFoodPathCache.clear(); },
    step: stepSnakeGame,
    reset: resetEasterGame,
    state: () => ({ body: snakeBody, food: snakeFood, won: snakeWon, dead: snakeGameOver, auto: snakeAutoSolve, plan: snakeAutoPlan }),
    arrange: (body, food, direction = null) => {
      snakeBody = body.map(cloneSegment);
      snakeFood = food && cloneSegment(food);
      snakeDirection = direction || getDirectionBetween(body[1], body[0]) || 'right';
      snakeNextDirection = snakeDirection;
      snakeAutoSolve = true;
      snakeGameOver = false;
      snakeWon = false;
      snakeAutoPlan = null;
      snakeFoodPathCache.clear();
      snakeHamiltonianCycle = SNAKE_HAMILTONIAN_CYCLE;
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

test('Try another equal-length route before abandoning the shortest distance', () => {
  randomState = 1;
  game.reset();
  for (let step = 0; step < 90; step += 1) game.step();
  const state = game.state();
  assert.equal(state.body.length, 15);
  const shortest = game.shortest(state.body, state.food);
  assert.equal(shortest.length, 12);
  assert.equal(game.certify(shortest), null, 'The outermost shortest route has no completion certificate');
  const alternative = [...game.alternatives(state.body, state.food, shortest.length)].find(route => game.certify(route));
  assert.ok(alternative, 'Another route with exactly the same number of steps is safe');
  assert.equal(game.next(), alternative[0]);
  assert.equal(game.state().plan.path.length, shortest.length, 'Do not fall back to a longer sweep');
  assert.equal(routeEdgeCost(state.body[0], game.state().plan.path), routeEdgeCost(state.body[0], alternative));
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
