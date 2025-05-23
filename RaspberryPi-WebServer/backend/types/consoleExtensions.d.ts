export {};

declare global {
  interface Console {
    status: (...args: any[]) => void;
    logConnectionStatus: (...args: any[]) => void;
    error: (...args: any[]) => void;
  }
}