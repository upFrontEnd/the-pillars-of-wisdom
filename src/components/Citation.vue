<script setup lang="ts">
	import { computed } from "vue";

	/**
	 * Citation.vue
	 *
	 * Objectif :
	 * - Afficher uniquement le texte de la citation.
	 *
	 * Nouveau besoin :
	 * - Certaines citations contiennent des balises `<br/>` dans le JSON
	 *   pour forcer des retours à la ligne.
	 *
	 * Problème :
	 * - Avec `{{ text }}`, Vue affiche le HTML “en texte” (il échappe le HTML).
	 *   Donc `<br/>` s’affiche littéralement au lieu de faire un saut de ligne.
	 *
	 * Solution (sûre) :
	 * - On utilise `v-html` pour que `<br>` soit interprété.
	 * - MAIS `v-html` peut être dangereux si on injecte du HTML non maîtrisé.
	 *
	 * Donc on applique une règle simple :
	 * - On échappe TOUT le HTML (donc aucun tag ne passe),
	 * - puis on “ré-autorise” uniquement `<br>`, `<br/>`, `<br />`.
	 *
	 * Résultat :
	 * - seuls les retours à la ligne fonctionnent,
	 * - le reste reste du texte inoffensif.
	 */

	/**
	 * Props = données reçues du parent (ex: HomeView).
	 *
	 * Ici, `text` est obligatoire :
	 * - si on affiche une Citation, on doit forcément avoir un texte.
	 * - TypeScript te protège : impossible d'oublier `:text="..."`
	 */
	const props = defineProps<{
		text: string;
	}>();

	/**
	 * escapeHtml()
	 *
	 * Rôle :
	 * - Empêcher l’injection de HTML.
	 *
	 * Exemple :
	 * - si le texte contient `<b>Salut</b>`, on le transforme en `&lt;b&gt;Salut&lt;/b&gt;`
	 *   => ça s’affichera en texte, pas en HTML.
	 */
	function escapeHtml(input: string): string {
		return input
			.replaceAll("&", "&amp;")
			.replaceAll("<", "&lt;")
			.replaceAll(">", "&gt;")
			.replaceAll('"', "&quot;")
			.replaceAll("'", "&#039;");
	}

	/**
	 * citationHtml
	 *
	 * Étapes :
	 * 1) on échappe tout (sécurité)
	 * 2) on remet uniquement les retours ligne via <br>
	 *
	 * Supporte :
	 * - <br>
	 * - <br/>
	 * - <br />
	 * (et même si quelqu’un écrit BR en majuscules)
	 */
	const citationHtml = computed(() => {
		const safe = escapeHtml(props.text);

		// Ré-autorise uniquement les balises <br...>
		return safe.replace(/&lt;br\s*\/?&gt;/gi, "<br>");
	});
	</script>

	<template>
		<!--
			On utilise v-html pour interpréter les <br>.
			Important :
			- On ne passe PAS props.text directement à v-html.
			- On passe citationHtml (déjà nettoyé).
		-->
		<p class="citation" v-html="citationHtml"></p>
	</template>

	<style scoped lang="scss">
	.citation {
		font-family: "Bodoni Moda", serif;
		font-optical-sizing: auto;
		font-size: 1.8rem;
		font-style: normal;
		font-weight: 700;
		line-height: 1.4;
		margin: 0 auto;
		opacity: 0.8;
		padding: 1rem 2rem;
		position: relative;
		text-align: center;
		z-index: 5;

		&::after,
		&::before {
			color: #f4af57;
			font-size: 5rem;
			line-height: 1;
			position: absolute;
			z-index: -5;
		}

		&::before {
			content: "“";
			left: 0;
			top: 0;
		}

		&::after {
			content: "”";
			right: 0;
			bottom: -36px;
		}
	}
	</style>
