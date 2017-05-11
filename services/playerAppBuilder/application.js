const React = require('react');
const render = require('react-dom').render;
const Player = require('../../src/Player').default;

const mountNode = document.getElementById('mount');

function renderPresentation (composition, settings) {
  render(React.createElement(Player, {
    composition: composition, 
    settings: settings
  }, null), mountNode);
}

renderPresentation(window.__composition, window.settings || {displayMode: 'columns'});

module.exports = renderPresentation;