/**
 * src/types/quote.ts
 *
 * Objectif :
 * - Décrire “à quoi ressemble” une citation dans ton app.
 *
 * Pourquoi c’est utile ?
 * - Ton JSON (quotes.json), tes composants (props) et ton composable (useQuotes)
 *   manipulent tous les mêmes données.
 * - En centralisant les types ici, tu évites :
 *   - les duplications
 *   - les incohérences
 *   - les bugs où un composant “pense” qu’un champ existe alors qu’il n’existe pas
 *
 * En bref :
 * - Ce fichier sert de “contrat” : si le contrat change, TypeScript te prévient partout.
 */

/**
 * QuoteAuthor = la partie “auteur” d’une citation.
 *
 * Tous les champs sont optionnels :
 * - parce que certaines citations peuvent être anonymes
 * - ou parce que tu n’as pas encore la donnée (photo/bio) dans ton JSON
 */
export type QuoteAuthor = {
	/**
	 * name :
	 * - le nom affiché de l’auteur (ex: "Victor Hugo")
	 * - optionnel : si absent, l’UI affichera un fallback ("Anonyme")
	 */
	name?: string;

	/**
	 * bio :
	 * - petite description de l’auteur
	 * - optionnel : si absent, on n’affiche rien (UI plus propre)
	 */
	bio?: string;

	/**
	 * photo :
	 * - chemin public vers une image
	 * - exemple : "/authors/victor-hugo.jpg"
	 *
	 * Optionnel :
	 * - si absent, le composant Photo affiche un placeholder
	 *
	 * Note importante :
	 * - Le chemin commence par "/" => il pointe vers le dossier "public/"
	 *   (ex: public/authors/victor-hugo.jpg)
	 */
	photo?: string;
};

/**
 * QuoteItem = une citation complète.
 *
 * Champs obligatoires :
 * - id : identifiant unique (utile pour les listes et la stabilité)
 * - text : le texte de la citation
 *
 * Champ optionnel :
 * - author : bloc auteur (si on a l’info)
 */
export type QuoteItem = {
	/**
	 * id :
	 * - identifiant stable
	 * - utile pour `:key` quand on rend des listes
	 * - utile si tu fais évoluer le dataset plus tard
	 */
	id: string;

	/**
	 * text :
	 * - le contenu de la citation affichée
	 */
	text: string;

	/**
	 * author :
	 * - infos auteur (optionnelles)
	 * - si absent, l’app doit rester utilisable
	 */
	author?: QuoteAuthor;
};
