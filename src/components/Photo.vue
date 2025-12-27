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
		aspect-ratio: 1;
		background: #fff;
  	border-radius: 50%;
  	border: 1px solid #c7c7c7;
  	object-fit: cover;
		padding: .2rem;
		width: 80px;
		&--fallback {
			background: rgba(255, 255, 255, 0.06);
		}
	}
	</style>
