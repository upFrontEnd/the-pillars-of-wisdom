<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * NativeShareButton
	 *
	 * Objectif :
	 * - Afficher un bouton "Partager" qui ouvre le menu de partage natif sur mobile
	 *   (WhatsApp, Mail, etc.) grâce à la Web Share API.
	 *
	 * Important :
	 * - Cette API n'existe pas partout (desktop / certains navigateurs).
	 * - Donc ce composant décide tout seul s'il peut fonctionner.
	 *   S'il ne peut pas, il ne s'affiche pas (v-if côté parent possible),
	 *   ou tu peux gérer un fallback à côté.
	 */

	/**
	 * Données nécessaires au partage.
	 * - text : contenu principal (la citation)
	 * - author : optionnel (pour enrichir le texte)
	 * - title : optionnel (titre dans la feuille de partage)
	 */
	const props = defineProps<{
		text: string;
		author?: string;
		title?: string;
	}>();

	/**
	 * Texte final partagé.
	 * - Si on a un auteur : "citation — auteur"
	 */
	const shareText = computed(() =>
		props.author ? `${props.text} — ${props.author}` : props.text,
	);

	/**
	 * URL de la page courante.
	 * - Sur ton projet Vite côté navigateur, window.location existe.
	 */
	const shareUrl = computed(() => window.location.href);

	/**
	 * Vérifie si le partage natif est dispo.
	 * - On teste navigator.share (fonction) => check le plus sûr.
	 */
	const canShare = computed(
		() => typeof navigator !== "undefined" && typeof navigator.share === "function",
	);

	/**
	 * Action au clic :
	 * - ouvre le menu natif.
	 * - doit être appelé suite à un geste utilisateur (clic),
	 *   sinon certains navigateurs le bloquent.
	 */
	async function onShare() {
		if (!canShare.value) return;

		await navigator.share({
			title: props.title ?? "Good Mood Generator",
			text: shareText.value,
			url: shareUrl.value,
		});
	}
	</script>

	<template>
		<button v-if="canShare" class="btn" type="button" @click="onShare">
			Partager
		</button>
	</template>

	<style scoped lang="scss">
	@use "../scss/abstracts" as *;

	.btn {
		border: 1px solid #f4af57;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 10px;
		color: #f4af57;
		cursor: pointer;
		font-family: $font-family-base;
		padding: 10px 12px;
	}
	</style>
