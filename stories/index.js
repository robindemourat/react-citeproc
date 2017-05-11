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