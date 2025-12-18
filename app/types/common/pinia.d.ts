import "nuxt/app";
import type { Pinia } from "pinia";

declare module "nuxt/app" {
  interface NuxtApp {
    $pinia: Pinia;
  }
}

declare module "#app" {
  interface NuxtApp {
    $pinia: Pinia;
  }
}
