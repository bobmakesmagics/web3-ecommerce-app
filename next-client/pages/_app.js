import Head from 'next/head';
import '../styles/globals.css';
import Layout from '../components/layout';
import store from '../app/store';
import { Provider } from 'react-redux';

export default function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Head>
        <title>Web3 Shopping Cart</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
