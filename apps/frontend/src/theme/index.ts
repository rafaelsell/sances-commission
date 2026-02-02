import {
  defineConfig,
  createSystem,
  defaultConfig,
  type SystemConfig,
} from "@chakra-ui/react";

const theme: SystemConfig = defineConfig({
  globalCss: {
    body: {
      bgColor: "white",
      color: "black",
      fontFamily: `'Montserrat', sans-serif`,
      fontWeight: 400,
    },
  },
  theme: {
    tokens: {
      colors: {
        brand: {
          navy: { value: "#001A33" },
          cyan: { value: "#018085" },
          gray: {
            50: { value: "#F4F7F9" },
            100: { value: "#E2E8F0" },
            600: { value: "#718096" },
            800: { value: "#1A202C" },
          },
        },
      },
    },
    semanticTokens: {
      colors: {
        primary: { value: "{colors.brand.navy}" },
        accent: { value: "{colors.brand.cyan}" },
        bg: {
          default: { value: "#FFFFFF" },
          subtle: { value: "{colors.brand.gray.50}" },
        },
        fg: {
          default: { value: "{colors.brand.gray.800}" },
          muted: { value: "{colors.brand.gray.600}" },
        },
      },
    },
  },
});

export const system = createSystem(theme, defaultConfig);
