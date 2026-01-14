import { Paper, Skeleton, Group, Stack } from '@mantine/core';


const ProductCardSkeleton = () => {
  
  return (
    <Paper
      p="md"
      withBorder
      shadow="sm"
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Badge + Action button */}
      <Group justify="apart" align="start" mb="xs">
        <Skeleton height={28} width={80} radius="sm" />
        <Skeleton height={32} width={32} radius="md" circle />
      </Group>

      {/* Name */}
      <Skeleton height={24} mb="xs" width="85%" radius="sm" />

      {/* Description */}
      <Stack gap={4} style={{ flexGrow: 1 }}>
        <Skeleton height={14} radius="sm" />
        <Skeleton height={14} width="90%" radius="sm" />
      </Stack>

      {/* Price */}
      <Group justify="apart" mt="md" style={{ marginTop: 'auto' }}>
        <Skeleton height={28} width={100} radius="sm" />
      </Group>
    </Paper>
  );
};

export default ProductCardSkeleton;
