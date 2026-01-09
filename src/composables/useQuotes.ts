import { computed, ref, watch } from "vue"
import type { QuoteItem } from "../types/quote"
import rawQuotes from "../data/quotes.json"

const quotes = rawQuotes as QuoteItem[]

/**
 * Cache local pour éviter de relancer un préchargement sur une URL déjà traitée.
 * Scope module => partagé entre toutes les utilisations du composable.
 */
const preloaded = new Set<string>()

/**
 * Précharge une image (sans l’afficher).
 * - new Image() crée un objet Image côté navigateur
 * - src déclenche le téléchargement et remplit le cache
 */
function preloadImage(src?: string) {
  if (!src) return
  if (preloaded.has(src)) return

  const img = new Image()
  img.src = src
  preloaded.add(src)
}

export function useQuotes() {
  const currentIndex = ref(0)

  const total = computed(() => quotes.length)

  const currentPosition = computed(() => {
    if (!total.value) return 0
    return currentIndex.value + 1
  })

  const currentQuote = computed<QuoteItem | null>(() => {
    if (!total.value) return null
    return quotes[currentIndex.value] ?? null
  })

  function nextQuote() {
    if (!total.value) return
    currentIndex.value = (currentIndex.value + 1) % total.value
  }

  function prevQuote() {
    if (!total.value) return
    currentIndex.value = (currentIndex.value - 1 + total.value) % total.value
  }

  /**
   * Préchargement automatique :
   * - quand l’index change, on précharge l’image de la citation courante
   *   et celle de la prochaine (pour que le clic "suivant" soit instantané).
   * - immediate: true => précharge aussi au premier affichage.
   */
  watch(
    currentIndex,
    (idx) => {
      if (!total.value) return

      const curr = quotes[idx]
      const next = quotes[(idx + 1) % total.value]

      // ⚠️ Remplace authorImage par le champ réel de ton QuoteItem
      preloadImage((curr as any).authorImage)
      preloadImage((next as any).authorImage)
    },
    { immediate: true }
  )

  return {
    currentQuote,
    nextQuote,
    prevQuote,
    currentPosition,
    total,
  }
}
