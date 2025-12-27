<script setup lang="ts">
	/**
	 * Citation.vue
	 *
	 * Objectif :
	 * - Afficher uniquement le texte de la citation.
	 *
	 * Point important :
	 * - Ce composant ne choisit pas la citation.
	 * - Il ne fait pas de "random".
	 * - Il reçoit un texte déjà prêt à afficher (via props).
	 *
	 * Avantage :
	 * - Séparation des responsabilités :
	 *   - useQuotes() = “quelle citation afficher ?”
	 *   - Citation.vue = “comment l’afficher ?”
	 */

	/**
	 * Props = données reçues du parent (ex: HomeView).
	 *
	 * Ici, `text` est obligatoire :
	 * - si on affiche une Citation, on doit forcément avoir un texte.
	 * - TypeScript te protège : impossible d'oublier `:text="..."`
	 */
	defineProps<{
		text: string;
	}>();
	</script>

	<template>
		<p class="citation">{{ text }}</p>
	</template>

	<style scoped lang="scss">

	.citation {
		font-family: "Bodoni Moda", serif;
		font-optical-sizing: auto;
		font-size: 1.8rem;
		font-style: normal;
		font-weight: 700;
		line-height: 1.4;
		padding: 1rem;
		position: relative;
		text-align: center;
		&::after,
		&::before {
			color: #f4af57;
			font-size: 5rem;
			line-height: 1;
			position: absolute;
			z-index: 0;
		}
		&::before {
			content: "“";
			left: 0;
			top: 0;
		}
		&::after {
			content: "”";
			right: 0;
			bottom: -36px;
		}
	}
	</style>
