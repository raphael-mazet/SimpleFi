import React from 'react';
import { useParams } from 'react-router-dom';
import HoldingChart from '../HoldingChart/HoldingChart';
import HoldingDetailAction from '../HoldingDetailAction/HoldingDetailAction';

export default function HoldingDetails ({userTokens, userFields}) {
  let { tokenName } = useParams();
  console.log(' ---> tokenName', tokenName);
  const detailedToken = userTokens.filter(token => token.name === tokenName);
  console.log(' ---> detailedToken', detailedToken);

  return (
    <HoldingDetailAction available={true} amount={detailedToken.balance}/>


    //<HoldingChart/>
  )
}