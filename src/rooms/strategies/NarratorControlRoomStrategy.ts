import type Phaser from 'phaser';
import RoomStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomStrategy';
import { createControlMonitor } from '../ControlMonitor';
import { getLanguage, translate } from '../../i18n/i18n';

const OPTIONS = [
  'REVISAR ÍNDICE DE SALAS',
  'VOLVER A LA PUERTA',
  'CERRAR SESIÓN DEL OPERADOR',
];

const ROOM_INDEX = [
  '01 Inicio             08 Shift+Tab',
  '02 Dos Shifts         09 Alternancia',
  '03 Dibujo             10 Mapa',
  '04 Contraseña         11 Clic',
  '05 Cerradura          12 Soltar',
  '06 Espera             13 Morse',
  '07 Selección          14 Final',
].join('\n');

const ROOM_INDEX_EN = [
  '01 Start              08 Shift+Tab',
  '02 Two Shifts          09 Alternation',
  '03 Drawing             10 Map',
  '04 Password            11 Click',
  '05 Lock                12 Release',
  '06 Wait                13 Morse',
  '07 Selection           14 Ending',
].join('\n');

export default class NarratorControlRoomStrategy extends RoomStrategy {
  readonly prompt = '';

  private focusIndex = 0;
  private exitOptionRevealed = false;
  private restartConfirmationPending = false;
  private finishConfirmationPending = false;
  private roomIndexOpen = false;
  private optionLabels: Phaser.GameObjects.Text[] = [];
  private panelLabel?: Phaser.GameObjects.Text;
  private indexList?: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, progress: RoomProgress, actions: RoomActions) {
    super(scene, progress, actions);
  }

  protected override onEnter(): void {
    this.focusIndex = 0;
    this.exitOptionRevealed = false;
    this.restartConfirmationPending = false;
    this.finishConfirmationPending = false;
    this.roomIndexOpen = false;
    this.optionLabels = [];

    if (this.progress.backdoorAttempt) {
      this.showLockedBackdoor();
      return;
    }

    this.drawMonitor();

    this.addLabel(640, 205, 'OPERADOR: ACTIVO', 28, '#f5f5f5');
    this.panelLabel = this.addLabel(250, 285, 'PANEL DE CONTROL', 20, '#b8b8b8', 0);
    this.indexList = this.addRoomObject(this.scene.add.text(
      280,
      410,
      getLanguage() === 'en' ? ROOM_INDEX_EN : ROOM_INDEX,
      {
      color: '#d0d0d0',
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: '16px',
      lineSpacing: 10,
      },
    ).setOrigin(0, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)).setVisible(false));

    OPTIONS.forEach((option, index) => {
      const label = this.addRoomObject(this.scene.add.text(280, 375 + index * 54, '', {
        color: '#f5f5f5',
        fontFamily: 'IBM Plex Mono, Menlo, monospace',
        fontSize: '22px',
      }).setOrigin(0, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));

      this.optionLabels.push(label);
    });

    this.updateOptions();
    this.showHint(this.progress.enteredControlRoomEarly
      ? 'Otra vez vos. La primera vez todavía no había empezado el recorrido.'
      : '¿Ves? Todo sigue bajo control. Incluso vos.');
  }

  protected onShiftDown(_side: ShiftSide): void {
    if (this.progress.backdoorAttempt) return;
    this.showHint('Sí, sabemos que ese es el Shift. ¿Pensás hacer algo con él?');
  }

  protected override onShiftTab(): void {
    if (this.progress.backdoorAttempt) return;
    this.showHint('Shift+Tab no hace falta acá. Las flechas alcanzan.');
  }

  protected override onKeyDown(event: KeyboardEvent): void {
    if (this.progress.backdoorAttempt) {
      if (event.code === 'Escape') this.returnToStart();
      return;
    }

    if (this.finishConfirmationPending) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (event.repeat) return;
        this.finishConfirmationPending = false;
        this.finishGame('OPERADOR: DESCONECTADO');
      } else if (event.code === 'Escape') {
        this.finishConfirmationPending = false;
        this.showHint('Está bien. La sesión sigue abierta.');
      }
      return;
    }

    if (this.restartConfirmationPending) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (event.repeat) return;
        this.restartConfirmationPending = false;
        this.scene.registry.set('narrator-restart-tease-pending', true);
        this.scene.registry.set('narrator-replay-active', true);
        this.returnToStart();
      } else if (event.code === 'Escape') {
        this.restartConfirmationPending = false;
        this.showHint('Bien. Por un momento pensé que ibas a tomar una decisión sensata.');
      }
      return;
    }

    if (this.roomIndexOpen && event.code === 'Escape') {
      this.roomIndexOpen = false;
      this.updateOptions();
      this.showHint('Índice cerrado. El recorrido sigue exactamente igual.');
      return;
    }

    if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
      if (event.repeat) return;
      event.preventDefault();

      if (event.shiftKey && event.code === 'ArrowDown' && this.focusIndex === 1) {
        this.exitOptionRevealed = true;
        this.focusIndex = 2;
        this.roomIndexOpen = false;
        this.updateOptions();
        this.showHint('...Y sí, todo es con Shift acá. Hasta para encontrar esta opción. No sé por qué me sorprende.');
        return;
      }

      const optionCount = this.exitOptionRevealed ? OPTIONS.length : 2;
      const direction = event.code === 'ArrowDown' ? 1 : -1;
      this.focusIndex = (this.focusIndex + direction + optionCount) % optionCount;
      this.roomIndexOpen = false;
      this.updateOptions();
      this.showHint('El panel responde. No veo por qué seguir insistiendo.');
      return;
    }

    if (event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
    if (event.repeat) return;

    if (this.focusIndex === 2) {
      this.finishConfirmationPending = true;
      this.showHint('No hace falta cerrar la sesión. Podés volver a la puerta.\nPero ya decidiste, ¿no?\n\nENTER confirma. ESC cancela.');
      return;
    }

    if (this.focusIndex === 0) {
      this.roomIndexOpen = !this.roomIndexOpen;
      this.updateOptions();
      this.showHint(this.roomIndexOpen
        ? 'Índice completo. Enter o Esc para cerrar.'
        : 'Índice cerrado. El recorrido sigue exactamente igual.');
      return;
    }

    this.restartConfirmationPending = true;
    this.showHint('¿Estás seguro? Se borrará todo el progreso y vas a empezar desde el principio.\nENTER para confirmar. ESC para cancelar.');
  }

  private updateOptions(): void {
    this.optionLabels.forEach((label, index) => {
      const isHiddenCloseOption = index === 2 && !this.exitOptionRevealed;
      const option = OPTIONS[index] ? translate(OPTIONS[index]) : '';
      label.setText(isHiddenCloseOption ? '' : `${index === this.focusIndex ? '›' : ' '}  ${option}`);
      label.setColor(index === this.focusIndex ? '#ffffff' : '#a0a0a0');
      label.setVisible(!this.roomIndexOpen);
    });
    this.panelLabel?.setText(translate(this.roomIndexOpen ? 'ÍNDICE DE SALAS' : 'PANEL DE CONTROL'));
    this.indexList?.setVisible(this.roomIndexOpen);
  }

  private showLockedBackdoor(): void {
    this.drawMonitor();

    const visits = this.progress.unauthorizedControlRoomVisits ?? 1;
    this.addLabel(640, 205, 'OPERADOR: ACTIVO', 28, '#f5f5f5');
    this.addLabel(640, 340, 'PERMISOS INSUFICIENTES', 20, '#d0d0d0');

    if (visits === 3) {
      this.showHint('No tenés permisos para estar acá. Aunque… S.O.S. no es el único código Morse que sirve en este lugar. ESC para salir.');
      return;
    }
    if (visits === 4) {
      this.showHint('Seguís insistiendo. A ver si esta te sirve: ¿qué otra palabra de tres letras puede ayudarte a GANAR este juego? ESC para salir.');
      return;
    }

    if (visits === 2) {
      this.showHint('Ya te dije que no tenés permisos. No vuelvas a intentarlo. En serio: no quiero volver a verte acá. ESC para salir.');
      return;
    }

    this.showHint('No tenés permisos para estar acá. Espero que no vuelvas a molestarme otra vez. ESC para salir.');
  }

  private drawMonitor(): void {
    this.addRoomObject(createControlMonitor(this.scene));
  }

  private addLabel(
    x: number,
    y: number,
    text: string,
    fontSize: number,
    color: string,
    originX = 0.5,
  ): Phaser.GameObjects.Text {
    return this.addRoomObject(this.scene.add.text(x, y, translate(text), {
      color,
      fontFamily: 'IBM Plex Mono, Menlo, monospace',
      fontSize: `${fontSize}px`,
    }).setOrigin(originX, 0.5).setResolution(Math.min(window.devicePixelRatio || 1, 2)));
  }
}
