import styled from '@emotion/styled';

const variants = {
  red: ['#dc3545', '#fff'],
  black: ['#000', '#fff'],
};

export const Badge = styled.span<{variant: 'red' | 'black'}>`
  display: inline-block;
  padding: 0.5em;
  font-size: 75%;
  line-height: 1;
  text-align: center;
  white-space: nowrap;
  vertical-align: baseline;
  border-radius: 0.3rem;
  font-weight: 700;

  background-color: ${(props) => variants[props.variant][0]};
  color: ${(props) => variants[props.variant][1]};
`;
