import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {ReferencesManager} from '../src/';

import Bib from './BibliographyByContext';
import Citation from './CitationByContext';

import {v4 as genId} from 'uuid';

import chicago from 'raw!./styles/chicago-full-note-bibliography.csl';
import apa from 'raw!./styles/apa.csl';
import associationRegionaleDeLangueFrancaise from 'raw!./styles/association-regionale-de-langue-francaise.csl';
import iso690 from 'raw!./styles/iso690-note-fr.csl';

import french from 'raw!./locales/locales-fr-FR.xml';
import english from 'raw!./locales/locales-en-US.xml';
import italian from 'raw!./locales/locales-it-IT.xml';

const locales = {
  french,
  english,
  italian
};

const styles = {
  chicago,
  apa,
  associationRegionaleDeLangueFrancaise,
  iso690
};

import demoItems from './citations/demo-citeproc-js';
import demoCitations from './citations/demo-citations';

class ReferencesContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: chicago,
      locale: french,
      items: demoItems,
      lang: 'french',

      citations: demoCitations
    }

    this.addItems = () => {
      const newItems = Object.keys(demoItems).reduce((results, itemKey) => {
        const item = demoItems[itemKey];
        return {
          ...results,
          [genId()]: item
        }
      }, {});
      this.setState({
        items: {
          ...this.state.items,
          ...newItems
        }
      })
    };

    this.onLocaleChange = (e) => {
      const localeName = e.target.value;
      const locale = locales[localeName];
      this.setState({
        locale,
        lang: localeName
      })
    };
    this.onStyleChange = (e) => {
      const styleName = e.target.value;
      const style = styles[styleName];
      this.setState({
        style
      })
    };
  }

  getChildContext () {
    return {
      lang: this.state.lang
    }
  }

  render() {
    const {
      style,
      locale,
      items,
      citations
    } = this.state;
    return (
      <section>
        <div style={{
          marginBottom: '2rem'
        }}>
          <button onClick={this.addItems}>Add items</button>
          
          <div>
            Change locale:
            <select onChange={this.onLocaleChange}>
              {
                Object.keys(locales).map(localeName => (
                  <option key={localeName} value={localeName}>{localeName}</option>
                ))
              }
            </select>
          </div>

          <div>
            Change citation style:
            <select onChange={this.onStyleChange}>
              {
                Object.keys(styles).map(styleName => (
                  <option key={styleName} value={styleName}>{styleName}</option>
                ))
              }
            </select>
          </div>
        </div>

        <ReferencesManager
          style={style}
          locale={locale}
          items={items}
          citations={citations}
        >
          <div>
            <h1>Text with inline citations</h1>
            Lorem ipsum dolor sit amet <Citation id="CITATION-1" />, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit<Citation id="CITATION-2" /> in voluptate velit esse
cillum dolore eu fugiat nulla pariatur<Citation id="CITATION-3" />. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum<Citation id="CITATION-4" />.
          </div>
          <div>
            <Bib />
          </div>
        </ReferencesManager>
      </section>
    );
  } 
}

ReferencesContainer.childContextTypes = {
  lang: PropTypes.string
}

export default ReferencesContainer;