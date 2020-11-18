const ethers = require('ethers');

async function getTotalFieldSupply (fieldName, contract, decimals, cache) {

  const findSupplyInCache = cache.filter(fieldWithSupply => fieldWithSupply.fieldName === fieldName)[0];
  
  let totalFieldSupply;
  if (findSupplyInCache) {
    totalFieldSupply = findSupplyInCache.totalFieldSupply;
  } else {
    const bigIntSupply = await contract.totalSupply();
    totalFieldSupply = Number(ethers.utils.formatUnits(bigIntSupply, decimals));
    cache.push({
      fieldName,
      totalFieldSupply
    });
  }
  return totalFieldSupply;
}

export default getTotalFieldSupply;