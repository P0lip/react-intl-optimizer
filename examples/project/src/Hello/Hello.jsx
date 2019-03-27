import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const Hello = () => (
  <FormattedMessage {...messages.hello } />
);
