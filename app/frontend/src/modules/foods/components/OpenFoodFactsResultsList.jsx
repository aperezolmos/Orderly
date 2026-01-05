import { Stack } from '@mantine/core';
import OpenFoodFactsResultItem from './OpenFoodFactsResultItem';


const OpenFoodFactsResultsList = ({ results, onAdd, disabled }) => (
  
  <Stack gap="md">
    {results.map(product => (
      <OpenFoodFactsResultItem
        key={product.code}
        product={product}
        onAdd={onAdd}
        disabled={disabled}
      />
    ))}
  </Stack>
);

export default OpenFoodFactsResultsList;
