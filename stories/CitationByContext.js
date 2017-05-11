import React from 'react';
import PropTypes from 'prop-types';

const Citation = ({
  id
}, {
  citations
}) => {
  const citation = citations && citations[id];
  return (
    <span 
      id={id}
      style={{
        color: 'lightgreen'
      }}
    >
      {citation && citation.Component}
    </span>
  );
}

Citation.contextTypes = {
  citations: PropTypes.object
}

export default Citation;