/**
 * This module consumes the recomposition of a quinoa composition
 * to bundle the content of an all-in-one html file
 * @module services/compositionBundler
 */
const fs = require('fs');
const path = require('path');
const buildPath = path.resolve(__dirname + '/../../build/application.js');

const buildSEOHTML = (composition = {metadata: {}, data: []}) => {
  const title = composition.metadata.title || 'Dicto player';
  const contents = composition.data.reduce((html, chunk) => {
    return html + `
<section className="chunk">
  <div>${chunk.content}</div>
</section>
    `
  }, '');
  return `
<h1>${title}</h1>
${contents}
`;
};

const buildMeta = (composition) => {
  const title = composition.metadata.title ? `
    <title>${composition.metadata.title}</title>
    <meta name="DC.Title" content="${composition.metadata.title}"/>
    <meta name="twitter:title" content="${composition.metadata.title}" />
    <meta name="og:title" content="${composition.metadata.title}" />
  ` :  '<title>Quinoa composition</title>';
  const description = composition.metadata.description ? `
    <meta name="description" content="${composition.metadata.description}"/>
    <meta name="DC.Description" content="${composition.metadata.description}"/>
    <meta name="og:description" content="${composition.metadata.description}" />
    <meta name="twitter:description" content="${composition.metadata.description}" />
  ` :  '';
  const authors = composition.metadata.authors && composition.metadata.authors.length
                  ? 
                  composition.metadata.authors.map(author => `
                    <meta name="DC.Creator" content="${author}" />
                    <meta name="author" content="${author}" />`)
                  : '';
  return `
  <meta name    = "DC.Format"
          content = "text/html">
  <meta name    = "DC.Type"
          content = "audiovisual composition">
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:site" content="@robindemourat" />
  <meta property="og:url" content="https://github.com/dictoapp" />
  <meta name="og:type" content="website" />
  ${title}
  ${authors}
  ${description}
`;
}

/**
 * Builds the recomposition of a all-in-one html composition out of a json composition recomposition
 * @param {object} composition - the composition to bundle
 * @param {object} settings - relative to the settings of the composition interactions
 * @return {string} html - the resulting html 
 */
module.exports = function bundleComposition (composition = {}, settings = {}) {
  const compoJSON = JSON.stringify(composition, null, 2);
  const settingsJSON = JSON.stringify(settings);
  const seoHTML = buildSEOHTML(composition);
  const meta = buildMeta(composition);
  const jsBuild = fs.readFileSync(buildPath, 'utf8');
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
   ${meta}

  <style>
    body{
      position: absolute;
      padding: 0;
      margin: 0;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-family: sans serif;
    }
    .shadow-content
    {
      display: none;
    }
    .loader-wrapper
    {
      background: #353635;
      color: #f4f4f4;
      width: 100%;
      height: 100%;
      position: absolute;
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;
      align-items: center;
    }  
    .loader-container
    {
      display: flex;
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
    } 
    a,a:visited,a:active,a:hover{
      color: inherit;
      text-decoration: none;
    } 
    .loader-container h1
    {
      font-size: 6rem;
    }
    #mount{
      position: absolute;
      left: 0;
      top: 0;
      background: white;
      width: 100%;
      height: 100%;
    }
  </style>
</head>
<body>
  <div class="loader-wrapper">
    <div class="loader-container">
      <h1>Dicto</h1>
      <p>Loading ...</p>
    </div>
  </div>
  <div class="shadow-content">
    ${seoHTML}
  </div>
  <div id="mount"></div>
  <script>
    window.__composition = ${compoJSON};
    window.__settings = ${settingsJSON};
    ${jsBuild}
  </script>
</body>
</html>
`
}