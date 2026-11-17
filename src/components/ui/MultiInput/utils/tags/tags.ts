// Helpers for tag inputs: split typed or pasted text into tags and merge
// them into an existing list.

export type AddTagsOptions = {
    /** Maximum number of tags in the list. */
    maxItems?: number;
    /** Maximum length of a single tag; longer tags are skipped. */
    maxLength?: number;
};

const escapeRegExp = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);

/**
 * Splits text on any of the separator characters and on new lines, trimming
 * each part and dropping empty ones. Key names like 'Enter' are ignored.
 */
export function splitTags(text: string, separators: string[] = [',']) {
    const characters = separators.filter((separator) => separator.length === 1);
    const pattern = new RegExp(
        `[\\r\\n${characters.map(escapeRegExp).join('')}]`,
    );
    return text
        .split(pattern)
        .map((part) => part.trim())
        .filter(Boolean);
}

/**
 * Appends candidates to `tags`, skipping duplicates (also within the
 * candidates), tags over `maxLength` and anything past `maxItems`.
 */
export function addTags(
    tags: string[],
    candidates: string[],
    { maxItems, maxLength }: AddTagsOptions = {},
) {
    const next = [...tags];
    for (const raw of candidates) {
        const tag = raw.trim();
        if (!tag || next.includes(tag)) continue;
        if (maxLength !== undefined && tag.length > maxLength) continue;
        if (maxItems !== undefined && next.length >= maxItems) break;
        next.push(tag);
    }
    return next;
}
