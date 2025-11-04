export type SlugifyOptions = {
    replacement?: string;
    lower?: boolean;
    strict?: boolean;                // remove characters other than alphanum and replacement
    remove?: RegExp | null;          // custom regex to remove (applied before other normalization)
    locale?: Record<string, string>; // small char -> replacement mapping override/extend
    trim?: boolean;
};

const DEFAULTS: Required<Pick<SlugifyOptions, 'replacement' | 'lower' | 'strict' | 'remove' | 'trim'>> = {
    replacement: '-',
    lower: true,
    strict: false,
    remove: null,
    trim: true,
};

/**
 * A compact transliteration map for characters that Unicode decomposition won't
 * turn into ASCII, and for some common ligatures.
 * You can extend/override with options.locale.
 */
const DEFAULT_LOCALE_MAP: Record<string, string> = {
    // latin extras & ligatures
    æ: 'ae', Æ: 'AE', œ: 'oe', Œ: 'OE', ß: 'ss', þ: 'th', Þ: 'Th',
    // nordic
    ø: 'o', Ø: 'O', å: 'a', Å: 'A',
    // polish
    ą: 'a', ć: 'c', ę: 'e', ł: 'l', ń: 'n', ó: 'o', ś: 's', ź: 'z', ż: 'z',
    // cyrillic (very small subset)
    ж: 'zh', ч: 'ch', ш: 'sh', щ: 'shch', ю: 'yu', я: 'ya', ё: 'yo', х: 'kh',
    // vietnamese common replacements (small subset)
    đ: 'd', Đ: 'D',
    // greek subset
    α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', η: 'e', θ: 'th', ι: 'i', κ: 'k',
    λ: 'l', μ: 'm', ν: 'n', ξ: 'x', π: 'p', ρ: 'r', σ: 's', τ: 't', φ: 'f',
    ψ: 'ps', ω: 'o',
};

function mergeLocaleMap(base: Record<string, string>, custom?: Record<string, string>): Record<string, string> {
    if (!custom) return base;
    return { ...base, ...custom };
}

/**
 * slugify
 * @param input any string (will be coerced)
 * @param opts options
 */
export default function slugify(input: unknown, opts: SlugifyOptions = {}): string {
    const options = { ...DEFAULTS, ...opts } as Required<SlugifyOptions & typeof DEFAULTS>;

    let str = String(input ?? '');

    // apply custom remove regex early (user can strip things before other processing)
    if (options.remove instanceof RegExp) {
        str = str.replace(options.remove, '');
    }

    // apply locale transliteration map replacements first (character-by-character)
    const localeMap = mergeLocaleMap(DEFAULT_LOCALE_MAP, opts.locale);
    if (Object.keys(localeMap).length > 0) {
        // Build a RegExp that matches any key (faster than repeated replace)
        const keys = Object.keys(localeMap).map(k => escapeRegExp(k)).join('|');
        if (keys.length > 0) {
            const mapRe = new RegExp(keys, 'gu');
            str = str.replace(mapRe, (m) => localeMap[m] ?? m);
        }
    }

    // Normalize and remove diacritics (NFKD => remove combining marks)
    // NFKD decomposes letters+accents; remove \p{M} (marks)
    str = str.normalize('NFKD').replace(/\p{M}/gu, '');

    // Convert whitespace and separators to the chosen replacement
    const sep = options.replacement;
    // Replace any run of whitespace or punctuation-like separators with sep.
    // We'll keep letters/numbers and we'll handle strict later.
    // Use Unicode property escapes to match separator and punctuation.
    str = str.replace(/[\p{Separator}\p{Punctuation}\p{Symbol}]+/gu, sep);

    // Optionally make strict: remove anything that's not letter, number, or sep
    if (options.strict) {
        // allow ascii letters and numbers and the sep
        // We'll allow any Unicode letters/numbers too (use \p{L}\p{N}), but strip other stuff.
        const allowed = `\\p{L}\\p{N}${escapeRegExp(sep)}`;
        const strictRe = new RegExp(`[^${allowed}]+`, 'gu');
        str = str.replace(strictRe, '');
    }

    // Collapse repeated separators into one
    const repRe = new RegExp(`${escapeRegExp(sep)}{2,}`, 'g');
    str = str.replace(repRe, sep);

    // Trim separators from ends if requested
    if (options.trim) {
        const trimRe = new RegExp(`^${escapeRegExp(sep)}+|${escapeRegExp(sep)}+$`, 'g');
        str = str.replace(trimRe, '');
    }

    // Lowercase if requested (use locale-insensitive lower by default)
    if (options.lower) str = str.toLowerCase();

    // Fallback: if empty return empty string (could provide 'n-a' but keep simple)
    return str;
}

// small helper to escape regexp chars
function escapeRegExp(s: string): string {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}