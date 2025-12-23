import { defineNuxtPlugin } from "#app";
import gsap from "gsap";
// MotionPathPlugin 要单独导入并注册
import { MotionPathPlugin } from "gsap/MotionPathPlugin";

gsap.registerPlugin(MotionPathPlugin);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      gsap,
    },
  };
});
