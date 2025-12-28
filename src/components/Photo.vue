<script setup lang="ts">
	/**
	 * Photo.vue
	 *
	 * Objectif :
	 * - Afficher une image quand on a une URL (src).
	 * - Sinon afficher un “fallback” (un rond vide) pour garder la mise en page propre.
	 *
	 * Pourquoi un composant dédié ?
	 * - Ça évite de répéter partout : v-if + fallback + styles.
	 * - Ça standardise le rendu (même taille, même forme, même bordure).
	 */

	/**
	 * Props = données fournies par le parent.
	 *
	 * - src?: string
	 *   URL de l’image (ex: "/authors/unknown.jpg"). Optionnelle.
	 *   Si src est absent, on affiche un placeholder.
	 *
	 * - alt?: string
	 *   Texte alternatif pour l’accessibilité. Optionnel.
	 *   Si tu ne le fournis pas, on met un alt générique "Photo".
	 */
	defineProps<{
		src?: string;
		alt?: string;
	}>();
	</script>

	<template>
		<!--
			Si src existe :
			- on rend une vraie balise <img>
			- l’attribut alt est important (lecteurs d’écran, SEO, etc.)
		-->
		<img v-if="src" class="photo" :src="src" :alt="alt || 'Photo'" />

		<!--
			Sinon :
			- on rend un bloc visuel à la même taille (pour ne pas “casser” le layout)
			- aria-hidden="true" car ce bloc n’apporte pas d’information utile
				aux technologies d’assistance (c’est purement décoratif)
		-->
		<div v-else class="photo photo--fallback" aria-hidden="true"></div>
	</template>

	<style scoped lang="scss">
	.photo {
		aspect-ratio: 1;
		background: #fff;
		border-radius: 50%;
		border: 1px solid #c7c7c7;
		margin: 0 auto;
		object-fit: cover;
		position: absolute; left: 50%;
		transform: translateX(-50%); top: -3rem;
		width: 6rem;

		/**
		 * Fallback visuel (si aucune image) :
		 * - on garde la même forme/taille
		 * - on met un fond discret pour indiquer “image absente”
		 */
		&--fallback {
			background: rgba(255, 255, 255, 0.06);
		}
	}
	</style>
