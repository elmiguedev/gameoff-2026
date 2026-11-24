import { defineConfig } from 'vite';
import playgamaBridge from '@playgama/bridge/vite';

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
    ...(mode === 'playgama' ? [playgamaBridge({ mode: 'local' })] : []),
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
