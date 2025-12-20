import DOMPurify from "dompurify";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      dompurify: DOMPurify,
    },
  };
});
