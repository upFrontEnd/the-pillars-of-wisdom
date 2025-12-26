<script setup lang="ts">
	/**
	 * Author (nom)
	 * - Affiche le nom de l'auteur.
	 * - Optionnel : si absent, on affiche un fallback.
	 */
	defineProps<{
		name?: string;
	}>();
	</script>

	<template>
		<p class="author">— {{ name || "Anonyme" }}</p>
	</template>

	<style scoped lang="scss">
	.author {
		margin: 0;
		color: var(--muted);
		font-size: 14px;
	}
	</style>
