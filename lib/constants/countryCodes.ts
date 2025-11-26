// Common country codes and phone validation rules used across the application

export interface CountryCode {
  code: string
  country: string
  flag: string
}

export interface PhoneValidationRule {
  min: number
  max: number
  pattern: RegExp
  message: string
}

// Complete list of country codes with flags
export const countryCodes: CountryCode[] = [
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+66', country: 'TH', flag: '🇹🇭' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+84', country: 'VN', flag: '🇻🇳' },
]

// Phone validation rules for each country
export const phoneValidationRules: Record<string, PhoneValidationRule> = {
  '+1': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'US phone number must be 10 digits' },
  '+91': { min: 10, max: 10, pattern: /^[6-9][0-9]{9}$/, message: 'Indian phone number must be 10 digits starting with 6-9' },
  '+44': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'UK phone number must be 10 digits' },
  '+86': { min: 11, max: 11, pattern: /^1[3-9][0-9]{9}$/, message: 'Chinese phone number must be 11 digits starting with 1' },
  '+81': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'Japanese phone number must be 10-11 digits' },
  '+49': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'German phone number must be 10-11 digits' },
  '+33': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'French phone number must be 9 digits' },
  '+61': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Australian phone number must be 9 digits' },
  '+7': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'Russian phone number must be 10 digits' },
  '+55': { min: 10, max: 11, pattern: /^[0-9]{10,11}$/, message: 'Brazilian phone number must be 10-11 digits' },
  '+52': { min: 10, max: 10, pattern: /^[0-9]{10}$/, message: 'Mexican phone number must be 10 digits' },
  '+39': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Italian phone number must be 9-10 digits' },
  '+34': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Spanish phone number must be 9 digits' },
  '+82': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'South Korean phone number must be 9-10 digits' },
  '+971': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'UAE phone number must be 9 digits' },
  '+65': { min: 8, max: 8, pattern: /^[0-9]{8}$/, message: 'Singapore phone number must be 8 digits' },
  '+60': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Malaysian phone number must be 9-10 digits' },
  '+66': { min: 9, max: 9, pattern: /^[0-9]{9}$/, message: 'Thai phone number must be 9 digits' },
  '+62': { min: 9, max: 11, pattern: /^[0-9]{9,11}$/, message: 'Indonesian phone number must be 9-11 digits' },
  '+84': { min: 9, max: 10, pattern: /^[0-9]{9,10}$/, message: 'Vietnamese phone number must be 9-10 digits' },
}

// Array of country codes for parsing (sorted by length DESC to match longest first)
export const countryCodeList = [
  '+971', '+966', '+965', '+964', '+963', '+962', '+961', '+960', '+959', '+958',
  '+90', '+86', '+84', '+82', '+81', '+66', '+65', '+62', '+61',
  '+60', '+55', '+52', '+49', '+44', '+39', '+34', '+33', '+7', '+1'
]

