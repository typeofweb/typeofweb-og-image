import type { AppType } from 'next/dist/shared/lib/utils';
import '../public/styles.css';
import '../public/coverImage.css';

const MyApp: AppType = ({ Component, pageProps }) => {
  return <Component {...pageProps} />

}

export default MyApp;
