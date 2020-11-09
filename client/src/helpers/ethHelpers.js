import fieldInterfaceTypes from '../data/fieldTypes';

function findFieldMethod (field, dataType) {

  const relevantAddress = field.contractAddresses.find(address => address.addressTypes.includes(dataType));
  const { address } = relevantAddress;
  const { ciId, abi  } = relevantAddress.contractInterface;

  for (let type in fieldInterfaceTypes) {
    if (fieldInterfaceTypes[type].filter(el => el.ciId === ciId).length) return {address, abi, type};
  }
  return 'default'
}

export default findFieldMethod;