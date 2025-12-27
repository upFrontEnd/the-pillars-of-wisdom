import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";

// Styles globaux (reset + thème + règles générales)
import "./scss/main.scss";

/**
 * src/main.ts
 *
 * C’est “le bouton ON” de ton application.
 *
 * Quand le navigateur charge ton site, Vite exécute ce fichier en premier.
 * Son job est très simple :
 * 1) créer l’application Vue à partir d’App.vue
 * 2) brancher les plugins (ici : le router)
 * 3) afficher l’app dans la page HTML (dans #app)
 */

/**
 * 1) On crée l’application.
 *
 * createApp(App) :
 * - App.vue est le composant racine (le “parent” de tout le reste).
 * - `app` est l’objet qui représente l’application en cours de construction.
 */
const app = createApp(App);

/**
 * 2) On branche le router.
 *
 * app.use(router) :
 * - ajoute la navigation à l’application (URLs -> pages)
 * - sans ça, <RouterView /> ne fonctionnerait pas.
 */
app.use(router);

/**
 * 3) On “monte” l’application dans le DOM.
 *
 * app.mount("#app") :
 * - Vue va chercher <div id="app"></div> dans index.html
 * - puis elle rend ton application à l’intérieur.
 *
 * Si #app n’existe pas :
 * - tu auras une page vide (ou une erreur dans la console).
 */
app.mount("#app");
