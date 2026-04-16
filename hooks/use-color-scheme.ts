import { useAppTheme } from '@/context/ThemeContext';

export function useColorScheme() {
  const { activeColorScheme } = useAppTheme();
  return activeColorScheme;
}
