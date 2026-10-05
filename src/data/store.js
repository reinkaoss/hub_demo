import { buildSeed } from './seed';

/**
 * The entire "backend": one mutable object in memory. Services read and write it, so a refresh
 * returns the demo to a known state and nothing is ever persisted or sent anywhere.
 */
let db = buildSeed();

export const getDb = () => db;
export const resetDb = () => {
  db = buildSeed();
};

/** Simulated network latency, so loading and pending states are real rather than skipped. */
export const wait = (ms = 200) => new Promise((resolve) => setTimeout(resolve, ms + Math.random() * 160));

let counter = 5000;
export const nextId = (prefix) => `${prefix}-${++counter}`;
