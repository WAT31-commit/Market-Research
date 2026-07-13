// Deterministic pseudo-random generator seeded from a string (e.g. project id).
// Used so mock data is stable across renders for a given project but varies
// between projects, instead of using Math.random() everywhere.

function hashString(input: string): () => number {
  let h = 1779033703 ^ input.length;
  for (let i = 0; i < input.length; i++) {
    h = Math.imul(h ^ input.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
}

export class SeededRandom {
  private state: () => number;

  constructor(seed: string) {
    this.state = hashString(seed);
  }

  next(): number {
    return this.state() / 4294967296;
  }

  int(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  float(min: number, max: number, decimals = 1): number {
    const v = this.next() * (max - min) + min;
    const factor = 10 ** decimals;
    return Math.round(v * factor) / factor;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[this.int(0, arr.length - 1)];
  }

  shuffle<T>(arr: readonly T[]): T[] {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.int(0, i);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}
