/**
 * Types partagés pour les citations.
 *
 * Pourquoi ce fichier ?
 * - Centralise la "forme" des données (JSON, props, composables).
 * - Évite de dupliquer des types dans chaque composant.
 * - Facilite les refactors (si on change le JSON, TS guide les corrections).
 */

export type QuoteAuthor = {
	/**
	 * Nom affiché de l’auteur.
	 * Optionnel : certaines citations peuvent être anonymes.
	 */
	name?: string;

	/**
	 * Bio courte affichable dans l’UI.
	 * Optionnel : l’app doit fonctionner même si absent.
	 */
	bio?: string;

	/**
	 * Chemin public vers la photo.
	 * Exemple : "/authors/good-mood.jpg"
	 * Optionnel : on affichera un fallback si absent.
	 */
	photo?: string;
};

export type QuoteItem = {
	/** Identifiant stable (utile pour les keys et l’évolution du dataset) */
	id: string;

	/** Texte de la citation */
	text: string;

	/** Infos auteur (optionnelles) */
	author?: QuoteAuthor;
};
