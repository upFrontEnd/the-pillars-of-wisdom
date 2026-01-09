<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * Bio.vue
	 *
	 * A11y :
	 * - Ajoute un libellé sr-only "Bio :" pour contextualiser le contenu.
	 */
	const props = defineProps<{
		text?: string;
		id?: string;
	}>();

	const bio = computed(() => props.text?.trim() || "");
	</script>

	<template>
		<p v-if="bio" class="bio" :id="props.id">
			<span class="sr-only">Bio : </span>
			{{ bio }}
		</p>
	</template>

	<style scoped lang="scss">
	.bio {
		font-family: "Bodoni Moda", serif;
		font-size: 1rem;
		line-height: 1.5;
	}

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
