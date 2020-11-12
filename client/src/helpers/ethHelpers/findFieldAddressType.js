import fieldInterfaceTypes from '../../data/fieldTypes';

function findFieldAddressType (field, dataType) {

  const relevantAddress = field.contractAddresses.find(address => address.addressTypes.includes(dataType));
  if (!relevantAddress) throw new Error('No relevant address was found - findFieldAddressType()');

  const { address } = relevantAddress;
  const { ciId, abi  } = relevantAddress.contractInterface;

  let addressType;

  for (let type in fieldInterfaceTypes) {
    if (fieldInterfaceTypes[type].filter(el => el.ciId === ciId).length) addressType = type;
    else addressType = 'default';
  }

  return {address, abi, addressType};
}

export default findFieldAddressType;