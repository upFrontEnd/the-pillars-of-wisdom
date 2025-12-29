<script setup lang="ts">
	/**
	 * Author.vue
	 *
	 * Objectif :
	 * - Afficher le nom de l’auteur d’une citation.
	 *
	 */

	/**
	 * Props = données reçues depuis le parent (ex: HomeView).
	 *
	 * Ici, on reçoit :
	 * - name : le nom de l’auteur
	 *
	 * `name?: string` signifie :
	 * - la prop peut être absente (undefined)
	 * - l’app doit fonctionner même si l’auteur n’est pas renseigné dans le JSON
	 */
	defineProps<{
		name?: string;
	}>();
	</script>

	<template>
		<p class="author">{{ name || "Anonyme" }}</p>
	</template>

	<style scoped lang="scss">

	.author {
		font-family: "Bodoni Moda", serif;
		font-size: 1.5rem;
	}
	</style>
