import { FontDefinition, FONT_LIST } from '../data/fonts';

const CUSTOM_FONTS_STORAGE_KEY = 'studio_social_custom_fonts_v1';

export interface StoredCustomFont {
  family: string;
  name: string;
  category: 'sans' | 'serif' | 'display' | 'handwriting' | 'mono';
  description: string;
  dataUrl: string; // base64 data url for persistence
}

/**
 * Register a font with document.fonts using FontFace API
 */
export async function registerFontFace(family: string, source: ArrayBuffer | string): Promise<boolean> {
  try {
    const sourceParam = typeof source === 'string' ? `url(${source})` : source;
    const fontFace = new FontFace(family, sourceParam);
    const loadedFace = await fontFace.load();
    document.fonts.add(loadedFace);
    return true;
  } catch (err) {
    console.error(`Failed to register font ${family}:`, err);
    return false;
  }
}

/**
 * Load Google Font dynamically into head if not already loaded
 */
export function loadGoogleFontDynamically(family: string): Promise<boolean> {
  return new Promise((resolve) => {
    const cleanFamily = family.trim();
    if (!cleanFamily) {
      resolve(false);
      return;
    }

    const id = `gfont-${cleanFamily.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    if (document.getElementById(id)) {
      resolve(true);
      return;
    }

    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanFamily.replace(/ /g, '+'))}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
    link.onload = () => {
      // Force font loading check
      document.fonts.load(`16px "${cleanFamily}"`).then(() => resolve(true)).catch(() => resolve(true));
    };
    link.onerror = () => {
      console.warn(`Could not load Google Font ${cleanFamily}`);
      resolve(false);
    };
    document.head.appendChild(link);
  });
}

/**
 * Load custom font file from browser File input
 */
export async function loadCustomFontFromFile(file: File): Promise<FontDefinition | null> {
  try {
    const rawName = file.name.replace(/\.[^/.]+$/, '').trim();
    // Clean name: replace underscores/dashes with spaces, capitalize words
    const cleanName = rawName
      .replace(/[-_]+/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const family = cleanName;

    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();

    // Register with browser FontFace API
    const registered = await registerFontFace(family, arrayBuffer);
    if (!registered) {
      return null;
    }

    // Convert to DataURL for localStorage persistence (if reasonable size < 3MB)
    let dataUrl = '';
    if (file.size < 3 * 1024 * 1024) {
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    }

    const fontDef: FontDefinition = {
      family,
      name: cleanName,
      category: 'display',
      description: 'Font personale caricato dal tuo dispositivo',
      isCustom: true,
      dataUrl,
    };

    saveCustomFontToStorage(fontDef);
    return fontDef;
  } catch (err) {
    console.error('Error loading custom font file:', err);
    return null;
  }
}

/**
 * Get all stored custom fonts from localStorage and register them into the document
 */
export async function initializeCustomFonts(): Promise<FontDefinition[]> {
  try {
    const savedJson = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    if (!savedJson) return [];

    const storedList: StoredCustomFont[] = JSON.parse(savedJson);
    const loadedList: FontDefinition[] = [];

    for (const item of storedList) {
      if (item.dataUrl) {
        await registerFontFace(item.family, item.dataUrl);
      }
      loadedList.push({
        family: item.family,
        name: item.name,
        category: item.category || 'display',
        description: item.description || 'Font personale',
        isCustom: true,
        dataUrl: item.dataUrl,
      });
    }

    return loadedList;
  } catch (err) {
    console.warn('Could not restore custom fonts from localStorage:', err);
    return [];
  }
}

/**
 * Save custom font to localStorage
 */
export function saveCustomFontToStorage(font: FontDefinition) {
  try {
    const savedJson = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    const currentList: StoredCustomFont[] = savedJson ? JSON.parse(savedJson) : [];

    // Filter out duplicates
    const filtered = currentList.filter((f) => f.family.toLowerCase() !== font.family.toLowerCase());
    filtered.push({
      family: font.family,
      name: font.name,
      category: font.category,
      description: font.description,
      dataUrl: font.dataUrl || '',
    });

    localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Could not save custom font to localStorage (quota may be full):', err);
  }
}

/**
 * Delete custom font from localStorage
 */
export function removeCustomFontFromStorage(family: string) {
  try {
    const savedJson = localStorage.getItem(CUSTOM_FONTS_STORAGE_KEY);
    if (!savedJson) return;
    const currentList: StoredCustomFont[] = JSON.parse(savedJson);
    const filtered = currentList.filter((f) => f.family.toLowerCase() !== family.toLowerCase());
    localStorage.setItem(CUSTOM_FONTS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.warn('Could not remove custom font from localStorage:', err);
  }
}
