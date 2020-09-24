
// standard contract calls for erc20 contracts
const erc20 = [
  "function balanceOf(address) view returns (uint)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function totalSupply() external view returns (uint256)",
];

//TODO: add more functions and cross-check field standards or add to DB
//note: this checked only for mStable: EARN Pool 5
const stakingField = [
  "function balanceOf(address) view returns (uint)",
  "function totalSupply() external view returns (uint256)",
  "function earned(address _account) public view returns (uint256)",
];

export {
  erc20,
  stakingField
}