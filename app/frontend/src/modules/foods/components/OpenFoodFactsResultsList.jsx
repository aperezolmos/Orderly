import { Stack } from '@mantine/core';
import OpenFoodFactsResultItem from './OpenFoodFactsResultItem';


const OpenFoodFactsResultsList = ({ results }) => (
  
  <Stack gap="md">
    {results.map(product => (
      <OpenFoodFactsResultItem key={product.code} product={product} />
    ))}
  </Stack>
);

export default OpenFoodFactsResultsList;
