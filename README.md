[WIP] - react-citeproc
===

This project is aiming at providing react components acting as wrappers for bibliography and citation objects in react. It is built on top of the [`cite-proc`](https://github.com/Juris-M/citeproc-js/) lib.

Cite-proc doc : https://github.com/Juris-M/citeproc-js/blob/22e86b46576bde2c2b78896bbe00644017d02d39/manual/citeproc-doc.rst

# `Bibliography` component

This is a ready-to-use component for producing bibliography content as a react component.

## API

```js
Bibliography.propTypes = {
  /**
   * The class to use for identifying the component
   */
  componentClass: PropTypes.string,
  /**
   * Serialized csl data to use for styling the bibliography
   */
  style: PropTypes.string,
  /**
   * Serialized xml data to use for localizing the terms
   */
  locale: PropTypes.string,
  /**
   * csl-json bibliographic items to represent - keys stand for items ids, values are js objects
   */
  items: PropTypes.object,
};
```

## Example


```js
const style = require('raw!./my-csl-style.csl');
const locale = require('raw!./my-xml-locale.xml');
// App.js
const App = ({
    items
}) => (
    <Bibliography
      style={style}
      locale={locale}
      items={items}
    />
);
```

/

# `ReferencesManager` component

This is a wrapping component exposing bibliography and citations data through its context.

When using this wrapper, `context.bibliography` is an array of react components to use for displaying the bibliography, and `context.citations` is an object containing citations with relevant data.

## API

```
ReferencesManager.propTypes = {
  /**
   * The class to use for identifying the component
   */
  componentClass: PropTypes.string,
  /**
   * Serialized csl data to use for styling the bibliography
   */
  style: PropTypes.string,
  /**
   * Serialized xml data to use for localizing the terms
   */
  locale: PropTypes.string,
  /**
   * csl-json bibliographic items to represent - keys stand for items ids, values are js objects
   */
  items: PropTypes.object,
  /**
   * array of citation arrays to use for building citations data
   * Each citation array represents the citation content and context as follows :
   * citation[0] : object containing the citations (with properties citationID (string), citationItems (array), and properties (object))
   * citation[1] : array of citations preceding the given citation ([0]: citationId, [1]: citation index)
   * citation[2] : array of citations following the given citation ([0]: citationId, [1]: citation index)
   */
  citations: PropTypes.array,
};
```

## Example

```js
// App.js
const style = require('raw!./my-csl-style.csl');
const locale = require('raw!./my-xml-locale.xml');
const App = ({
    items,
    citations
}) => (
    <ReferencesManager
          style={style}
          locale={locale}
          items={items}
          citations={citations}
        >
          <div>
            <h1>Text with inline citations</h1>
            Lorem ipsum dolor sit amet <Citation id="CITATION-1" />, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua.
          </div>
          <div>
            <Bib title="Bibliographie" />
          </div>
    </ReferencesManager>
);

// Citation.js

const Citation = ({
  id
}, {
  citations
}) => {
  const citation = citations && citations[id];
  return (
    <span 
      id={id}
    >
      {citation && citation.Component}
    </span>
  );
}

Citation.contextTypes = {
  citations: PropTypes.object
}

export default Citation;

// Bib.js

const Bib = ({
    title
}, {
  bibliography,
  lang
}) => {
  const title = setBibTitle(lang);
  return (
    <section>
      <h2>{title}</h2>
      <div>{bibliography}</div>
    </section>
  );
}

Bib.contextTypes = {
  bibliography: PropTypes.object,
  lang: PropTypes.string
}

export default Bib;
```
