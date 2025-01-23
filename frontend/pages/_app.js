import { ThemeProvider } from 'styled-components';
import GlobalStyle from '../styles/GlobalStyle';
import Notifications from '../components/Notifications'

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
       <Notifications />
      <GlobalStyle />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}