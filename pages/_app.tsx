import { ApolloProvider } from '@apollo/react-hooks'
import { useApollo } from '../apollo/client'
import './style.css';

export default function App({ Component, pageProps }) {
  const apolloClient = useApollo(pageProps.initialApolloState)

  return (
    <ApolloProvider client={apolloClient}>
      <h1>
        DiceBag
      </h1>
      <Component {...pageProps} />
    </ApolloProvider>
  )
}
