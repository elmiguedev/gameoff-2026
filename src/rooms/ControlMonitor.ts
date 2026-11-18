import type Phaser from 'phaser';

export const CONTROL_MONITOR_LAYOUT = {
  screenX: 200,
  screenY: 125,
  screenWidth: 880,
  screenHeight: 410,
  screenRadius: 24,
  standLeftX: 580,
  standRightX: 700,
  standTopY: 535,
  standBottomY: 563,
  footX: 455,
  footY: 561,
  footWidth: 370,
  footHeight: 12,
  footRadius: 6,
} as const;

export function createControlMonitor(scene: Phaser.Scene): Phaser.GameObjects.Graphics {
  const layout = CONTROL_MONITOR_LAYOUT;
  const monitor = scene.add.graphics();
  monitor.fillStyle(0x000000, 1);
  monitor.fillRoundedRect(
    layout.screenX,
    layout.screenY,
    layout.screenWidth,
    layout.screenHeight,
    layout.screenRadius,
  );
  monitor.lineStyle(7, 0x000000, 1);
  monitor.beginPath();
  monitor.moveTo(layout.standLeftX, layout.standTopY);
  monitor.lineTo(layout.standLeftX, layout.standBottomY);
  monitor.moveTo(layout.standRightX, layout.standTopY);
  monitor.lineTo(layout.standRightX, layout.standBottomY);
  monitor.strokePath();
  monitor.fillRoundedRect(
    layout.footX,
    layout.footY,
    layout.footWidth,
    layout.footHeight,
    layout.footRadius,
  );
  return monitor;
}
