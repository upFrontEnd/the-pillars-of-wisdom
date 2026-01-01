<script setup lang="ts">
/**
 * HomeView.vue (route "/")
 *
 * Objectif de cette page :
 * - Afficher une citation (texte + auteur + bio + photo)
 * - Permettre de passer à la citation suivante
 * - Proposer le partage
 *
 * Choix “Option B” pour le partage :
 * - Si le navigateur supporte la Web Share API (`navigator.share`) :
 *   => on affiche NativeShareButton (partage natif du téléphone)
 * - Sinon :
 *   => on affiche ShareButtons (fallback liens X / LinkedIn)
 *
 * Pourquoi le faire ici (dans HomeView) ?
 * - On centralise la décision “quel UI afficher ?” au niveau de la page.
 * - Ça évite d’afficher deux fois le partage (bug des 2 boutons).
 */

import { computed } from "vue";
import { useQuotes } from "../composables/useQuotes";

import Photo from "../components/Photo.vue";
import Citation from "../components/Citation.vue";
import Author from "../components/Author.vue";
import Bio from "../components/Bio.vue";
import ShareButtons from "../components/ShareButtons.vue";
import ThemeToggle from "../components/ThemeToggle.vue";
import NativeShareButton from "../components/NativeShareButton.vue";

/**
 * useQuotes() est la “source de vérité” pour les citations :
 * - currentQuote : la citation affichée maintenant (réactive)
 * - nextQuote()  : action pour passer à la suivante
 */
const { currentQuote, nextQuote, prevQuote, currentPosition, total } = useQuotes();

/**
 * canNativeShare
 *
 * Sert à détecter si le navigateur propose un partage natif.
 * - Sur mobile (Chrome Android, Safari iOS), c’est souvent disponible.
 * - Sur desktop, c’est plus variable.
 *
 * Le test est volontairement “safe” :
 * - `navigator` peut être absent dans certains contextes (SSR, tests).
 * - On vérifie que `navigator.share` est bien une fonction.
 */
const canNativeShare = computed(() => {
	return typeof navigator !== "undefined" && typeof navigator.share === "function";
});
</script>

<template>
	<main class="page">
		<header class="header">
			<h1 class="title">Les piliers<br />de la sagesse</h1>
			<ThemeToggle />
		</header>

		<!--
				Filet de sécurité :
				- si ton JSON est vide ou mal importé, currentQuote peut être null
				- on affiche un message au lieu de casser la page
			-->
		<p v-if="!currentQuote" class="muted">Aucune citation disponible.</p>

		<!--
				Contenu principal :
				- Affiché uniquement si currentQuote existe
			-->
		<div v-else class="container">
			<section class="card">
				<header class="card__header">
					<Photo
						:src="currentQuote.author?.photo"
						:alt="
							currentQuote.author?.name ? `Photo de ${currentQuote.author.name}` : 'Photo auteur'
						"
					/>
				</header>

				<div class="card__quote">
					<Citation :text="currentQuote.text" />
				</div>

				<div class="card__meta">
					<Author :name="currentQuote.author?.name" />
					<Bio :text="currentQuote.author?.bio" />
				</div>
			</section>

			<div class="actions">
				<button
					class="btn btn--icon"
					type="button"
					@click="prevQuote"
					aria-label="Afficher la citation précédente"
					:title="'Citation précédente'"
				>
					<svg
						class="icon"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="20"
						height="20"
						aria-hidden="true"
						focusable="false"
					>
						<path
							fill="currentColor"
							d="M15.5 5.5a1 1 0 0 1 0 1.4L10.4 12l5.1 5.1a1 1 0 1 1-1.4 1.4l-5.8-5.8a1 1 0 0 1 0-1.4l5.8-5.8a1 1 0 0 1 1.4 0Z"
						/>
					</svg>
					<span class="sr-only">Précédente</span>
				</button>

				<p class="pager" aria-label="Pagination">{{ currentPosition }}/{{ total }}</p>

				<button
					class="btn btn--icon"
					type="button"
					@click="nextQuote"
					aria-label="Afficher la citation suivante"
					:title="'Citation suivante'"
				>
					<svg
						class="icon"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						width="20"
						height="20"
						aria-hidden="true"
						focusable="false"
					>
						<path
							fill="currentColor"
							d="M8.5 18.5a1 1 0 0 1 0-1.4l5.1-5.1-5.1-5.1a1 1 0 1 1 1.4-1.4l5.8 5.8a1 1 0 0 1 0 1.4l-5.8 5.8a1 1 0 0 1-1.4 0Z"
						/>
					</svg>
					<span class="sr-only">Suivante</span>
				</button>
			</div>
		</div>

		<!--
				Footer :
				- contient le module de partage
				- Option B : NativeShareButton OU ShareButtons (jamais les deux)
			-->
		<footer v-if="currentQuote" class="footer">
			<NativeShareButton
				v-if="canNativeShare"
				:text="currentQuote.text"
				:author="currentQuote.author?.name"
				title="Les piliers de la sagesse"
			/>

			<ShareButtons v-else :text="currentQuote.text" :author="currentQuote.author?.name" />
		</footer>
	</main>
</template>

<style scoped lang="scss">
@use "../scss/abstracts" as *;

.page {
	background-image: linear-gradient(190deg, var(--app-bg-1) 0%, var(--app-bg-2) 100%);
	min-height: 100svh;
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: 10px;
	transition: all 0.3s ease;
}

.header,
.footer {
	margin: 0 auto;
	width: 90%;
}

.footer {
	text-align: center;
	color: #fff;
	padding: 1rem 0;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 0;

	h1 {
		color: var(--title);
		font-family: "Oswald", sans-serif;
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		font-style: normal;
		font-weight: 400;
		line-height: 1;
		text-transform: uppercase;
	}
}

.card {
	background: var(--card-bg);
	border: 7px solid #f4af57;
	border-radius: 5px;
	box-shadow:
		rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
		rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
	color: var(--card-text);
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: 10px;
	margin: 0 auto;
	padding: 20px;
	position: relative;
	height: clamp(440px, 62svh, 540px);
	width: 90%;

	&__quote {
		display: grid;
		place-items: center;
		overflow: hidden;
		min-height: 0;
	}

	&__meta {
		text-align: center;
	}
}

.actions {
	display: flex;
	justify-content: space-between;
	gap: 10px;
	margin: 0 auto;
	padding: 1rem 0 2rem;
	width: 90%;
	.pager {
		border: 1px solid var(--btn-border);
		background: var(--btn-bg);
		border-radius: 10px;
		font-family: "Oswald", sans-serif;
		font-size: 0.9rem;
		color: var(--btn-text);
		align-self: center;
		padding: 10px 12px;
	}
}

.btn {
	border: 1px solid var(--btn-border);
	background: var(--btn-bg);
	border-radius: 10px;
	color: var(--btn-text);
	cursor: pointer;
	font-family: "Oswald", sans-serif;
	padding: 10px 12px;
	text-transform: uppercase;
	letter-spacing: 0.1rem;
	transition:
		background 0.3s ease,
		color 0.3s ease,
		border-color 0.3s ease;

	&:hover {
		background: var(--btn-bg-hover);
		color: var(--btn-text-hover);
	}
}
</style>
