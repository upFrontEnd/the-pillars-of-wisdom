<script setup lang="ts">
	/**
	 * Photo.vue
	 *
	 * Objectif :
	 * - Afficher une image quand on a une URL (src).
	 * - Sinon afficher un “fallback” (un rond vide) pour garder la mise en page propre.
	 *
	 * Extension demandée :
	 * - Si src pointe vers un .jpg/.jpeg, on tente de servir un .webp en priorité
	 *   via <picture> + <source type="image/webp">, avec fallback JPG.
	 *
	 * Pourquoi un composant dédié ?
	 * - Ça évite de répéter partout : v-if + fallback + styles.
	 * - Ça standardise le rendu (même taille, même forme, même bordure).
	 */

	import { computed } from "vue";

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
	const props = defineProps<{
		src?: string;
		alt?: string;
	}>();

	/**
	 * Normalisation de src :
	 * - évite les espaces / null-ish
	 */
	const normalizedSrc = computed(() => (props.src ?? "").trim());

	/**
	 * Résolution du chemin avec la base Vite :
	 * - utile si l’app est déployée sous un sous-chemin (BASE_URL)
	 * - le JSON peut contenir "/authors/adel.jpg"
	 * - on le convertit en `${BASE_URL}authors/adel.jpg`
	 */
	const resolvedSrc = computed(() => {
		if (!normalizedSrc.value) return "";
		const clean = normalizedSrc.value.replace(/^\//, "");
		return `${import.meta.env.BASE_URL}${clean}`;
	});

	/**
	 * Détection JPEG :
	 * - on ne propose un <source webp> que si l’asset est un .jpg/.jpeg
	 */
	const isJpeg = computed(() => /\.(jpe?g)(\?.*)?$/i.test(resolvedSrc.value));

	/**
	 * URL WebP dérivée :
	 * - "/authors/adel.jpg" => "/authors/adel.webp"
	 * - garde d’éventuels query params
	 */
	const webpSrc = computed(() => {
		if (!isJpeg.value) return "";
		return resolvedSrc.value.replace(/\.(jpe?g)(\?.*)?$/i, ".webp$2");
	});

	</script>

	<template>
		<!--
			Si src existe :
			- on rend une vraie balise <img>
			- l’attribut alt est important (lecteurs d’écran, SEO, etc.)
			- on sert WebP si possible via <picture>, sinon fallback JPG
		-->
		<picture v-if="resolvedSrc" class="photo">
			<source v-if="isJpeg" :srcset="webpSrc" type="image/webp" />
			<img :src="resolvedSrc" :alt="alt || 'Photo'" loading="lazy" decoding="async" />
		</picture>

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
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		top: -3rem;
		width: 6rem;
		overflow: hidden;
		display: block;

		/**
		 * Quand on utilise <picture>, l'image est à l'intérieur :
		 * - on garde le même rendu que l'ancien <img>
		 */
		img {
			width: 100%;
			height: 100%;
			display: block;
			border-radius: inherit;
			object-fit: cover;
		}

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
