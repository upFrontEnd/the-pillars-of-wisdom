<script setup lang="ts">
	/**
	 * Citation (texte)
	 * - N'affiche que le contenu de la citation.
	 * - Le choix de la citation (random, etc.) est géré ailleurs (useQuotes).
	 */
	defineProps<{
		text: string;
	}>();
	</script>

	<template>
		<p class="citation">“{{ text }}”</p>
	</template>

	<style scoped lang="scss">
	.citation {
		margin: 0;
		font-size: 18px;
		line-height: 1.4;
	}
	</style>
	