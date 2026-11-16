import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';

const OPTIONS = [
  'REVISAR ÍNDICE DE SALAS',
  'VOLVER A LA PUERTA',
  'CERRAR SESIÓN DEL NARRADOR',
];

export default class NarratorControlRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private focusIndex = 0;
  private optionLabels: Phaser.GameObjects.Text[] = [];

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.focusIndex = 0;
    this.optionLabels = [];

    if (this.progress.backdoorAttempt) {
      this.showLockedBackdoor();
      return;
    }

    const monitor = this.addRoomObject(this.scene.add.graphics());
    monitor.lineStyle(3, 0x111111, 1);
    monitor.strokeRect(350, 145, 580, 390);
    monitor.beginPath();
    monitor.moveTo(590, 535);
    monitor.lineTo(590, 575);
    monitor.lineTo(690, 575);
    monitor.lineTo(690, 535);
    monitor.moveTo(550, 576);
    monitor.lineTo(730, 576);
    monitor.strokePath();

    this.addLabel(640, 185, 'NARRADOR: ACTIVO', 20, '#111111');
    this.addLabel(430, 250, 'PANEL DE CONTROL', 13, '#777777', 0);

    OPTIONS.forEach((option, index) => {
      const label = this.addRoomObject(this.scene.add.text(430, 335 + index * 58, '', {
        color: '#111111',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '16px',
      }).setOrigin(0, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));

      this.optionLabels.push(label);
    });

    this.updateOptions();
    this.showHint(this.progress.enteredControlRoomEarly
      ? 'Otra vez vos. La primera vez todavía no había empezado el recorrido.'
      : '¿Ves? Todo sigue bajo control. Incluso vos.');
  }

  protected onShiftDown(_side: ShiftSide): void {}

  protected override onShiftTab(): void {
    this.focusIndex = (this.focusIndex - 1 + OPTIONS.length) % OPTIONS.length;
    this.updateOptions();

    if (this.focusIndex === 2) {
      this.showHint(this.progress.enteredControlRoomEarly
        ? 'Ya sabías que estaba acá. No significa que tengas que usarla.'
        : 'Esa opción no estaba a la vista. No hace falta que la elijas.');
    } else {
      this.showHint('El panel responde. No veo por qué seguir insistiendo.');
    }
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
    if (event.repeat) return;

    if (this.focusIndex === 2) {
      const closingText = this.progress.enteredControlRoomEarly
        ? 'Bueno. Fue un placer guiarte. Y sí, recuerdo que encontraste esta sala antes de que empezara el recorrido. La evaluación… la va a hacer otra persona.'
        : 'Bueno. Fue un placer guiarte. La evaluación de tu desempeño… la va a hacer otra persona.';
      this.finishGame(closingText);
      return;
    }

    this.showHint(this.focusIndex === 0
      ? 'Un registro impecable. Qué sorpresa.'
      : 'No. Estamos bien acá.');
  }

  private updateOptions(): void {
    this.optionLabels.forEach((label, index) => {
      const isHiddenCloseOption = index === 2 && this.focusIndex !== 2;
      label.setText(isHiddenCloseOption ? '' : `${index === this.focusIndex ? '›' : ' '}  ${OPTIONS[index]}`);
      label.setColor(index === this.focusIndex ? '#111111' : '#777777');
    });
  }

  private showLockedBackdoor(): void {
    const monitor = this.addRoomObject(this.scene.add.graphics());
    monitor.lineStyle(3, 0x111111, 1);
    monitor.strokeRect(350, 145, 580, 390);
    monitor.beginPath();
    monitor.moveTo(590, 535);
    monitor.lineTo(590, 575);
    monitor.lineTo(690, 575);
    monitor.lineTo(690, 535);
    monitor.moveTo(550, 576);
    monitor.lineTo(730, 576);
    monitor.strokePath();

    this.addLabel(640, 215, 'NARRADOR: ACTIVO', 20, '#111111');
    this.addLabel(640, 330, 'PERMISOS INSUFICIENTES', 15, '#555555');
    this.addLabel(640, 375, 'RECORRIDO: 0/13', 13, '#888888');
    this.showHint('Todavía no hay nada que cerrar. Volvé cuando tengas algo que recordar.');

    this.scene.time.delayedCall(2600, () => this.returnToStart());
  }

  private addLabel(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string,
    originX = 0.5,
  ): void {
    this.addRoomObject(this.scene.add.text(x, y, text, {
      color,
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: `${fontSize}px`,
    }).setOrigin(originX, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));
  }
}
