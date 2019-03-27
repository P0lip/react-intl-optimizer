import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import messages from './messages';

export const Name = () => (
  <div>
    <FormattedMessage {...messages.firstName } />
    <FormattedMessage {...messages.lastName } />
  </div>
);
