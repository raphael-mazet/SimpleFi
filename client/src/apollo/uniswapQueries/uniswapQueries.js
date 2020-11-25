import { gql } from '@apollo/client';

const getUniswapPoolVolume =
gql`
  query getUniswapPoolVolume ($pairAddress: String! $first: Int!) {
    pairDayDatas (
      where: {pairAddress: $pairAddress}
      orderBy: date
      orderDirection: desc
      first: $first
    ) {
      dailyVolumeUSD
    }
  }
`

const getUniswapBalanceHistory =
gql`
  query getUserBalanceHistory ($user: String!) {
    liquidityPositionSnapshots (
      where: {user: $user}
      orderBy: timestamp
      orderDirection: asc
    ) {
      timestamp
      pair {
        id
      }
      block
      liquidityTokenBalance
      liquidityTokenTotalSupply
      reserveUSD
    }
  }
`

//eslint-disable-next-line import/no-anonymous-default-export
export default {
  getUniswapPoolVolume,
  getUniswapBalanceHistory
}