import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';

const theme = {
  colors: {
    primary: '#FFD700',
    background: '#1A1A1A',
    text: '#FFFFFF',
  },
};

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}