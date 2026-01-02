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
 * toPlainText()
 *
 * Objectif :
 * - Quand une citation contient `<br/>` (pour l’affichage),
 *   on ne veut PAS partager la balise HTML.
 * - On veut partager un “vrai” saut de ligne.
 *
 * Donc :
 * - `<br>`, `<br/>`, `<br />` => "\n"
 */
 function toPlainText(input: string): string {
	return input.replace(/<br\s*\/?>/gi, "\n");
}

/**
 * shareText
 *
 * - On transforme d’abord le texte en “texte brut” (sans HTML)
 * - Puis on ajoute l’auteur si présent
 */
const shareText = computed(() => {
	const plain = toPlainText(props.text);
	return props.author ? `${plain} — ${props.author}` : plain;
});

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
		title: "Les piliers de la sagesse",
		text: shareText.value,
		url: pageUrl.value,
	});
}
</script>

<template>
	<!--
			ShareButtons.vue (Template)

			Objectif :
			- Afficher UNE seule UI de partage à la fois :
				1) soit un bouton de partage natif (Web Share API)
				2) soit des liens de partage (fallback)

			Point clé (bug des “2 boutons”) :
			- `v-else` doit être attaché DIRECTEMENT au `v-if`.
			- Si un commentaire/nœud texte s’intercale, Vue peut “décrocher” le v-else.
			- La solution robuste : mettre v-if / v-else sur des <template>.
		-->
	<div class="share">
		<!--
				Mode 1 — Partage natif (Web Share API)

				Condition :
				- `canNativeShare` = true si `navigator.share` existe.
				Comportement :
				- Au clic, on appelle `nativeShare()`, qui ouvre le menu de partage du téléphone
					(WhatsApp, Messages, Mail, etc. selon l’appareil).
			-->
		<template v-if="canNativeShare">
			<button class="btn" type="button" @click="nativeShare">Partager la citation</button>
		</template>

		<!--
				Mode 2 — Fallback (liens)

				Quand ?
				- Si le navigateur ne supporte pas le partage natif (souvent desktop).

				Détails des attributs :
				- target="_blank" : ouvre le lien dans un nouvel onglet
				- rel="noreferrer" : évite d’envoyer le referrer et limite certains risques
			-->
		<template v-else>
			<div class="share__links">
				<a class="link" :href="xUrl" target="_blank" rel="noreferrer">Partager sur X</a>
				<a class="link" :href="linkedInUrl" target="_blank" rel="noreferrer"
					>Partager sur LinkedIn</a
				>
			</div>
		</template>
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
	font-family: "Oswald", sans-serif;
	cursor: pointer;
	padding: 10px 12px;
	text-transform: uppercase
}

.link {
	@extend .btn;
	border: 1px solid var(--btn-border);
	color: var((--btn-border));
	font-size: .8rem;
	text-decoration: none;
	width: 170px;
	transition: all 0.3s ease;
	&:hover {
		background: var(--btn-border);
		color: var(--btn-text-hover);
	}
}
</style>
