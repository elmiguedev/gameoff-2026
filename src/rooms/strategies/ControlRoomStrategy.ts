import type Phaser from 'phaser';
import RoomBaseStrategy, { type RoomActions, type RoomProgress, type ShiftSide } from './RoomBaseStrategy';
import ControlMonitorEntity from '../../entities/ControlMonitorEntity';
import TypographyEntity from '../../entities/TypographyEntity';
import { t, type TranslationKey } from '../../i18n/i18n';

const OPTIONS = [
  'copy.revisar-indice-de-salas',
  'copy.volver-a-la-puerta',
  'copy.cerrar-sesion-del-operador',
] as const satisfies readonly TranslationKey[];

export default class ControlRoomStrategy extends RoomBaseStrategy {
  readonly prompt = '';

  private focusIndex = 0;
  private exitOptionRevealed = false;
  private restartConfirmationPending = false;
  private finishConfirmationPending = false;
  private roomIndexOpen = false;
  private optionLabels: TypographyEntity[] = [];
  private panelLabel?: TypographyEntity;
  private indexList?: TypographyEntity;
  private monitor?: ControlMonitorEntity;

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

    this.addLabel(640, 205, 'copy.operador-activo', 'control-label');
    this.panelLabel = this.addLabel(250, 285, 'copy.panel-de-control', 'control-heading', 0);
    this.indexList = this.addRoomObject(
      new TypographyEntity(this.scene, 280, 410, 'control.room-index', 'control-index')
        .setOrigin(0, 0.5)
        .setVisible(false),
    );

    OPTIONS.forEach((option, index) => {
      const label = this.addRoomObject(
        new TypographyEntity(this.scene, 280, 375 + index * 54, '', 'control-option')
          .setOrigin(0, 0.5),
      );

      this.optionLabels.push(label);
    });

    this.updateOptions();
    this.showHint(this.progress.enteredControlRoomEarly
      ? 'copy.otra-vez-vos-la-primera-vez-todavia-no-habia-empezado'
      : 'copy.ves-todo-sigue-bajo-control-incluso-vos');
  }

  override prepareForEnding(): void {
    this.setRoomObjectsVisible(this.monitor ? [this.monitor] : []);
  }

  protected onShiftDown(_side: ShiftSide): void {
    if (this.progress.backdoorAttempt) return;
    this.showHint('copy.si-sabemos-que-ese-es-el-shift-pensas-hacer-algo-con-e');
  }

  protected override onShiftTab(): void {
    if (this.progress.backdoorAttempt) return;
    this.showHint('copy.shift-tab-no-hace-falta-aca-las-flechas-alcanzan');
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
        this.finishGame('copy.operador-desconectado');
      } else if (event.code === 'Escape') {
        this.finishConfirmationPending = false;
        this.showHint('copy.esta-bien-la-sesion-sigue-abierta');
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
        this.showHint('copy.bien-por-un-momento-pense-que-ibas-a-tomar-una-decisio');
      }
      return;
    }

    if (this.roomIndexOpen && event.code === 'Escape') {
      this.roomIndexOpen = false;
      this.updateOptions();
      this.showHint('copy.indice-cerrado-el-recorrido-sigue-exactamente-igual');
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
        this.showHint('copy.y-si-todo-es-con-shift-aca-hasta-para-encontrar-esta-o');
        return;
      }

      const optionCount = this.exitOptionRevealed ? OPTIONS.length : 2;
      const direction = event.code === 'ArrowDown' ? 1 : -1;
      this.focusIndex = (this.focusIndex + direction + optionCount) % optionCount;
      this.roomIndexOpen = false;
      this.updateOptions();
      this.showHint('copy.el-panel-responde-no-veo-por-que-seguir-insistiendo');
      return;
    }

    if (event.code !== 'Enter' && event.code !== 'NumpadEnter') return;
    if (event.repeat) return;

    if (this.focusIndex === 2) {
      this.finishConfirmationPending = true;
      this.showHint('copy.no-hace-falta-cerrar-la-sesion-podes-volver-a-la-puert');
      return;
    }

    if (this.focusIndex === 0) {
      this.roomIndexOpen = !this.roomIndexOpen;
      this.updateOptions();
      this.showHint(this.roomIndexOpen
        ? 'copy.indice-completo-enter-o-esc-para-cerrar'
        : 'copy.indice-cerrado-el-recorrido-sigue-exactamente-igual');
      return;
    }

    this.restartConfirmationPending = true;
    this.showHint('copy.estas-seguro-se-borrara-todo-el-progreso-y-vas-a-empez');
  }

  private updateOptions(): void {
    this.optionLabels.forEach((label, index) => {
      const isHiddenCloseOption = index === 2 && !this.exitOptionRevealed;
      const option = OPTIONS[index] ? t(OPTIONS[index]) : '';
      label.setText(isHiddenCloseOption ? '' : `${index === this.focusIndex ? '›' : ' '}  ${option}`);
      label.setColor(index === this.focusIndex ? '#ffffff' : '#a0a0a0');
      label.setVisible(!this.roomIndexOpen);
    });
    this.panelLabel?.setText(t(this.roomIndexOpen ? 'copy.indice-de-salas' : 'copy.panel-de-control'));
    this.indexList?.setVisible(this.roomIndexOpen);
  }

  private showLockedBackdoor(): void {
    this.drawMonitor();

    const visits = this.progress.unauthorizedControlRoomVisits ?? 1;
    this.addLabel(640, 205, 'copy.operador-activo', 'control-label');
    this.addLabel(640, 340, 'copy.permisos-insuficientes', 'control-heading');

    if (visits >= 5) {
      this.showHint('copy.bueno-morse-de-win-para-que-no-haya-dudas');
      return;
    }
    if (visits === 3) {
      this.showHint('copy.no-tenes-permisos-para-estar-aca-aunque-s-o-s-no-es-el');
      return;
    }
    if (visits === 4) {
      this.showHint('copy.seguis-insistiendo-a-ver-si-esta-te-sirve-que-otra-pal');
      return;
    }

    if (visits === 2) {
      this.showHint('copy.ya-te-dije-que-no-tenes-permisos-no-vuelvas-a-intentar');
      return;
    }

    this.showHint('copy.no-tenes-permisos-para-estar-aca-espero-que-no-vuelvas');
  }

  private drawMonitor(): void {
    this.monitor = this.addRoomObject(new ControlMonitorEntity(this.scene));
  }

  private addLabel(
    x: number,
    y: number,
    text: string,
    variant: 'control-label' | 'control-heading',
    originX = 0.5,
  ): TypographyEntity {
    return this.addRoomObject(
      new TypographyEntity(this.scene, x, y, text, variant).setOrigin(originX, 0.5),
    );
  }
}
