import React from 'react';

const AppContext = React.createContext({});

export const AppProvider = AppContext.Provider;

export default AppContext;