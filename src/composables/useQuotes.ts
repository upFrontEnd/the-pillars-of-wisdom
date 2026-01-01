import { computed, ref } from "vue";
import type { QuoteItem } from "../types/quote";

// Import statique du JSON (Vite l’intègre au build)
import rawQuotes from "../data/quotes.json";

/**
 * Dataset de citations.
 * - Le JSON n’est pas typé “nativement”, donc on cast.
 * - On part du principe que quotes.json respecte QuoteItem.
 */
const quotes = rawQuotes as QuoteItem[];

export function useQuotes() {
	/**
	 * Index de la citation affichée (0 = première citation du tableau).
	 * - ref => réactif : quand on modifie currentIndex, l’UI se met à jour.
	 */
	const currentIndex = ref(0);

	/**
	 * Nombre total de citations (utile pour la pagination "3/10").
	 */
	const total = computed(() => quotes.length);

	/**
	 * Position “humaine” (1-based) :
	 * - index 0 => position 1
	 * - index 2 => position 3
	 */
	const currentPosition = computed(() => {
		if (!total.value) return 0;
		return currentIndex.value + 1;
	});

	/**
	 * Citation courante (dérivée de l’index).
	 * - On renvoie null si le JSON est vide pour éviter de casser l’app.
	 */
	const currentQuote = computed<QuoteItem | null>(() => {
		if (!total.value) return null;
		return quotes[currentIndex.value] ?? null;
	});

	/**
	 * nextQuote()
	 * - Avance d’une citation.
	 * - Comportement : boucle (la dernière -> revient à la première).
	 */
	function nextQuote() {
		if (!total.value) return;
		currentIndex.value = (currentIndex.value + 1) % total.value;
	}

	/**
	 * prevQuote()
	 * - Recule d’une citation.
	 * - Comportement : boucle (la première -> revient à la dernière).
	 */
	function prevQuote() {
		if (!total.value) return;
		currentIndex.value = (currentIndex.value - 1 + total.value) % total.value;
	}

	/**
	 * API exposée à la page (HomeView) :
	 * - currentQuote : ce qu’on affiche
	 * - nextQuote/prevQuote : navigation
	 * - currentPosition/total : pagination "3/10"
	 */
	return {
		currentQuote,
		nextQuote,
		prevQuote,
		currentPosition,
		total,
	};
}
