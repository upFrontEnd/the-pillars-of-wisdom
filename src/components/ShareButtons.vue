<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * ShareButtons.vue
	 *
	 * Objectif :
	 * - Permettre à l’utilisateur de partager la citation.
	 *
	 * Deux modes possibles :
	 * 1) Partage “natif” (Web Share API)
	 *    - surtout sur mobile (iOS/Android)
	 *    - ouvre le menu de partage du téléphone (messages, apps, etc.)
	 * 2) Fallback (si pas de partage natif)
	 *    - on affiche des liens de partage (X, LinkedIn)
	 *
	 */

	/**
	 * Props = données reçues du parent.
	 *
	 * - text : le texte de la citation (obligatoire)
	 * - author : nom de l’auteur (optionnel)
	 */
	const props = defineProps<{
		text: string;
		author?: string;
	}>();

	/**
	 * shareText = le texte final qu’on veut partager.
	 *
	 * - Si on a un auteur, on construit : "citation — auteur"
	 * - Sinon, on partage juste la citation
	 *
	 * computed :
	 * - se recalcule automatiquement si text/author changent
	 */
	const shareText = computed(() => (props.author ? `${props.text} — ${props.author}` : props.text));

	/**
	 * pageUrl = l’URL de la page actuelle.
	 *
	 * - C’est utile pour que le partage pointe vers ton site.
	 * - Ici, comme on est dans une app Vite côté navigateur, window.location est disponible.
	 */
	const pageUrl = computed(() => window.location.href);

	/**
	 * canNativeShare = est-ce que le navigateur supporte "navigator.share" ?
	 *
	 * Pourquoi ce check ?
	 * - Certains navigateurs n’ont pas l’API.
	 * - Et on veut éviter tout crash si navigator est indisponible.
	 *
	 * Résultat :
	 * - true  => on affiche un bouton "Partager" (menu natif)
	 * - false => on affiche les liens X / LinkedIn
	 */
	const canNativeShare = computed(() => typeof navigator !== "undefined" && typeof navigator.share === "function");

	/**
	 * xUrl = lien de partage pour X (ancien Twitter).
	 *
	 * On construit une URL du type :
	 * - https://twitter.com/intent/tweet?text=...&url=...
	 *
	 * URL + searchParams :
	 * - permet d’encoder correctement les caractères (accents, guillemets, etc.)
	 */
	const xUrl = computed(() => {
		const u = new URL("https://twitter.com/intent/tweet");
		u.searchParams.set("text", shareText.value);
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	/**
	 * linkedInUrl = lien de partage LinkedIn.
	 *
	 * Format LinkedIn :
	 * - https://www.linkedin.com/sharing/share-offsite/?url=...
	 */
	const linkedInUrl = computed(() => {
		const u = new URL("https://www.linkedin.com/sharing/share-offsite/");
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	/**
	 * nativeShare() = action appelée au clic sur "Partager".
	 *
	 * - On re-check canNativeShare pour être sûr (sécurité).
	 * - navigator.share ouvre le “menu de partage” du navigateur/appareil.
	 */
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
		<!-- Conteneur global -->
		<div class="share">
			<!--
				Mode 1 : partage natif
				- affiché uniquement si le navigateur sait le faire
			-->
			<button v-if="canNativeShare" class="btn" type="button" @click="nativeShare">
				Partager
			</button>

			<!--
				Mode 2 : fallback liens
				- affiché si le partage natif n’existe pas
				- target="_blank" => ouvre dans un nouvel onglet
				- rel="noreferrer" => bonne pratique sécurité / confidentialité
			-->
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
		border: 1px solid #c7c7c7;
		background: rgba(255, 255, 255, 0.06);
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
