import { createContext, useContext }  from 'react';
import { AKData } from './AKData';

export const DataContext = createContext<AKData | null>(null);

export function useAKData() {
  const context = useContext(DataContext);
  if (context === null) {
    throw new Error('useData must be used within a DataContext');
  }
  return context
}

export default DataContext;
