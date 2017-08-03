const CSL = require('citeproc');

export default function makeBibliography(items, style, locale, options = {}) {
  if (!style || !locale) {
    return;
  }
  const sys = {
    retrieveLocale: () => {
      return locale;
    },
    retrieveItem: (id) => {
      return items[id];
    }
  };
  const processor = new CSL.Engine(sys, style);
  processor.updateItems(Object.keys(items));
  const bibResults = processor.makeBibliography(options);
  return bibResults;
}
