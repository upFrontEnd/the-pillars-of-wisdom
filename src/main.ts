import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import "./scss/main.scss";

console.log("[BOOT] main.ts chargé");

try {
	const app = createApp(App);

	app.use(router);

	app.mount("#app");

	console.log("[BOOT] app montée sur #app");
} catch (e) {
	console.error("[BOOT] erreur au démarrage", e);
	throw e;
}
