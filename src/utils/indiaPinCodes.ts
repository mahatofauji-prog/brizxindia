/**
 * Indian PIN Code utilities & City mapping for BrizX India Smart Match
 */

export interface PinCodeLocation {
  city: string;
  state: string;
  region?: string;
}

const PIN_PREFIX_MAP: Record<string, PinCodeLocation> = {
  '560': { city: 'Bangalore', state: 'Karnataka', region: 'South' },
  '561': { city: 'Bangalore Rural', state: 'Karnataka', region: 'South' },
  '570': { city: 'Mysore', state: 'Karnataka', region: 'South' },
  '400': { city: 'Mumbai', state: 'Maharashtra', region: 'West' },
  '401': { city: 'Thane / Palghar', state: 'Maharashtra', region: 'West' },
  '411': { city: 'Pune', state: 'Maharashtra', region: 'West' },
  '422': { city: 'Nashik', state: 'Maharashtra', region: 'West' },
  '110': { city: 'Delhi', state: 'Delhi NCR', region: 'North' },
  '122': { city: 'Gurgaon', state: 'Haryana / NCR', region: 'North' },
  '201': { city: 'Noida', state: 'Uttar Pradesh / NCR', region: 'North' },
  '121': { city: 'Faridabad', state: 'Haryana / NCR', region: 'North' },
  '500': { city: 'Hyderabad', state: 'Telangana', region: 'South' },
  '501': { city: 'Ranga Reddy', state: 'Telangana', region: 'South' },
  '600': { city: 'Chennai', state: 'Tamil Nadu', region: 'South' },
  '641': { city: 'Coimbatore', state: 'Tamil Nadu', region: 'South' },
  '682': { city: 'Kochi', state: 'Kerala', region: 'South' },
  '380': { city: 'Ahmedabad', state: 'Gujarat', region: 'West' },
  '395': { city: 'Surat', state: 'Gujarat', region: 'West' },
  '390': { city: 'Vadodara', state: 'Gujarat', region: 'West' },
  '360': { city: 'Rajkot', state: 'Gujarat', region: 'West' },
  '700': { city: 'Kolkata', state: 'West Bengal', region: 'East' },
  '711': { city: 'Howrah', state: 'West Bengal', region: 'East' },
  '302': { city: 'Jaipur', state: 'Rajasthan', region: 'North' },
  '313': { city: 'Udaipur', state: 'Rajasthan', region: 'North' },
  '226': { city: 'Lucknow', state: 'Uttar Pradesh', region: 'North' },
  '452': { city: 'Indore', state: 'Madhya Pradesh', region: 'Central' },
  '160': { city: 'Chandigarh', state: 'Punjab / Haryana', region: 'North' }
};

const CITY_TO_PIN_MAP: Record<string, string> = {
  'bangalore': '560001',
  'bengaluru': '560001',
  'mumbai': '400001',
  'delhi': '110001',
  'delhi ncr': '110001',
  'pune': '411001',
  'hyderabad': '500001',
  'chennai': '600001',
  'ahmedabad': '380001',
  'kolkata': '700001',
  'jaipur': '302001',
  'gurgaon': '122001',
  'noida': '201301',
  'kochi': '682001',
  'lucknow': '226001',
  'indore': '452001',
  'chandigarh': '160001',
  'surat': '395001',
  'mysore': '570001'
};

/**
 * Validates whether string is a valid 6-digit Indian PIN code
 */
export function isValidIndianPinCode(pin: string): boolean {
  if (!pin) return false;
  const cleaned = pin.trim();
  return /^[1-9][0-9]{5}$/.test(cleaned);
}

/**
 * Resolves location info from PIN code prefix
 */
export function getLocationFromPinCode(pin: string): PinCodeLocation | null {
  if (!pin || pin.length < 3) return null;
  const prefix = pin.trim().slice(0, 3);
  return PIN_PREFIX_MAP[prefix] || null;
}

/**
 * Gets a representative PIN code for a major city
 */
export function getPinCodeForCity(city: string): string | null {
  if (!city) return null;
  const normalized = city.trim().toLowerCase();
  return CITY_TO_PIN_MAP[normalized] || null;
}

/**
 * Top Indian franchise expansion cities
 */
export const TOP_INDIAN_CITIES = [
  'Bangalore',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Ahmedabad',
  'Kolkata',
  'Jaipur',
  'Gurgaon',
  'Noida',
  'Chandigarh',
  'Indore',
  'Lucknow',
  'Kochi',
  'Surat',
  'Vadodara',
  'Mysore'
];
