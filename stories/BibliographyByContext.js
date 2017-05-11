import React from 'react';
import PropTypes from 'prop-types';

const setBibTitle = (lang) => {
  switch(lang) {
    case 'english':
      return 'Bibliography';
    case 'italian':
      return 'Bibliografia';
    default:
      return 'Bibliographie';
  }
}

const Bib = ({

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