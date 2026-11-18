import type { TranslationKey } from '../i18n/i18n';

export type NarrationPhase = 'normal' | 'return' | 'replay' | 'second-return';
type RoomNarration = Partial<Record<number, readonly TranslationKey[]>>;

/** Narrative copy by run phase, kept separate from puzzle rules for easier translation. */
export const ROOM_NARRATION: Record<NarrationPhase, RoomNarration> = {
  normal: {
    14: ['copy.llegaste-al-final-felicitaciones-ahora-podemos-quedarn'],
  },
  return: {
    13: ['copy.todo-salio-bien-el-barco-esta-a-salvo-perfecto-volvamo'],
    12: ['copy.otra-vez-esta-tecla-si-ya-la-soltaste-lo-registre-ahor'],
    11: ['copy.otra-vez-para-atras-el-boton-ya-hizo-su-parte-volvamos'],
    10: ['copy.no-no-sigas-retrocediendo-segui-hacia-adelante-es-la-d'],
    9: ['copy.otra-vez-shift-tab-no-hace-falta-segui-hacia-adelante'],
    8: ['copy.shift-tab-otra-vez-ya-vi-que-sabes-apretarlo-ahora-dej'],
    7: ['copy.shift-tab-shift-tab-es-lo-unico-que-sabes-hacer-porque'],
    6: ['copy.shift-tab-shift-tab-es-lo-unico-que-sabes-hacer-basta'],
    5: ['copy.shift-tab-deja-de-volver-te-lo-estoy-diciendo-en-serio'],
    4: ['copy.no-me-estas-escuchando-deja-de-retroceder-ahora'],
    3: ['copy.que-queres-encontrar-no-hay-nada-no-hay-nada-volve'],
    2: ['copy.para-no-sigas-por-favor-segui-hacia-adelante'],
    1: ['copy.no-no-no-llegaste-al-principio-ya-esta-no-hay-nada-ant'],
  },
  replay: {
    0: ['copy.ah-volviste-esta-vez-mira-bien-las-opciones-no-es-que'],
    1: [
      'copy.primera-sala-otra-vez-apreta-shift-al-menos-esa-parte',
      'copy.bien-avanzaste-una-sala-menos-para-repetir-quedan-trec',
    ],
    2: [
      'copy.dos-shifts-de-nuevo-ya-sabes-que-no-alcanza-con-apreta',
      'copy.el-otro-shift-si-el-otro-esta-vez-vas-mas-rapido-casi',
    ],
    3: [
      'copy.un-shift-dibujado-la-ultima-vez-tambien-era-un-dibujo',
      'copy.bien-apretaste-shift-de-nuevo-espero-que-no-me-haya-co',
    ],
    4: [
      'copy.la-contrasena-sigue-siendo-shift-escrita-con-shift-cap',
      'copy.exacto-mantener-shift-mientras-escribis-ya-conocias-el',
    ],
    5: [
      'copy.la-cerradura-muestra-134-ya-sabes-que-con-shift-las-te',
      'copy.abrio-no-hace-falta-que-parezcas-sorprendido-ya-habias',
    ],
    6: [
      'copy.hay-que-esperar-no-toques-nada-si-otra-vez-a-ver-si-es',
      'copy.lo-lograste-esperaste-record-personal-supongo',
    ],
    7: [
      'copy.selecciona-todos-los-cuadrados-usando-shift-para-conse',
      'copy.todos-seleccionados-excelente-la-memoria-muscular-sobr',
    ],
    8: [
      'copy.esta-sala-vuelve-a-pedir-shift-tab-curioso-que-una-com',
      'copy.volviste-por-lo-menos-esta-vez-sabias-que-combinacion',
    ],
    9: [
      'copy.alterna-entre-shift-izquierdo-y-derecho-si-los-dos-la',
      'copy.los-dos-shifts-alternados-una-vez-mas-exactamente-como',
    ],
    10: [
      'copy.movete-con-las-flechas-y-usa-shift-con-las-flechas-par',
      'copy.la-casa-esta-ahi-ya-sabes-como-llegar-seria-raro-que-e',
    ],
    11: [
      'copy.es-un-boton-dibujado-se-activa-con-el-mouse-no-con-shi',
      'copy.un-clic-eso-era-todo-no-te-preocupes-no-voy-a-fingir-q',
    ],
    12: [
      'copy.la-sala-necesita-que-entres-con-shift-apretado-y-despu',
      'copy.lo-soltaste-bien-ahora-intenta-no-reiniciar-el-recorri',
    ],
    13: [
      'copy.sos-tres-puntos-tres-rayas-tres-puntos-podes-mantener',
      'copy.la-senal-llego-que-bueno-que-al-menos-una-cosa-de-esta',
    ],
    14: [
      'copy.de-nuevo-en-el-final-la-opcion-secreta-sigue-estando-e',
      'copy.sigue-sin-pasar-nada-no-hace-falta-probar-shift-otra-v',
    ],
  },
  'second-return': {
    0: [
      'copy.ah-otra-vez-aca-todo-el-recorrido-de-nuevo-y-todavia-n',
      'copy.y-si-todo-es-con-shift-aca-hasta-para-encontrar-esta-o-2',
    ],
    13: ['copy.otra-vez-el-barco-ya-lo-salvaste-despues-de-resolver-l'],
    12: ['copy.otra-vez-soltando-shift-despues-de-todo-ese-recorrido'],
    11: ['copy.otra-vez-el-clic-que-dedicacion-para-repetirlo-todo-y'],
    10: ['copy.ya-conoces-este-camino-lo-recorriste-entero-hace-un-mo'],
    9: ['copy.los-dos-shifts-otra-vez-todo-otra-vez-la-opcion-secret'],
    8: ['copy.otra-vez-shift-tab-al-menos-esta-combinacion-si-la-enc'],
    7: ['copy.los-cuadrados-de-nuevo-despues-de-repetir-catorce-sala'],
    6: ['copy.esperaste-siete-segundos-para-volver-a-recorrer-todo-n'],
    5: ['copy.la-cerradura-otra-vez-si-seguis-el-ciclo-vas-a-volver'],
    4: ['copy.escribi-shift-de-nuevo-ojala-la-opcion-secreta-fuera-i'],
    3: ['copy.el-dibujo-otra-vez-todo-el-recorrido-otra-vez-y-la-sal'],
    2: ['copy.la-puerta-se-abre-vos-volves-y-yo-no-tengo-que-hacer-n'],
    1: ['copy.y-de-nuevo-al-comienzo-repetiste-todo-el-juego-para-vo'],
  },
};

export function getRoomNarration(
  phase: NarrationPhase,
  roomNumber: number,
  lineIndex = 0,
): TranslationKey | undefined {
  const lines = ROOM_NARRATION[phase][roomNumber];
  if (!lines?.length) return undefined;
  return lines[Math.min(lineIndex, lines.length - 1)];
}
