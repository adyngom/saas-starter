export interface ThemeConfig {
  name: string;
  label: string;
  cssFile: string;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export const THEME_CONFIGS: ThemeConfig[] = [
  {
    name: 'default',
    label: 'Default',
    cssFile: '/themes/default.css',
    previewColors: {
      primary: 'oklch(0.205 0 0)',
      secondary: 'oklch(0.97 0 0)',
      accent: 'oklch(0.97 0 0)',
    },
  },
  {
    name: 'blue',
    label: 'Blue',
    cssFile: '/themes/blue.css',
    previewColors: {
      primary: 'oklch(0.623 0.214 259.815)',
      secondary: 'oklch(0.967 0.001 286.375)',
      accent: 'oklch(0.967 0.001 286.375)',
    },
  },
  {
    name: 'green',
    label: 'Green',
    cssFile: '/themes/green.css',
    previewColors: {
      primary: 'oklch(0.723 0.219 149.579)',
      secondary: 'oklch(0.967 0.001 286.375)',
      accent: 'oklch(0.967 0.001 286.375)',
    },
  },
  {
    name: 'orange',
    label: 'Orange',
    cssFile: '/themes/orange.css',
    previewColors: {
      primary: 'oklch(0.705 0.213 47.604)',
      secondary: 'oklch(0.967 0.001 286.375)',
      accent: 'oklch(0.967 0.001 286.375)',
    },
  },
  {
    name: 'red',
    label: 'Red',
    cssFile: '/themes/red.css',
    previewColors: {
      primary: 'oklch(0.637 0.237 25.331)',
      secondary: 'oklch(0.967 0.001 286.375)',
      accent: 'oklch(0.967 0.001 286.375)',
    },
  },
  {
    name: 'rose',
    label: 'Rose',
    cssFile: '/themes/rose.css',
    previewColors: {
      primary: 'oklch(0.597 0.164 3.716)',
      secondary: 'oklch(0.967 0.004 7.687)',
      accent: 'oklch(0.967 0.004 7.687)',
    },
  },
  {
    name: 'violet',
    label: 'Violet',
    cssFile: '/themes/violet.css',
    previewColors: {
      primary: 'oklch(0.606 0.25 292.717)',
      secondary: 'oklch(0.967 0.001 286.375)',
      accent: 'oklch(0.967 0.001 286.375)',
    },
  },
  {
    name: 'yellow',
    label: 'Yellow',
    cssFile: '/themes/yellow.css',
    previewColors: {
      primary: 'oklch(0.645 0.163 79.844)',
      secondary: 'oklch(0.967 0.01 98.716)',
      accent: 'oklch(0.967 0.01 98.716)',
    },
  },
];

export const DEFAULT_THEME = 'default';