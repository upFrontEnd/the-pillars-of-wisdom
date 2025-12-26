<script setup lang="ts">
	/**
	 * Bio
	 * - Affiche une bio courte si disponible.
	 * - Si absent : ne rend rien (évite d'encombrer l'UI).
	 */
	defineProps<{
		text?: string;
	}>();
	</script>

	<template>
		<p v-if="text" class="bio">{{ text }}</p>
	</template>

	<style scoped lang="scss">
	.bio {
		margin: 0;
		color: var(--muted);
		font-size: 12px;
		line-height: 1.4;
	}
	</style>
