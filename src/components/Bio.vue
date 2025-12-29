<script setup lang="ts">
	/**
	 * Bio.vue
	 *
	 * Objectif :
	 * - Afficher une courte bio (2–3 lignes) liée à l’auteur d’une citation.
	 *
	 * Pourquoi un composant séparé ?
	 * - La page (HomeView) ne devrait pas gérer les détails du rendu.
	 * - Ici on encapsule une règle simple : “si pas de bio => on n’affiche rien”.
	 */

	/**
	 * Props = données reçues du parent.
	 *
	 * `text?: string` signifie :
	 * - la bio est optionnelle (elle peut ne pas exister dans le JSON)
	 * - le composant doit rester “silencieux” si aucune bio n’est fournie
	 */
	defineProps<{
		text?: string;
	}>();
	</script>

	<template>
		<!--
			v-if="text" :
			- si text est vide / undefined => le <p> n'est même pas rendu dans le DOM
			- avantage : UI plus propre (pas d’espace inutile)
		-->
		<p v-if="text" class="bio">{{ text }}</p>
	</template>

	<style scoped lang="scss">

	.bio {
		font-family: "Bodoni Moda", serif;
		font-size: 1rem;
	}
	</style>
