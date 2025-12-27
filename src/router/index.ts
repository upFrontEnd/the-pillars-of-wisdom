import { createRouter, createWebHistory } from "vue-router";

/**
 * router/index.ts
 *
 * Objectif :
 * - Définir les “pages” de l’application.
 * - Associer une URL (ex: "/") à un composant Vue (ex: HomeView).
 *
 * Concrètement :
 * - Quand l’utilisateur va sur http://.../ => on affiche HomeView.
 * - Vue Router gère tout ça sans recharger la page (SPA).
 */

/**
 * createRouter(...) = création du routeur.
 *
 * Le routeur a 2 éléments principaux :
 * 1) history : comment on gère les URLs
 * 2) routes  : la liste des routes (URL -> composant)
 */
const router = createRouter({
	/**
	 * createWebHistory() :
	 * - URLs “propres” (sans #)
	 * - Exemple : / au lieu de /#/
	 *
	 * Note :
	 * - En dev (Vite), ça marche directement.
	 * - En prod, il faut que l’hébergeur redirige toutes les URLs vers index.html
	 *   (sinon un refresh sur /quelque-chose peut faire un 404).
	 */
	history: createWebHistory(),

	/**
	 * routes :
	 * - tableau des pages de l’app
	 *
	 * Pour chaque route :
	 * - path  : l’URL
	 * - name  : un nom pratique (pour naviguer par nom plutôt que par URL)
	 * - component : quel composant afficher
	 */
	routes: [
		{
			// Page d’accueil
			path: "/",
			name: "home",

			/**
			 * Import dynamique :
			 * - le code de HomeView est chargé seulement quand on en a besoin
			 * - ça réduit le bundle initial (utile quand l’app grandit)
			 */
			component: () => import("../views/HomeView.vue"),
		},
	],
});

export default router;
