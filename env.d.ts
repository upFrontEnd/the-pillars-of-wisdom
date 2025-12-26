/// <reference types="vite/client" />

/**
 * Permet à TypeScript (et à l'éditeur) de typer les imports de fichiers `.vue`.
 * Sans ça, TS déclenche TS2307 sur `import App from "./App.vue"`.
 */
declare module "*.vue" {
    import type { DefineComponent } from "vue";
    const component: DefineComponent<{}, {}, any>;
    export default component;
  }
  