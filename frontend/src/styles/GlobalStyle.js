import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    background-color: ${(props) => props.theme.colors.background};
    color: ${(props) => props.theme.colors.text};
    font-family: 'Arial', sans-serif;
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  p {
    font-size: 1rem;
  }

  button {
    cursor: pointer;
  }

  /* Media Queries for Responsive Design */
  @media (max-width: 768px) {
    h1 {
      font-size: 1.5rem;
    }

    h2 {
      font-size: 1.25rem;
    }

    p {
      font-size: 0.875rem;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.25rem;
    }

    h2 {
      font-size: 1rem;
    }

    p {
      font-size: 0.75rem;
    }
  }
`;

export default GlobalStyle;