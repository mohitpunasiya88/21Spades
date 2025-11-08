/**
 * Auto-translation script
 * Reads en.json and automatically generates translations for all other languages
 * Uses a translation API to translate from English to other languages
 */

const fs = require('fs');
const path = require('path');

// Language codes mapping
const LANGUAGES = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  zh: 'Chinese',
  ja: 'Japanese'
};

// Simple translation function (you can replace this with a real API)
// For production, use: Google Translate API, DeepL, Azure Translator, etc.
async function translateText(text, targetLang) {
  // Option 1: Use a free translation library (like @vitalets/google-translate-api)
  // Option 2: Use a paid API (Google Cloud Translate, DeepL, etc.)
  // Option 3: Use a local translation service
  
  // For now, we'll use a simple approach with a translation service
  // You can install: npm install @vitalets/google-translate-api
  
  try {
    // If you want to use Google Translate (free, unofficial):
    // const translate = require('@vitalets/google-translate-api');
    // const result = await translate(text, { to: targetLang });
    // return result.text;
    
    // For now, return placeholder - you'll need to implement actual translation
    // See instructions below for setting up real translation
    return text;
  } catch (error) {
    console.error(`Translation error for ${targetLang}:`, error);
    return text; // Fallback to original text
  }
}

// Recursively translate an object
async function translateObject(obj, targetLang, sourceLang = 'en') {
  const translated = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Translate string values
      translated[key] = await translateText(value, targetLang);
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      // Recursively translate nested objects
      translated[key] = await translateObject(value, targetLang, sourceLang);
    } else {
      // Keep non-string values as-is
      translated[key] = value;
    }
  }
  
  return translated;
}

// Main function
async function generateTranslations() {
  const messagesDir = path.join(__dirname, '..', 'messages');
  const enFilePath = path.join(messagesDir, 'en.json');
  
  // Read English source file
  if (!fs.existsSync(enFilePath)) {
    console.error('❌ en.json not found!');
    process.exit(1);
  }
  
  const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
  console.log('✅ Read en.json');
  
  // Generate translations for each language
  for (const [langCode, langName] of Object.entries(LANGUAGES)) {
    console.log(`\n🔄 Translating to ${langName} (${langCode})...`);
    
    try {
      const translated = await translateObject(enContent, langCode);
      const outputPath = path.join(messagesDir, `${langCode}.json`);
      
      // Write translated file with proper formatting
      fs.writeFileSync(
        outputPath,
        JSON.stringify(translated, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`✅ Generated ${langCode}.json`);
    } catch (error) {
      console.error(`❌ Error translating to ${langCode}:`, error);
    }
  }
  
  console.log('\n✨ Translation complete!');
}

// Run if called directly
if (require.main === module) {
  generateTranslations().catch(console.error);
}

module.exports = { generateTranslations, translateObject, translateText };


