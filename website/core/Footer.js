/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer id="main-footer">
        <div className="container">
          <a href={this.props.config.baseUrl} className="logo nav-home">
            {this.props.config.footerIcon && (
              <img
                src={this.props.config.baseUrl + this.props.config.footerIcon}
                alt={this.props.config.title}
              />
            )}
          </a>
          <div className="links">
            <a href="https://the-guild.dev" title="The Guild Blog">
              <img src="/img/ui/social/medium.svg" alt="Link to Medium" />
            </a>
            <a
              href="https://twitter.com/kamilkisiela"
              title="Follow me on Twitter"
            >
              <img src="/img/ui/social/twitter.svg" alt="Link to Twitter" />
            </a>
            <a
              href="https://spectrum.chat/graphql-inspector"
              title="Chat about GraphQL Inspector on Spectrum"
            >
              <img src="/img/ui/social/spectrum.svg" alt="Link to Spectrum" />
            </a>
            <a
              href="https://github.com/kamilkisiela/graphql-inspector"
              title="Give us a star on GitHub"
            >
              <img src="/img/ui/social/github.svg" alt="Link to GitHub" />
            </a>
          </div>
          <div className="copyrights">{this.props.config.copyright}</div>
        </div>
      </footer>
    );
  }

  // render() {
  //   return (
  //     <footer className="nav-footer" id="footer">
  //       <section className="sitemap">
  //         <a href={this.props.config.baseUrl} className="nav-home">
  //           {this.props.config.footerIcon && (
  //             <img
  //               src={this.props.config.baseUrl + this.props.config.footerIcon}
  //               alt={this.props.config.title}
  //               width="66"
  //               height="58"
  //             />
  //           )}
  //         </a>
  //         <div>
  //           <h5>Documentation</h5>
  //           <a href={this.docUrl('', this.props.language)}>
  //             What is GraphQL Inspector
  //           </a>
  //           <a href={this.docUrl('installation', this.props.language)}>
  //             Getting Started
  //           </a>
  //           <a href={this.docUrl('recipes/github', this.props.language)}>
  //             GitHub Application
  //           </a>
  //         </div>
  //         <div>
  //           <h5>Community</h5>
  //           <a href="https://spectrum.chat/graphql-inspector">Spectrum Chat</a>
  //           <a
  //             href="https://twitter.com/kamilkisiela"
  //             target="_blank"
  //             rel="noreferrer noopener"
  //           >
  //             Twitter
  //           </a>
  //         </div>
  //         <div>
  //           <h5>More</h5>
  //           <a href="https://medium.com/the-guild">Medium</a>
  //           <a href="https://github.com/kamilkisiela/graphql-inspector">
  //             GitHub
  //           </a>
  //           <a
  //             className="github-button"
  //             href={this.props.config.repoUrl}
  //             data-icon="octicon-star"
  //             data-count-href="/kamilkisiela/graphql-inspector/stargazers"
  //             data-show-count="true"
  //             data-count-aria-label="# stargazers on GitHub"
  //             aria-label="Star this project on GitHub"
  //           >
  //             Star
  //           </a>
  //         </div>
  //       </section>

  //       <section className="copyright">{this.props.config.copyright}</section>
  //     </footer>
  //   );
  // }
}

module.exports = Footer;
