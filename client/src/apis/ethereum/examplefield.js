//Simple
{
  "fieldId": "e360b364-a4d4-445e-b024-890fddc31c97",
  "name": "MTA-wETH 50/50",
  "balance": 8.35118478762512,
  "protocolId": "384acf66-d487-4d39-bd00-6c2ea8518729",
  "address": "0x0d0d65e7a7db277d3e0f5e1676325e75f3340455",
  "instructions": {
    "how": "provide MTA and wrapped Eth in equal measure in the Uniswap pool"
  },
  "riskLevel": 2,
  "receiptToken": "c607a06b-7277-4336-bf2c-aec65fe3f64a",
  "seedTokens": [
    {
      "tokenId": "4c2be9cb-03a4-492f-8e4c-1fd9ced2b41e",
      "protocolId": null,
      "name": "wETH",
      "priceApi": "weth",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "isBase": true
    },
    {
      "tokenId": "ed11f92a-7864-4a33-ba7c-acec36e6986b",
      "protocolId": "8939ce45-8a3e-48f3-beb3-8c09178ead00",
      "name": "Meta",
      "priceApi": "meta",
      "address": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
      "isBase": true
    }
  ],
  "cropTokens": [
    {
      "tokenId": "2f996b90-d62b-4b79-a153-495dbdc728c0",
      "protocolId": "384acf66-d487-4d39-bd00-6c2ea8518729",
      "name": "Uni",
      "priceApi": "uniswap",
      "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      "isBase": true
    }
  ]
}

//with contract

{
  "fieldId": "e360b364-a4d4-445e-b024-890fddc31c97",
  "contract": {
    "interface": {
      "fragments": [
        {
          "type": "function",
          "name": "balanceOf",
          "constant": true,
          "inputs": [
            {
              "name": null,
              "type": "address",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "address",
              "_isParamType": true
            }
          ],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        },
        {
          "type": "function",
          "name": "totalSupply",
          "constant": true,
          "inputs": [],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        },
        {
          "type": "function",
          "name": "earned",
          "constant": true,
          "inputs": [
            {
              "name": "_account",
              "type": "address",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "address",
              "_isParamType": true
            }
          ],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        }
      ],
      "_abiCoder": {
        "coerceFunc": null
      },
      "functions": {
        "balanceOf(address)": {
          "type": "function",
          "name": "balanceOf",
          "constant": true,
          "inputs": [
            {
              "name": null,
              "type": "address",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "address",
              "_isParamType": true
            }
          ],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        },
        "totalSupply()": {
          "type": "function",
          "name": "totalSupply",
          "constant": true,
          "inputs": [],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        },
        "earned(address)": {
          "type": "function",
          "name": "earned",
          "constant": true,
          "inputs": [
            {
              "name": "_account",
              "type": "address",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "address",
              "_isParamType": true
            }
          ],
          "outputs": [
            {
              "name": null,
              "type": "uint256",
              "indexed": null,
              "components": null,
              "arrayLength": null,
              "arrayChildren": null,
              "baseType": "uint256",
              "_isParamType": true
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "gas": null,
          "_isFragment": true
        }
      },
      "errors": {},
      "events": {},
      "structs": {},
      "deploy": {
        "name": null,
        "type": "constructor",
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "gas": null,
        "_isFragment": true
      },
      "_isInterface": true
    },
    "provider": {
      "_isProvider": true,
      "_events": [],
      "_emitted": {
        "block": -2
      },
      "formatter": {
        "formats": {
          "transaction": {},
          "transactionRequest": {},
          "receiptLog": {},
          "receipt": {},
          "block": {},
          "blockWithTransactions": {},
          "filter": {},
          "filterLog": {}
        }
      },
      "anyNetwork": false,
      "_networkPromise": {},
      "_maxInternalBlockNumber": -1024,
      "_lastBlockNumber": -2,
      "_pollingInterval": 4000,
      "_fastQueryDate": 0,
      "connection": {
        "url": "metamask"
      },
      "_nextId": 42,
      "provider": {
        "_events": {},
        "_eventsCount": 1,
        "_maxListeners": 100,
        "isMetaMask": true,
        "_state": {
          "sentWarnings": {
            "enable": false,
            "experimentalMethods": false,
            "send": false,
            "events": {
              "chainIdChanged": false,
              "close": false,
              "data": false,
              "networkChanged": false,
              "notification": false
            },
            "autoRefresh": true,
            "publicConfigStore": false
          },
          "isConnected": true,
          "accounts": [
            "0x6a634f1bec0e530c41cb81241acc74fd0e3acb11"
          ],
          "isUnlocked": true
        },
        "_metamask": {},
        "selectedAddress": "0x6a634f1bec0e530c41cb81241acc74fd0e3acb11",
        "networkVersion": "1",
        "chainId": "0x1",
        "_publicConfigStore": {
          "_events": {
            "update": [
              null,
              null,
              null
            ]
          },
          "_eventsCount": 1,
          "_state": {
            "isUnlocked": true,
            "networkVersion": "1",
            "chainId": "0x1"
          }
        },
        "_rpcEngine": {
          "_events": {},
          "_eventsCount": 0,
          "_middleware": [
            null,
            null,
            null
          ]
        },
        "autoRefreshOnNetworkChange": true
      },
      "_network": {
        "name": "homestead",
        "chainId": 1,
        "ensAddress": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
      }
    },
    "signer": null,
    "callStatic": {},
    "estimateGas": {},
    "functions": {},
    "populateTransaction": {},
    "filters": {},
    "_runningEvents": {},
    "_wrappedEmits": {},
    "address": "0x0d0d65e7a7db277d3e0f5e1676325e75f3340455",
    "resolvedAddress": {}
  },
  "name": "MTA-wETH 50/50",
  "balance": 8.35118478762512,
  "protocolId": "384acf66-d487-4d39-bd00-6c2ea8518729",
  "address": "0x0d0d65e7a7db277d3e0f5e1676325e75f3340455",
  "instructions": {
    "how": "provide MTA and wrapped Eth in equal measure in the Uniswap pool"
  },
  "riskLevel": 2,
  "receiptToken": "c607a06b-7277-4336-bf2c-aec65fe3f64a",
  "seedTokens": [
    {
      "tokenId": "4c2be9cb-03a4-492f-8e4c-1fd9ced2b41e",
      "protocolId": null,
      "name": "wETH",
      "priceApi": "weth",
      "address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      "isBase": true
    },
    {
      "tokenId": "ed11f92a-7864-4a33-ba7c-acec36e6986b",
      "protocolId": "8939ce45-8a3e-48f3-beb3-8c09178ead00",
      "name": "Meta",
      "priceApi": "meta",
      "address": "0xa3BeD4E1c75D00fa6f4E5E6922DB7261B5E9AcD2",
      "isBase": true
    }
  ],
  "cropTokens": [
    {
      "tokenId": "2f996b90-d62b-4b79-a153-495dbdc728c0",
      "protocolId": "384acf66-d487-4d39-bd00-6c2ea8518729",
      "name": "Uni",
      "priceApi": "uniswap",
      "address": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      "isBase": true
    }
  ]
}