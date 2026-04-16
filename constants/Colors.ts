const tintColorLight = 'hsl(265, 100%, 46.9%)';
const tintColorDark = 'hsl(265, 100%, 60%)';

export const Colors = {
  light: {
    text: 'hsl(222.2, 84%, 4.9%)',
    background: 'hsl(0, 0%, 100%)',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    card: 'hsl(0, 0%, 100%)',
    border: 'hsl(214.3, 31.8%, 91.4%)',
    primary: 'hsl(265, 100%, 46.9%)',
    primaryTransparent: 'hsla(265, 100%, 46.9%, 0.2)',
    muted: 'hsl(210, 40%, 96.1%)',
    mutedForeground: 'hsl(215.4, 16.3%, 46.9%)',
    destructive: 'hsl(0, 84.2%, 60.2%)',
    destructiveTransparent: 'hsla(0, 84.2%, 60.2%, 0.2)',
  },
  dark: {
    text: 'hsl(210, 40%, 98%)',
    background: 'hsl(222.2, 84%, 4.9%)',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    card: 'hsl(222.2, 84%, 8%)', // changed to stand out against background
    border: 'hsl(217.2, 32.6%, 17.5%)',
    primary: 'hsl(265, 100%, 60%)',
    primaryTransparent: 'hsla(265, 100%, 60%, 0.2)',
    muted: 'hsl(217.2, 32.6%, 17.5%)',
    mutedForeground: 'hsl(215, 20.2%, 65.1%)',
    destructive: 'hsl(0, 62.8%, 30.6%)',
    destructiveTransparent: 'hsla(0, 62.8%, 30.6%, 0.2)',
  },
};
