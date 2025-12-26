import { computed, ref } from "vue";
import type { QuoteItem } from "../types/quote";

// Import statique du JSON (bundlé par Vite au build)
import rawQuotes from "../data/quotes.json";

/**
 * Composable : useQuotes()
 *
 * Un “composable” (Composition API) est une fonction qui encapsule :
 * - de l’état réactif (ref / reactive)
 * - des valeurs dérivées (computed)
 * - des actions (fonctions)
 *
 * Pourquoi un composable ici ?
 * - On veut isoler la logique “métier” (choisir une citation) hors des composants UI.
 * - Les composants deviennent simples : ils affichent ce qu’on leur donne (props).
 * - C’est une excellente étape avant Pinia : même concept (state + actions), mais plus léger.
 *
 * Quand migrer vers Pinia ?
 * - Si plusieurs pages doivent partager/modifier cet état.
 * - Si tu ajoutes de la persistance (localStorage) ou des fetch API.
 */

/**
 * Dataset source (JSON)
 *
 * On cast en QuoteItem[] car JSON n’est pas typé nativement.
 * Hypothèse :
 * - Ton fichier quotes.json respecte bien la structure QuoteItem (id/text/author...).
 *
 * Limite :
 * - TypeScript ne “valide” pas à l’exécution.
 * - Si le JSON est invalide, l’app pourrait se comporter bizarrement.
 *   (plus tard : on pourra ajouter une validation runtime)
 */
const quotes = rawQuotes as QuoteItem[];

/**
 * Renvoie un nouvel index aléatoire différent de l'actuel (si possible).
 *
 * Pourquoi éviter le même index ?
 * - UX : cliquer "Nouvelle citation" et voir la même citation est frustrant.
 *
 * Cas limites :
 * - Si length <= 1, on force 0 (pas d'alternative possible).
 */
function pickNewIndex(current: number, length: number): number {
	if (length <= 1) return 0;

	let next = current;

	// Tant qu'on retombe sur la même, on relance un tirage
	while (next === current) {
		next = Math.floor(Math.random() * length);
	}

	return next;
}

export function useQuotes() {
	/**
	 * Index de la citation courante.
	 *
	 * - ref() rend la valeur réactive
	 * - Quand currentIndex change, les computed dépendants se recalculent
	 * - Et le template se re-render automatiquement
	 */
	const currentIndex = ref(0);

	/**
	 * Citation courante (valeur dérivée)
	 *
	 * - computed = "getter" réactif
	 * - Mis en cache tant que currentIndex ne change pas
	 *
	 * On retourne QuoteItem | null pour gérer les cas où le JSON serait vide.
	 */
	const currentQuote = computed<QuoteItem | null>(() => {
		if (!quotes.length) return null;
		return quotes[currentIndex.value] ?? null;
	});

	/**
	 * Action : passer à une nouvelle citation.
	 *
	 * - Ne touche pas au dataset, uniquement l'index
	 * - Déclenche automatiquement la mise à jour de currentQuote et de l’UI
	 */
	function nextQuote() {
		currentIndex.value = pickNewIndex(currentIndex.value, quotes.length);
	}

	/**
	 * API publique du composable :
	 * - currentQuote : la citation à afficher
	 * - nextQuote : l’action du bouton "Nouvelle citation"
	 * - quotes/currentIndex : exposés pour debug / usages futurs (liste, stats, etc.)
	 */
	return {
		quotes,
		currentIndex,
		currentQuote,
		nextQuote,
	};
}
