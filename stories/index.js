import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import Welcome from './Welcome';


storiesOf('Welcome', module)
  .add('to Storybook', () => (
    <Welcome showApp={linkTo('Button')}/>
  ));


import BibliographyContainer from './BibliographyContainer';

storiesOf('React bibliography', module)
  .add('simple bibliography', () => (
    <BibliographyContainer />
  ))

import ReferencesContainer from './ReferencesContainer';
import EmptyReferencesContainer from './EmptyReferencesContainer';

storiesOf('React references', module)
  .add('pass bibliographic elements through context', () => (
    <ReferencesContainer />
  ))
  .add('pass bibliographic elements through context (empty)', () => (
    <EmptyReferencesContainer />
  ))

/**
 * CSL Engine API
 / https://github.com/Juris-M/citeproc-js/blob/22e86b46576bde2c2b78896bbe00644017d02d39/manual/citeproc-doc.rst
/*
buildTokenLists
setStyleAttributes
getTerm
getDate
getOpt
getVariable
getDateNum
configureTokenLists
configureTokenList
retrieveItems
retrieveItem
setOpt
inheritOpt
remapSectionVariable
setNumberLabels
normalDecorIsOrphan
getCitationLabel
getTrigraphParams
setOutputFormat
getSortFunc
setLangTagsForCslSort
setLangTagsForCslTransliteration
setLangTagsForCslTranslation
setLangPrefsForCites
setLangPrefsForCiteAffixes
setAutoVietnameseNamesOption
setAbbreviations
setSuppressTrailingPunctuation
previewCitationCluster
appendCitationCluster
processCitationCluster
process_CitationCluster
makeCitationCluster <- IMPORTANT
makeBibliography <- IMPORTANT
setCitationId
rebuildProcessorState
restoreProcessorState
updateItems <- IMPORTANT
updateUncitedItems
localeConfigure
localeSet
dateParseArray
processNumber
getJurisdictionList
retrieveAllStyleModules
*/