import { Container, Title, Text, Button, Group, Stack,
         Box, ThemeIcon, SimpleGrid } from "@mantine/core";
import { IconArrowRight, IconBrandGithub, IconApps, IconToolsKitchen3 } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNavigationConfig } from "../../../utils/navigationConfig";


export const Hero = () => {
  
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const modules = getNavigationConfig(t);
  const displayModules = modules.slice(0, 7);
  const hasMoreFeatures = modules.length > 6;


  const handleGetStarted = () => {
    navigate("/login");
  };

  const handleViewDocs = () => {
    window.open("https://github.com/aperezolmos/orderly", "_blank");
  };


  return (
    <Box
      style={{
        padding: "2rem 0",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Container size="xl" py={80}>
        <Stack gap={130}> 
          
          <Stack gap="xl" maw={1100}>
            <Group gap="xs">
              <ThemeIcon size="sm" radius="md" variant="light" color="var(--mantine-primary-color-filled)">
                <IconToolsKitchen3 size={14} />
              </ThemeIcon>
              <Text fw={500} size="sm" tt="uppercase" c="dimmed">{t("hero.subtitle")}</Text>
            </Group>

            <Title
              order={1}
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.1,
                fontWeight: 900,
              }}
            >
              {t("hero.title.line1")}{" "}
              <Text span c="var(--mantine-primary-color-filled)" inherit style={{ display: "inline-block" }}>
                {t("hero.title.highlight")}
              </Text>{" "}
              {t("hero.title.line2")}
            </Title>

            <Text size="lg" c="dimmed" lh={1.7} maw={800}>{t("hero.description")}</Text>

            <Group gap="md">
              <Button size="lg" rightSection={<IconArrowRight size={18} />} onClick={handleGetStarted}>
                {t("hero.buttons.getStarted")}
              </Button>
              <Button size="lg" variant="default" leftSection={<IconBrandGithub size={18} />} onClick={handleViewDocs}>
                {t("hero.buttons.viewDocs")}
              </Button>
            </Group>
          </Stack>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl" verticalSpacing={60}>
            {displayModules.map((module) => {
              const ModuleIcon = module.icon;
              return (
                <Stack key={module.id} gap="sm" align="center" style={{ textAlign: "center" }}>
                  <ThemeIcon 
                    size={44} 
                    radius="md" 
                    variant="light" 
                    color={module.color}
                  >
                    <ModuleIcon size={24} />
                  </ThemeIcon>

                  <Text fw={600}>{module.label}</Text>
                  <Text size="sm" c="dimmed" maw={300}>
                    {module.descriptionLong}
                  </Text>
                </Stack>
              );
            })}

            {hasMoreFeatures && (
              <Stack gap="sm" align="center" style={{ textAlign: "center" }}>
                <ThemeIcon size={44} radius="md" variant="light" color="gray">
                  <IconApps size={24} />
                </ThemeIcon>
                <Text fw={600}>{t("hero.moreFeatures.title")}</Text>
                <Text size="sm" c="dimmed" maw={300}>
                  {t("hero.moreFeatures.description")}
                </Text>
              </Stack>
            )}
          </SimpleGrid>
        </Stack>
      </Container>
    </Box>
  );
};
