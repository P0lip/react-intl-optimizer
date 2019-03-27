import * as React from 'react';
import getMessages from 'react-intl-optimizer/client';
import { addLocaleData, IntlProvider } from 'react-intl';

import enLocaleData from 'react-intl/locale-data/en';
import plLocaleData from 'react-intl/locale-data/pl';

addLocaleData([
  ...enLocaleData,
  ...plLocaleData,
]);

export class IntlConnector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: 'en',
      messages: {},
    };
  }

  componentDidMount() {
    this.fetchMessages(this.state.locale);
  }

  async fetchMessages(locale) {
    // note: if you set proper defaultLanguage in react-intl-optimizer's Webpack settings, no request might be required
    // getMessages caches the results in IndexedDB.
    // The cache is invalidated when messages change (this relies on html-webpack-plugin)
    const messages = await getMessages(locale);
    this.setState({ locale, messages });
  }

  handleLanguageChange(locale) {
    this.fetchMessages(locale);
  }

  render() {
    return (
      <IntlProvider locale={this.state.locale} messages={this.state.messages}>
        <>
          {this.props.children}
          current language {this.state.locale}
          {['en', 'pl'].map((lang) => (
            <button key={lang} onClick={() => this.handleLanguageChange(lang)}>{lang}</button>
          ))}
        </>
      </IntlProvider>
    );
  }
}
