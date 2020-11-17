import { ApolloClient, InMemoryCache } from '@apollo/client';

const uniswapClient = new ApolloClient({
  uri: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  cache: new InMemoryCache()
});

export default uniswapClient;