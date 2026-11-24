import { defineConfig } from 'vite';

const playgamaBridgeConfig = {
  advertisement: {
    rewarded: {
      placementFallback: 'hint',
      placements: [{ id: 'hint' }],
    },
  },
};

export default defineConfig(({ mode }) => ({
  plugins: [
    {
      name: 'playgama-bridge-config',
      apply: 'build',
      generateBundle() {
        if (mode !== 'playgama') return;
        this.emitFile({
          type: 'asset',
          fileName: 'playgama-bridge-config.json',
          source: JSON.stringify(playgamaBridgeConfig, null, 2),
        });
      },
    },
  ],
}));
