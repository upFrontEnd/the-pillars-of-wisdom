<script setup lang="ts">
	/**
	 * Photo
	 * - Responsabilité unique : afficher une image (ou un fallback).
	 * - Réutilisable : auteur, illustration, etc.
	 */
	defineProps<{
		src?: string;
		alt?: string;
	}>();
	</script>

	<template>
		<img v-if="src" class="photo" :src="src" :alt="alt || 'Photo'" />
		<div v-else class="photo photo--fallback" aria-hidden="true"></div>
	</template>

	<style scoped lang="scss">
	.photo {
		width: 56px;
		height: 56px;
		border-radius: 999px;
		border: 1px solid var(--border);
		object-fit: cover;

		&--fallback {
			background: rgba(255, 255, 255, 0.06);
		}
	}
	</style>
