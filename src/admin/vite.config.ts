import { mergeConfig, type UserConfig } from 'vite';

export default (config: UserConfig) => {
  return mergeConfig(config, {
    optimizeDeps: {
      include: [
        '@blocknote/core',
        '@blocknote/react',
        '@blocknote/mantine',
        '@mantine/core',
        '@mantine/hooks',
      ],
    },
  });
};
