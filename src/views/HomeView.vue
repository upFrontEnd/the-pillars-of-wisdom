<script setup lang="ts">
/**
 * HomeView = la page d’accueil (URL "/")
 *
 * À retenir :
 * - Le router dit : “quand on va sur /, on affiche HomeView”.
 * - HomeView ne “fabrique” pas les citations : elle les affiche.
 * - Toute la logique “quelle citation montrer ?” est dans useQuotes().
 */

import { useQuotes } from "../composables/useQuotes";
import Photo from "../components/Photo.vue";
import Citation from "../components/Citation.vue";
import Author from "../components/Author.vue";
import Bio from "../components/Bio.vue";
import ShareButtons from "../components/ShareButtons.vue";
import ThemeToggle from "../components/ThemeToggle.vue";

/**
 * useQuotes() nous donne :
 * - currentQuote : “la citation à afficher maintenant”
 * - nextQuote() : “passe à une autre citation”
 *
 * Comme currentQuote est réactif, l’écran se met à jour tout seul quand on clique.
 */
const { currentQuote, nextQuote, prevQuote } = useQuotes();
</script>

<template>
	<main class="page">
		<header class="header">
			<h1 class="title">Les piliers<br />de la sagesse</h1>
			<ThemeToggle />
		</header>

		<!--
				Filet de sécurité :
				- si ton JSON est vide (ou mal importé), currentQuote vaut null
				- on affiche un message plutôt qu’une page cassée
			-->
		<p v-if="!currentQuote" class="muted">Aucune citation disponible.</p>

		<!--
				La “carte” principale :
				- on affiche la citation + infos auteur + actions
			-->
		<div v-else class="container">
		<section class="card">
			<header class="card__header">
				<Photo
					:src="currentQuote.author?.photo"
					:alt="currentQuote.author?.name ? `Photo de ${currentQuote.author.name}` : 'Photo auteur'"
				/>
				<!--
						Infos auteur :
						- Author affiche “Anonyme” si pas de nom
						- Bio n’affiche rien si la bio est absente
					-->
			</header>

			<!-- Texte de la citation -->
			<div class="card__quote">
				<Citation :text="currentQuote.text" />
			</div>

			<div class="card__meta">
				<Author :name="currentQuote.author?.name" />
				<Bio :text="currentQuote.author?.bio" />
			</div>
		</section>
			<!--
				Bouton principal :
				- clique => nextQuote()
				- nextQuote change un index dans useQuotes()
				- Vue re-render automatiquement avec la nouvelle citation
			-->
			<div class="actions">
				<button class="btn" type="button" @click="prevQuote">Citation préc.</button>
				<button class="btn" type="button" @click="nextQuote">Citation suiv.</button>
			</div>
			</div>
		<footer v-if="currentQuote" class="footer">

			<!--
					Partage :
					- si le navigateur supporte le partage natif => bouton “Partager”
					- sinon => liens de partage
					- on lui passe uniquement les infos utiles
				-->
			<ShareButtons :text="currentQuote.text" :author="currentQuote.author?.name" />
		</footer>
	</main>
</template>

<style scoped lang="scss">
@use "../scss/abstracts" as *;
/**
	 * Styles de HomeView (scoped = ça ne déborde pas ailleurs)
	 *
	 * Mobile-first :
	 * - on définit d’abord le style pour mobile
	 * - ensuite on améliore pour les écrans plus larges
	 */
.page {
	min-height: 100svh;
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: 10px;
}

.header,
.footer {
	margin: 0 auto;
	width: 90%;
}

.footer {
	text-align: center;
}

.header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 1rem 0 0;
	h1 {
		color: #f4af57;
		font-family: "Oswald", sans-serif;
		font-size: clamp(1.2rem, 2.5vw, 1.5rem);
		font-style: normal;
		font-weight: 400;
		line-height: 1;
		text-transform: uppercase;
	}
}

.card {
	align-self: center;
	background: #fff;
	border: 7px solid #f4af57;
	border-radius: 5px;
	box-shadow:
		rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
		rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
	display: grid;
	grid-template-rows: auto 1fr auto;
	gap: 10px;
	margin: 0 auto;
	padding: 20px;
	position: relative;
	height: clamp(440px, 62svh, 540px);
	width: 90%;

	&__header {

	}

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
		justify-content: center;
		gap: 10px;
		margin: 0 auto;
		padding: 1rem 0 2rem;
		width: 90%;
}

.footer {
	color: #fff;
	padding: 1rem 0;
}

.btn {
	border: 1px solid #f4af57;
	background: rgba(255, 255, 255, 0.06);
	border-radius: 10px;
	color: #f4af57;
	cursor: pointer;
	font-family: "Oswald", sans-serif;
	padding: 10px 12px;
}
</style>
