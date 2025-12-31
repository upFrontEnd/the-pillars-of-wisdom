<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * ShareButtons.vue
	 *
	 * Ce composant sert à “partager la citation” de 2 manières :
	 *
	 * 1) Si le navigateur supporte la Web Share API (souvent sur mobile)
	 *    => on affiche un bouton “Partager” qui ouvre le menu natif
	 *       (WhatsApp, Mail, Messages, etc.).
	 *
	 * 2) Sinon (souvent sur desktop)
	 *    => on affiche des liens de partage (X, LinkedIn).
	 *
	 * Idée importante :
	 * - Le composant ne choisit pas la citation.
	 * - Il reçoit le texte (et l’auteur) depuis le parent (HomeView).
	 */

	/**
	 * Props :
	 * - text   : la citation (obligatoire)
	 * - author : nom de l’auteur (optionnel)
	 *
	 * Le parent fait par exemple :
	 * <ShareButtons :text="currentQuote.text" :author="currentQuote.author?.name" />
	 */
	const props = defineProps<{
		text: string;
		author?: string;
	}>();

	/**
	 * shareText :
	 * - C’est le texte “final” qu’on veut partager.
	 * - Si author existe, on ajoute “— author” à la fin.
	 *
	 * computed :
	 * - Vue recalcule automatiquement si props.text / props.author changent.
	 */
	const shareText = computed(() =>
		props.author ? `${props.text} — ${props.author}` : props.text,
	);

	/**
	 * pageUrl :
	 * - URL de la page actuelle.
	 * - On l’ajoute au partage pour que la citation pointe vers ton site.
	 *
	 * Note :
	 * - window.location.href est accessible côté navigateur.
	 * - Dans ton app Vite (client-only), c’est OK.
	 */
	const pageUrl = computed(() => window.location.href);

	/**
	 * canNativeShare :
	 * - true si le navigateur a la fonction `navigator.share`
	 * - false sinon
	 *
	 * Pourquoi ce check ?
	 * - On veut éviter toute erreur si l’API n’existe pas.
	 * - Certains navigateurs (desktop) ne la supportent pas.
	 *
	 * On ne fait pas de `('share' in navigator)` :
	 * - l’opérateur `in` peut jeter une erreur si la valeur testée est undefined.
	 * - ici on utilise un test simple et sûr : typeof navigator.share === "function"
	 */
	const canNativeShare = computed(() => {
		return typeof navigator !== "undefined" && typeof navigator.share === "function";
	});

	/**
	 * xUrl :
	 * - URL de partage pour X (tweet intent).
	 *
	 * Pourquoi utiliser URL + searchParams ?
	 * - Ça encode correctement les caractères spéciaux (accents, guillemets, etc.).
	 * - Ça évite les erreurs de concaténation à la main.
	 */
	const xUrl = computed(() => {
		const u = new URL("https://twitter.com/intent/tweet");
		u.searchParams.set("text", shareText.value);
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	/**
	 * linkedInUrl :
	 * - URL de partage LinkedIn (share-offsite).
	 */
	const linkedInUrl = computed(() => {
		const u = new URL("https://www.linkedin.com/sharing/share-offsite/");
		u.searchParams.set("url", pageUrl.value);
		return u.toString();
	});

	/**
	 * nativeShare :
	 * - Action appelée au clic sur le bouton “Partager”.
	 *
	 * Important :
	 * - `navigator.share()` doit être déclenché par un geste utilisateur (clic/tap),
	 *   sinon le navigateur peut le bloquer.
	 * - On re-vérifie canNativeShare (sécurité).
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
		<!--
			Conteneur du module de partage.
			Il gère l’espacement et l’alignement.
		-->
		<div class="share">
			<!--
				Mode “natif” :
				- visible uniquement si le navigateur supporte navigator.share
				- ouvre le menu de partage du device
			-->
			<button v-if="canNativeShare" class="btn" type="button" @click="nativeShare">
				Partager
			</button>

			<!--
				Mode “fallback” :
				- si pas de partage natif, on affiche des liens.
				- target="_blank" : nouvel onglet
				- rel="noreferrer" : bonne pratique de sécurité / confidentialité
			-->
			<div v-else class="share__links">
				<a class="link" :href="xUrl" target="_blank" rel="noreferrer">Partager sur X</a>
				<a class="link" :href="linkedInUrl" target="_blank" rel="noreferrer">Partager sur LinkedIn</a>
			</div>
		</div>
	</template>

	<style scoped lang="scss">
	@use "../scss/abstracts" as *;

	.share {
		font-family: $font-family-base;
		display: grid;
		gap: 10px;

		&__links {
			display: flex;
			gap: 12px;
			justify-content: center;
		}
	}

	.btn {
		border: 1px solid #f4af57;
		background: rgba(255, 255, 255, 0.06);
		border-radius: 10px;
		color: #f4af57;
		cursor: pointer;
		padding: 10px 12px;
	}

	.link {
		color: #c7c7c7;
		text-decoration: none;

		&:hover {
			color: #f4af57;
		}
	}
	</style>
