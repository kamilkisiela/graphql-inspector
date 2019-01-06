/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

const CompLibrary = require('../../core/CompLibrary.js');

const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const {siteConfig, language = ''} = this.props;
    const {baseUrl, docsUrl} = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ''}`;
    const langPart = `${language ? `${language}/` : ''}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="projectLogo">
        <img src={props.img_src} alt="Project Logo" />
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl('index.html')}>Get started</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const {config: siteConfig, language = ''} = this.props;
    const {baseUrl} = siteConfig;

    const Features = () => {
      const features = [
        {
          title: 'Github integration',
          image: `${baseUrl}img/cli/github.jpg`,
          content:
            'Have a per-repository, self-hosted GraphQL Inspector service or deploy it with Docker.',
        },
        {
          title: 'Compare GraphQL Schemas',
          image: `${baseUrl}img/cli/diff.jpg`,
          content:
            'Detects every change (both neutral, dangerous or breaking).',
        },
        {
          title: 'Validate documents agains a schema',
          image: `${baseUrl}img/cli/validate.jpg`,
          content:
            'Validates documents against a schema and looks for deprecated usage.',
        },
        {
          title: 'Find duplicated types',
          image: `${baseUrl}img/cli/similar.jpg`,
          content: 'Finds similar / duplicated types.',
        },
        {
          title: 'Schema coverage',
          image: `${baseUrl}img/cli/coverage.jpg`,
          content:
            'Schema coverage based on documents. Find out how many times types and fields are used in your application.',
        },
      ];

      return (
        <React.Fragment>
          {features.map((feature, i) => {
            const isLight = i % 2 === 0;

            return (
              <Container
                key={i}
                padding={['bottom', 'top']}
                background={isLight ? 'light' : ''}
              >
                <GridBlock
                  contents={[
                    {
                      title: feature.title,
                      content: feature.content,
                      image: feature.image,
                      imageAlign: isLight ? 'right' : 'left',
                    },
                  ]}
                />
              </Container>
            );
          })}
        </React.Fragment>
      );
    };

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div
          className="mainContainer"
          style={{
            paddingBottom: 0,
          }}
        >
          <Features />
        </div>
      </div>
    );
  }
}

module.exports = Index;
