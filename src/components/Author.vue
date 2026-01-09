<script setup lang="ts">
	/**
	 * Author.vue
	 *
	 * Objectif :
	 * - Afficher le nom de l’auteur d’une citation.
	 *
	 * A11y :
	 * - Utilise <cite> : sémantique adaptée pour une source / un auteur.
	 * - Ajoute un libellé invisible "Auteur :" pour donner du contexte aux lecteurs d’écran.
	 * - Permet d’annoncer (optionnellement) les changements de nom via aria-live,
	 *   utile si la citation/auteur change dynamiquement (fetch, bouton "suivant", etc.).
	 */

	/**
	 * Props = données reçues depuis le parent.
	 *
	 * - name?: string
	 *   Le nom de l’auteur (optionnel). Si absent, on affiche "Anonyme".
	 *
	 * - announce?: boolean
	 *   Active l’annonce du changement du contenu (aria-live="polite").
	 *   À activer seulement si le nom change dynamiquement.
	 */
	const props = defineProps<{
		name?: string;
		announce?: boolean;
	}>();
	</script>

	<template>
		<!--
			<cite> apporte une meilleure sémantique qu’un <p> pour indiquer une source/auteur.
			aria-live est optionnel pour éviter d’annoncer systématiquement des changements.
		-->
		<cite class="author" :aria-live="props.announce ? 'polite' : undefined">
			<!-- Libellé uniquement pour lecteurs d’écran : donne le contexte du texte -->
			<span class="sr-only">Auteur : </span>
			{{ props.name || "Anonyme" }}
		</cite>
	</template>

	<style scoped lang="scss">
	@use "../scss/abstracts" as *;

	.author {
		font-family: "Bodoni Moda", serif;
		font-size: 1.5rem;
		font-style: normal;
		color: var(--author);
	}

	/* Texte uniquement pour lecteurs d’écran (visually hidden) */
	.sr-only {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		white-space: nowrap;
		border: 0;
	}
	</style>
