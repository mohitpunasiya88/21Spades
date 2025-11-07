// Translation utility for backend data
// This translates backend content when language changes

type Locale = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja'

// Simple translation mapping for common backend content
// In production, you might want to use a translation API or store translations in database
const translations: Record<string, Record<Locale, string>> = {
  'Just minted my first NFT collection! Check it out.': {
    en: 'Just minted my first NFT collection! Check it out.',
    es: '¡Acabo de acuñar mi primera colección NFT! Échale un vistazo.',
    fr: 'Je viens de créer ma première collection NFT ! Regardez ça.',
    de: 'Ich habe gerade meine erste NFT-Sammlung geprägt! Schauen Sie es sich an.',
    zh: '我刚刚铸造了我的第一个NFT系列！来看看吧。',
    ja: '初めてのNFTコレクションをミントしました！チェックしてください。'
  },
  'Lorem ipsum dolor sit amet consectetur. Massa est velit pellentesque sit commodo id. Elementum consectetur et sed ac fames adipiscing arcu lectus.': {
    en: 'Lorem ipsum dolor sit amet consectetur. Massa est velit pellentesque sit commodo id. Elementum consectetur et sed ac fames adipiscing arcu lectus.',
    es: 'El texto de ejemplo se sienta amet consectetur. La masa es velit pellentesque se sienta commodo id. El elemento consectetur et sed ac fames adipiscing arcu lectus.',
    fr: 'Le texte d\'exemple s\'assoit amet consectetur. La masse est velit pellentesque s\'assoit commodo id. L\'élément consectetur et sed ac fames adipiscing arcu lectus.',
    de: 'Der Beispieltext sitzt amet consectetur. Die Masse ist velit pellentesque sitzt commodo id. Das Element consectetur et sed ac fames adipiscing arcu lectus.',
    zh: '示例文本位于amet consectetur。质量是velit pellentesque位于commodo id。元素consectetur et sed ac fames adipiscing arcu lectus。',
    ja: 'サンプルテキストはamet consecteturにあります。質量はvelit pellentesqueでcommodo idにあります。要素consectetur et sed ac fames adipiscing arcu lectus。'
  },
  'Greed': {
    en: 'Greed',
    es: 'Codicia',
    fr: 'Cupidité',
    de: 'Gier',
    zh: '贪婪',
    ja: '貪欲'
  },
  'Fear': {
    en: 'Fear',
    es: 'Miedo',
    fr: 'Peur',
    de: 'Angst',
    zh: '恐惧',
    ja: '恐怖'
  }
}

/**
 * Translates backend content based on current locale
 * @param text - The text to translate
 * @param locale - Current locale
 * @returns Translated text or original if translation not found
 */
export function translateBackendContent(text: string, locale: Locale): string {
  // Trim whitespace for matching
  const trimmedText = text.trim()
  
  // If translation exists, return it
  if (translations[trimmedText] && translations[trimmedText][locale]) {
    return translations[trimmedText][locale]
  }
  
  // Try exact match first, then try with trimmed text
  if (translations[text] && translations[text][locale]) {
    return translations[text][locale]
  }
  
  // For production, you could integrate with a translation API here
  // For now, return original text if no translation found
  return text
}

/**
 * Translates an object with string values
 */
export function translateObject<T extends Record<string, any>>(
  obj: T,
  locale: Locale,
  keysToTranslate: (keyof T)[]
): T {
  const translated = { ...obj }
  
  for (const key of keysToTranslate) {
    if (typeof translated[key] === 'string') {
      translated[key] = translateBackendContent(translated[key] as string, locale) as T[keyof T]
    }
  }
  
  return translated
}


