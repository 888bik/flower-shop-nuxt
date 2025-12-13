// types/api.d.ts
import type { MyRequest } from "~/plugins/axios";
import type apiModules from "~/api";

declare module "#app" {
  interface NuxtApp {
    $api: ReturnType<typeof apiModules>;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $api: ReturnType<typeof apiModules>;
  }
}
