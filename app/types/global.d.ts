export {};

declare global {
  var $toast: {
    success: (msg: string) => void;
    error: (msg: string) => void;
  };
}
