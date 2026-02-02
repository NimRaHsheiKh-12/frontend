// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import { TodoProvider } from '../context/TodoContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Todo App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <TodoProvider>
          <Component {...pageProps} />
        </TodoProvider>
      </AuthProvider>
    </>
  );
}

export default MyApp;