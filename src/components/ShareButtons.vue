<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * ShareButtons
	 * - Partage natif si disponible (mobile souvent)
	 * - Sinon fallback liens (X / LinkedIn)
	 *
	 * Important :
	 * - On ne fait jamais `('share' in navigator)` directement dans le template,
	 *   car l'opérateur `in` throw si la RHS n'est pas un objet.
	 */
	const props = defineProps<{
		text: string;
		author?: string;
	}>();

	/** Texte final à partager */
	const shareText = computed(() => (props.author ? `${props.text} — ${props.author}` : props.text));

	/**
	 * Page URL :
	 * - on utilise location.href uniquement côté navigateur
	 */
	const pageUrl = computed(() => window.location.href);

	/**
	 * Détecte si l'API Web Share est disponible.
	 * - check safe : navigator existe et navigator.share est une fonction
	 */
	const canNativeShare = computed(() => typeof navigator !== "undefined" && typeof navigator.share === "function");

	const xUrl = computed(() => {
		const u = new URL("https://twitter.com/intent/tweet");
		u.searchParams.set("text", shareText.value);
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	const linkedInUrl = computed(() => {
		const u = new URL("https://www.linkedin.com/sharing/share-offsite/");
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	async function nativeShare() {
		if (!canNativeShare.value) return;

		await navigator.share({
			title: "Good Mood Generator",
			text: shareText.value,
			url: pageUrl.value,
		});
	}
	</script>

	<template>
		<div class="share">
			<button v-if="canNativeShare" class="btn" type="button" @click="nativeShare">
				Partager
			</button>

			<div v-else class="share__links">
				<a class="link" :href="xUrl" target="_blank" rel="noreferrer">Partager sur X</a>
				<a class="link" :href="linkedInUrl" target="_blank" rel="noreferrer">Partager sur LinkedIn</a>
			</div>
		</div>
	</template>

	<style scoped lang="scss">
	.share {
		display: grid;
		gap: 10px;

		&__links {
			display: flex;
			gap: 12px;
			flex-wrap: wrap;
		}
	}

	.btn {
		border: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.06);
		color: var(--text);
		border-radius: 10px;
		padding: 10px 12px;
		cursor: pointer;
	}

	.link {
		color: var(--muted);
		text-decoration: none;

		&:hover {
			color: var(--text);
		}
	}
	</style>
