/**
 * Takes a string and replaces all substrings which match the form `{PROPERTY}`,
 * where "PROPERTY" is a key of the provided `placeholders` object, with the value
 * at that key.
 */
export function swapStringPlaceholders(target: string, placeholders?: Record<string, unknown>) {
  return placeholders
    ? target.replace(/\{\s*(\w+?)\s*}/g, (_, token) => String(placeholders[token] || ''))
    : target;
}


const MatchTagsRegex = new RegExp(/<(\w+)(?:>|.+?>)/gi);


/**
 * A really basic, Regex based HTML tag remover.
 */
export function stripHtml(htmlString: string) {
  return htmlString.replace(MatchTagsRegex, (_, tagName) => {
    return tagName === 'br' ? ' ' : '';
  });
}
