import type { AppType } from 'next/dist/shared/lib/utils';
import '../styles.css';
import '../coverImage.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />

}

export default MyApp;
