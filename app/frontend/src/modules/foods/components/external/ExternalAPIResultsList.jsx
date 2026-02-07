import { Stack } from '@mantine/core';
import ExternalAPIResultItem from './ExternalAPIResultItem';


const ExternalAPIResultsList = ({ results, onAdd, disabled }) => (
  
  <Stack gap="md">
    {results.map(product => (
      <ExternalAPIResultItem
        key={product.code}
        product={product}
        onAdd={onAdd}
        disabled={disabled}
      />
    ))}
  </Stack>
);

export default ExternalAPIResultsList;
