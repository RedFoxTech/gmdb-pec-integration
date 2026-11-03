declare global {
  interface Window {
    clarity: (...args: any[]) => void;
  }
}

export {};
