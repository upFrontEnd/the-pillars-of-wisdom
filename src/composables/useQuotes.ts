import { computed, ref } from "vue";
import type { QuoteItem } from "../types/quote";
import rawQuotes from "../data/quotes.json";

const quotes = rawQuotes as QuoteItem[];

/**
 * Retourne un index aléatoire (différent de l’index courant si possible).
 */
function pickNewIndex(current: number, length: number): number {
	if (length <= 1) return 0;

	let next = current;
	while (next === current) {
		next = Math.floor(Math.random() * length);
	}
	return next;
}

export function useQuotes() {
	/**
	 * Index de la citation affichée actuellement.
	 */
	const currentIndex = ref(0);

	/**
	 * Historique des index déjà affichés.
	 *
	 * Idée :
	 * - Quand on va “suivant”, on mémorise l’index courant dans history.
	 * - Quand on va “précédent”, on récupère le dernier index de history.
	 *
	 * C’est exactement comme le bouton “retour” d’un navigateur.
	 */
	const history = ref<number[]>([]);

	/**
	 * La citation actuellement affichée.
	 * On renvoie null si le JSON est vide (sécurité UI).
	 */
	const currentQuote = computed<QuoteItem | null>(() => {
		if (!quotes.length) return null;
		return quotes[currentIndex.value] ?? null;
	});


	/**
	 * Action : afficher une nouvelle citation (aléatoire).
	 *
	 * Important :
	 * - on sauvegarde l’index actuel dans l’historique
	 * - puis on choisit un nouvel index
	 */
	function nextQuote() {
		if (!quotes.length) return;

		history.value.push(currentIndex.value);
		currentIndex.value = pickNewIndex(currentIndex.value, quotes.length);
	}

	return {
		quotes,
		currentIndex,
		currentQuote,
		nextQuote,
	};
}
