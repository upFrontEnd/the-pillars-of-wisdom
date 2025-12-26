<script setup lang="ts">
	/**
	 * HomeView (route "/")
	 *
	 * Rôle du fichier :
	 * - C'est une "vue" (page) : elle correspond à une route du router.
	 * - Elle orchestre l’affichage (layout) et les interactions (boutons).
	 *
	 * Philosophie d’architecture (montée en compétence) :
	 * - La vue ne contient pas la logique métier du tirage de citations.
	 *   Cette logique est isolée dans un composable : useQuotes().
	 * - La vue assemble des composants atomiques (Photo/Citation/Author/Bio/ShareButtons).
	 *   Chaque composant a une responsabilité unique : affichage (UI).
	 */

	import { useQuotes } from "../composables/useQuotes";

	// Composants atomiques : chacun affiche une partie bien précise de la donnée.
	import Photo from "../components/Photo.vue";
	import Citation from "../components/Citation.vue";
	import Author from "../components/Author.vue";
	import Bio from "../components/Bio.vue";
	import ShareButtons from "../components/ShareButtons.vue";

	/**
	 * Source de vérité pour la citation courante :
	 * - currentQuote : computed (réactif) => l'UI se met à jour automatiquement.
	 * - nextQuote() : action => change la citation en modifiant un index interne.
	 */
	const { currentQuote, nextQuote } = useQuotes();
	</script>

	<template>
		<main class="page">
			<h1 class="h1">Les piliers de la sagesse</h1>

			<!--
				Cas limite (robustesse) :
				- Si le JSON est vide ou mal importé, currentQuote peut être null.
				- On affiche un message au lieu d’avoir une UI cassée.
			-->
			<p v-if="!currentQuote" class="muted">Aucune citation disponible.</p>

			<!--
				UI principale :
				- "card" = conteneur de présentation
				- On affiche une citation + infos auteur + actions
			-->
			<section v-else class="card">
				<header class="card__header">
					<!--
						Photo :
						- src peut être undefined (si pas de photo dans le JSON)
						- le composant Photo gère un fallback automatiquement
					-->
					<Photo
						:src="currentQuote.author?.photo"
						:alt="currentQuote.author?.name ? `Photo de ${currentQuote.author.name}` : 'Photo auteur'"
					/>

					<!--
						Métadonnées auteur :
						- Author gère le fallback (Anonyme)
						- Bio ne rend rien si absent (v-if interne)
					-->
					<div class="card__meta">
						<Author :name="currentQuote.author?.name" />
						<Bio :text="currentQuote.author?.bio" />
					</div>
				</header>

				<!-- Citation (texte) -->
				<Citation :text="currentQuote.text" />

				<!--
					Action principale :
					- nextQuote() déclenche un nouveau tirage (dans useQuotes)
					- la vue se met à jour via la réactivité Vue
				-->
				<div class="card__actions">
					<button class="btn" type="button" @click="nextQuote">Nouvelle citation</button>
				</div>

				<!--
					Partage réseaux :
					- ShareButtons encapsule la logique : Web Share API ou fallback liens
					- On lui passe uniquement ce dont il a besoin : text + auteur (optionnel)
				-->
				<ShareButtons :text="currentQuote.text" :author="currentQuote.author?.name" />
			</section>
		</main>
	</template>

	<style scoped lang="scss">
	/**
	 * Styles locaux à HomeView (scoped)
	 *
	 * Pourquoi scoped ?
	 * - Empêche les collisions CSS entre pages et composants.
	 * - Permet de garder un SCSS global minimal (tokens/layout) et le reste “près” de l’UI.
	 *
	 * Mobile-first :
	 * - styles par défaut pensés pour mobile
	 * - media query uniquement pour améliorer sur écrans plus larges
	 */

	.card {
		background: var(--surface);
		border: 1px solid var(--border);
		border-radius: 14px;
		padding: 14px;
		display: grid;
		gap: 14px;

		&__header {
			display: grid;
			grid-template-columns: 56px 1fr;
			gap: 12px;
			align-items: start;
		}

		&__meta {
			display: grid;
			gap: 6px;
		}

		&__actions {
			display: flex;
		}
	}

	/**
	 * Bouton simple réutilisable à court terme.
	 * Note : plus tard, on pourra créer un composant Button.vue si besoin.
	 */
	.btn {
		border: 1px solid var(--border);
		background: rgba(255, 255, 255, 0.06);
		color: var(--text);
		border-radius: 10px;
		padding: 10px 12px;
		cursor: pointer;
	}

	/**
	 * “Upgrade” desktop :
	 * - on augmente le padding de la card sur les écrans plus larges
	 */
	@media (min-width: 640px) {
		.card {
			padding: 18px;
		}
	}
	</style>
