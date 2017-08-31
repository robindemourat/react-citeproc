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
    },
    variableWrapper: (params, prePunct, str, postPunct) => {
      if (params.variableNames[0] === 'title'
          && params.itemData.URL
          && params.context === 'bibliography') {
        return prePunct
           + '<a href="'
             + params.itemData.URL
           + '" target="blank">'
             + str
           + '</a>'
             + postPunct;
      } else if (params.variableNames[0] === 'URL') {
        return prePunct
           + '<a href="'
             + str
           + '" target="blank">'
             + str
           + '</a>'
             + postPunct;
      }
      else {
        return (prePunct + str + postPunct);
      }
    }
  };
  const processor = new CSL.Engine(sys, style);
  processor.updateItems(Object.keys(items));
  const bibResults = processor.makeBibliography(options);
  return bibResults;
}
