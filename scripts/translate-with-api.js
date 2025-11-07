/**
 * Auto-translation script with Google Translate API
 * Install: npm install @vitalets/google-translate-api
 * 
 * This uses the free, unofficial Google Translate API
 * For production, consider using official Google Cloud Translate API
 */

const fs = require('fs');
const path = require('path');

// Language codes mapping
const LANGUAGES = {
  es: 'es', // Spanish
  fr: 'fr', // French
  de: 'de', // German
  zh: 'zh-CN', // Chinese (Simplified)
  ja: 'ja' // Japanese
};

// Check if translation library is available
let translate;
try {
  translate = require('@vitalets/google-translate-api');
} catch (e) {
  console.warn('⚠️  @vitalets/google-translate-api not installed.');
  console.warn('   Install it with: npm install @vitalets/google-translate-api');
  console.warn('   Or use the basic translate.js script\n');
}

async function translateText(text, targetLang) {
  if (!translate) {
    console.warn(`   ⚠️  Translation library not available, skipping: "${text.substring(0, 50)}..."`);
    return text;
  }
  
  try {
    // Skip translation if text is too short or contains special patterns
    if (text.length < 3 || /^[0-9\s\-\+\$\%]+$/.test(text)) {
      return text;
    }
    
    const result = await translate(text, { to: targetLang });
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
    return result.text;
  } catch (error) {
    console.error(`   ❌ Translation error:`, error.message);
    return text; // Fallback to original
  }
}

// Recursively translate an object
async function translateObject(obj, targetLang, depth = 0) {
  const translated = {};
  const indent = '  '.repeat(depth);
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      process.stdout.write(`${indent}Translating "${key}"... `);
      const translatedValue = await translateText(value, targetLang);
      translated[key] = translatedValue;
      console.log('✓');
    } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.log(`${indent}Translating object "${key}"...`);
      translated[key] = await translateObject(value, targetLang, depth + 1);
    } else {
      translated[key] = value;
    }
  }
  
  return translated;
}

// Main function
async function generateTranslations() {
  const messagesDir = path.join(__dirname, '..', 'messages');
  const enFilePath = path.join(messagesDir, 'en.json');
  
  if (!fs.existsSync(enFilePath)) {
    console.error('❌ en.json not found!');
    process.exit(1);
  }
  
  const enContent = JSON.parse(fs.readFileSync(enFilePath, 'utf8'));
  console.log('✅ Read en.json\n');
  
  for (const [langCode, googleLangCode] of Object.entries(LANGUAGES)) {
    const langName = {
      es: 'Spanish',
      fr: 'French',
      de: 'German',
      zh: 'Chinese',
      ja: 'Japanese'
    }[langCode];
    
    console.log(`\n🔄 Translating to ${langName} (${langCode})...`);
    console.log('─'.repeat(50));
    
    try {
      const translated = await translateObject(enContent, googleLangCode);
      const outputPath = path.join(messagesDir, `${langCode}.json`);
      
      fs.writeFileSync(
        outputPath,
        JSON.stringify(translated, null, 2) + '\n',
        'utf8'
      );
      
      console.log(`\n✅ Generated ${langCode}.json`);
    } catch (error) {
      console.error(`\n❌ Error translating to ${langCode}:`, error);
    }
  }
  
  console.log('\n✨ Translation complete!');
}

if (require.main === module) {
  generateTranslations().catch(console.error);
}

module.exports = { generateTranslations };


