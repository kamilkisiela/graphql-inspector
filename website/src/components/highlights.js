import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  width: 100%;
  min-height: 200px;
  background-color: #f4f4f4;
  color: #555555;
`;

const Title = styled.h3`
  font-size: 30px;
  font-weight: 800;
  color: #343434;
`;

const Limiter = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 100px 25px;
  box-sizing: border-box;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(1fr);
  grid-column-gap: 80px;
  grid-row-gap: 80px;

  @media only screen and (max-width: 996px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

export function Highlights({highlights}) {
  return (
    <Container>
      <Limiter>
        <Grid>
          {highlights.map(({title, text, link}) => {
            return (
              <div key={title}>
                <Title>{title}</Title>
                {text}
                {link}
              </div>
            );
          })}
        </Grid>
      </Limiter>
    </Container>
  );
}
