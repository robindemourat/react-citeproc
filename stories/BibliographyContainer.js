import React, {Component} from 'react';

import {Bibliography} from '../src/';

import {v4 as genId} from 'uuid';

import chicago from 'raw!./styles/chicago-full-note-bibliography.csl';
import apa from 'raw!./styles/apa.csl';
import associationRegionaleDeLangueFrancaise from 'raw!./styles/association-regionale-de-langue-francaise.csl';

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
  associationRegionaleDeLangueFrancaise
};

import demoItems from './citations/demo-citeproc-js';

class BibliographyContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      style: chicago,
      locale: french,
      items: demoItems
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
        locale
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

  render() {
    const {
      style,
      locale,
      items
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

        <Bibliography
          style={style}
          locale={locale}
          items={items}
        />
      </section>
    );
  } 
}

export default BibliographyContainer;