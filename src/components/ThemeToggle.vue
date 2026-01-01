<script setup lang="ts">
	import { onMounted, ref, watch } from "vue";

	/**
	 * ThemeToggle.vue
	 *
	 * Objectif :
	 * - Afficher un petit interrupteur “Light / Dark”.
	 * - Quand on clique, on change le thème de toute l’application.
	 *
	 * Comment on “change le thème” ?
	 * - On ne change pas des couleurs directement ici.
	 * - On change un attribut HTML : data-theme="light" ou data-theme="dark".
	 * - Ton SCSS écoute cet attribut ([data-theme="..."]) et met à jour les variables CSS.
	 * - Le composant gère la logique (choix utilisateur, sauvegarde).
	 * - Le SCSS gère l’apparence (couleurs/gradient).
	 * - Ça évite d’éparpiller du code de thème dans tous les composants.
	 */

	/**
	 * Clé utilisée dans localStorage.
	 *
	 * localStorage = petite mémoire du navigateur :
	 * - pratique pour garder le thème même après un refresh.
	 */
	const STORAGE_KEY = "good-mood.theme";

	/**
	 * isDark :
	 * - true  => thème "dark"
	 * - false => thème "light"
	 *
	 * ref(false) :
	 * - crée une valeur réactive
	 * - si elle change, Vue met à jour le DOM automatiquement
	 */
	const isDark = ref(false);

	/**
	 * Applique réellement le thème sur la page.
	 *
	 * Source de vérité choisie :
	 * - <html data-theme="...">
	 *
	 * Pourquoi <html> ?
	 * - C’est tout en haut du document : tout le CSS peut s’y baser.
	 * - Et tu as déjà écrit ton système SCSS sur [data-theme="..."].
	 */
	function applyTheme(dark: boolean) {
		const theme = dark ? "dark" : "light";

		// On écrit l’attribut sur <html>
		document.documentElement.setAttribute("data-theme", theme);

		// On mémorise le choix pour la prochaine visite
		localStorage.setItem(STORAGE_KEY, theme);
	}

	/**
	 * onMounted :
	 * - ce code s’exécute une fois que le composant est “installé” dans la page.
	 * - c’est le bon endroit pour lire localStorage et toucher au document.
	 */
	onMounted(() => {
		/**
		 * Étape 1 : récupérer le thème déjà choisi (si l’utilisateur a déjà cliqué avant).
		 */
		const saved = localStorage.getItem(STORAGE_KEY);

		if (saved === "dark" || saved === "light") {
			// Si on a une valeur valide, elle gagne (priorité utilisateur)
			isDark.value = saved === "dark";
		} else {
			/**
			 * Étape 2 : sinon, on suit la préférence du système (OS / navigateur).
			 *
			 * matchMedia("(prefers-color-scheme: dark)") :
			 * - renvoie true si l’utilisateur a un thème dark au niveau système
			 *
			 * Les checks typeof protègent contre des environnements où ces APIs n’existent pas.
			 */
			isDark.value =
				typeof window !== "undefined" &&
				typeof window.matchMedia === "function" &&
				window.matchMedia("(prefers-color-scheme: dark)").matches;
		}

		// Une fois l’état déterminé, on applique le thème
		applyTheme(isDark.value);
	});

	/**
	 * watch(isDark, ...)
	 *
	 * watch = “surveille une valeur réactive”
	 * - dès que isDark change (clic sur le toggle),
	 *   on applique le thème et on le sauvegarde.
	 */
	watch(isDark, (v) => applyTheme(v));
	</script>

	<template>
		<div class="toggle">
			<!--
				Checkbox "réel" (accessible) :
				- v-model="isDark" => quand on clique, isDark bascule true/false
				- role="switch" => indique aux lecteurs d'écran que c'est un interrupteur
				- aria-label => nom explicite pour accessibilité
			-->
			<input
				id="theme-toggle"
				v-model="isDark"
				class="toggle__input"
				type="checkbox"
				role="switch"
				:aria-checked="isDark"
				aria-label="Basculer le thème"
			/>

			<!--
				Label stylé :
				- c’est lui qu’on voit à l’écran
				- cliquer sur le label clique aussi sur le checkbox (grâce au for=...)
			-->
			<label class="toggle__label" for="theme-toggle">
				<!--
					Icons décoratives :
					- aria-hidden car c’est purement visuel
				-->
				<span class="toggle__icons" aria-hidden="true">
					<span class="toggle__sun">☀</span>
					<span class="toggle__moon">🌙</span>
				</span>

				<!-- “Bille” qui se déplace quand on est en dark -->
				<span class="toggle__thumb" aria-hidden="true"></span>
			</label>
		</div>
	</template>

	<style scoped lang="scss">
	/**
	 * Styles du toggle (scoped)
	 *
	 * Idée :
	 * - le checkbox est présent (accessibilité) mais invisible
	 * - le label est la “piste”
	 * - la thumb est la “bille” qui glisse à droite quand checked
	 */

	.toggle {
		display: inline-flex;
		align-items: center;

		&__input {
			// On cache le checkbox natif, mais il reste focusable et cliquable via le label
			position: absolute;
			opacity: 0;
			width: 1px;
			height: 1px;
		}

		&__label {
			position: relative;
			width: 54px;
			height: 30px;
			border-radius: 999px;
			border: 1px solid rgba(255, 255, 255, 0.18);
			background: rgba(255, 255, 255, 0.08);
			cursor: pointer;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			user-select: none;
		}

		&__icons {
			position: absolute;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			padding: 0 8px;
			font-size: 12px;
			opacity: 0.9;
		}

		&__sun {
			color: #f4af57;
		}

		&__thumb {
			position: absolute;
			left: 4px;
			top: 50%;
			transform: translateY(-50%);
			width: 22px;
			height: 22px;
			border-radius: 999px;
			background: rgba(255, 255, 255, 0.95);
			transition: transform 180ms ease;
		}

		/**
		 * Quand le checkbox est checked :
		 * - le sibling + (label) contient la thumb
		 * - on translate la thumb vers la droite
		 */
		&__input:checked + &__label &__thumb {
			transform: translate(24px, -50%);
		}

		/**
		 * Focus clavier :
		 * - rend l’interrupteur utilisable au clavier (Tab)
		 * - focus-visible évite l’outline au clic souris
		 */
		&__input:focus-visible + &__label {
			outline: 2px solid rgba(255, 255, 255, 0.35);
			outline-offset: 2px;
		}
	}
	</style>
