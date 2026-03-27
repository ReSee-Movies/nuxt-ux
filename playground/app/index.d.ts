declare module '#app' {
  interface PageMeta {
    heading? : string;
    prose?   : boolean | 'sm' | 'md';
  }
}

// It is always important to ensure you import/export something when augmenting a type... because reasons.
export {};
