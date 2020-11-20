import React from 'react';

export default function FieldDetails ({name, userTokens, userFields}) {

  const currentField = userFields.find(field => field.name === name);
  console.log(' ---> currentField', currentField);

  return (
  <p>{`Hello ${name}`}</p>
  )

}
