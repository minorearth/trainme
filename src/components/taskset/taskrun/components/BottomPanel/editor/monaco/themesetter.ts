export const monacoDarktheme = {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      token: "identifier",
      foreground: "9CDCFE",
    },
    {
      token: "identifier.function",
      foreground: "DCDCAA",
    },
    {
      token: "type",
      foreground: "1AAFB0",
    },
  ],
  colors: {
    "editor.background": "#121212",
  },
};

export const monacoLighttheme = {
  base: "vs",
  inherit: true,
  rules: [],
  colors: {
    "editor.background": "#FFFFFF",
  },
};
