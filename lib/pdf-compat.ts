// Minimal DOMMatrix polyfill for Node.js environments
if (typeof (globalThis as any).DOMMatrix === 'undefined') {
  // Simple no-op DOMMatrix implementation used by pdf.js for transforms
  // Provides methods referenced by pdf.js without full behavior.
  // Keep minimal to avoid breaking other code.
  // @ts-ignore
  class DOMMatrix {
    constructor(_init?: any) {}
    multiply(_other: any) { return this }
    invertSelf() { return this }
    translate() { return this }
    scale() { return this }
    rotate() { return this }
  }
  // @ts-ignore
  (globalThis as any).DOMMatrix = DOMMatrix;
}

export {};
