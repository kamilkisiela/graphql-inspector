import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 200px;
  background-color: #fff;
  padding: 2.5rem 0;
  margin-bottom: -1px;
  border-top: 1px solid rgb(238, 238, 238);
  border-bottom: 1px solid rgb(238, 238, 238);
  transition: all 0.2s ease 0s;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.04) 0px 5px 40px;
  }
`;

const FeatureTitle = styled.h3`
  font-size: 36px;
  font-weight: 500;
`;

const FeatureImage = styled.div`
  text-align: center;
`;

const FeatureText = styled.div`
  ${(props) => (props.reversed ? 'padding-right' : 'padding-left')}: 70px;
`;

const FeatureContent = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 50px 25px;
  box-sizing: border-box;

  display: flex;
  align-items: center;

  & > * {
    width: 50%;
    flex-shrink: 1;
  }

  & > ${FeatureImage} {
    width: 50%;
    flex-shrink: 0;
    text-align: ${props => props.reversed ? 'right' : 'left'};

    & > img {
      max-width: 90%;
    }
  }

  @media only screen and (max-width: 996px) {
    width: 100%;
    flex-wrap: wrap;

    ${props => props.reversed ? '' : 'flex-direction: column-reverse;'}

    & > ${FeatureImage},
    & > ${FeatureText} {
      width: 100%;
      padding: 0;
      text-align: center;
    }

    & > ${FeatureText} {
      padding-bottom: 50px;
    }

    & > ${FeatureImage} > img {
      max-width: 60%;
    }
  }
`;

export function Feature({reversed, title, img, text}) {
  const left = <FeatureImage>{img}</FeatureImage>;
  const right = (
    <FeatureText reversed={reversed}>
      <FeatureTitle>{title}</FeatureTitle>
      {text}
    </FeatureText>
  );

  return (
    <Container>
      <FeatureContent reversed={reversed}>
        {reversed ? (
          <>
            {right}
            {left}
          </>
        ) : (
          <>
            {left}
            {right}
          </>
        )}
      </FeatureContent>
    </Container>
  );
}
