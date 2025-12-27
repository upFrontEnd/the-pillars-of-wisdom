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
