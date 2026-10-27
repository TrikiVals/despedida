/* =====================================================================
   sorteo.js — datos compartidos entre el overlay (index.html) y el panel
   (panel.html). Todo se guarda en el localStorage del navegador de OBS,
   así que no hace falta ningún servidor.
   ===================================================================== */
(function () {
  'use strict';

  var NS = 'sorteo.';

  var FICHA_BASE = {
    id: 'minecraft',
    nombre: 'Cuenta de Minecraft',
    titulo: 'SORTEO',
    subtitulo: 'HARDCORE · TEMPORADA 5',
    selloTexto: 'TEMPORADA',
    selloValor: '5',
    premio: 'Cuenta de Minecraft',
    premioExtra: '',
    imagenPremio: '',
    palabraClave: '!sorteo',
    tiempoRespuesta: 120,
    duracionRuleta: 12,
    revelado: 5,
    fondo: 'video/fondo-sorteo.webm',
    animacion: 'codigo',
    videoAnimacion: '',
    dobleSub: false,
    colores: { azul: '#3da0ff', brasa: '#ff7a1a', brasaClara: '#ffc04d', hueso: '#e9dcc0' }
  };

  var AJUSTES_BASE = {
    canal: 'trikivals',
    excluirStreamer: true,
    excluidos: 'streamelements, nightbot, moobot, streamlabs, fossabot, wizebot'
  };

  var ESTADO_BASE = {
    fase: 'inactivo',        // inactivo | abierto | sorteando | ganador | esperando | confirmado | descartado
    ficha: null,
    participantes: [],       // { id, nombre, peso, t }
    descartados: [],         // ids de ganadores que no respondieron
    ganador: null,           // { id, nombre }
    ruleta: null,            // { inicio, duracion, R, seq }
    tFase: 0,
    finRespuesta: null,
    rev: 0
  };

  function clonar(o) { return JSON.parse(JSON.stringify(o)); }

  function leer(clave, def) {
    try {
      var v = localStorage.getItem(NS + clave);
      return v ? JSON.parse(v) : clonar(def);
    } catch (e) { return clonar(def); }
  }

  function guardar(clave, valor) {
    try { localStorage.setItem(NS + clave, JSON.stringify(valor)); return true; }
    catch (e) { return false; }
  }

  function leerRaw(clave) {
    try { return localStorage.getItem(NS + clave) || ''; } catch (e) { return ''; }
  }

  /* Mezcla una ficha guardada con los valores base (por si se añaden campos nuevos). */
  function completarFicha(f) {
    var base = clonar(FICHA_BASE);
    f = f || {};
    for (var k in f) { if (k !== 'colores') base[k] = f[k]; }
    base.colores = Object.assign({}, FICHA_BASE.colores, f.colores || {});
    return base;
  }

  function leerFichas() {
    var d = leer('fichas', null);
    if (!d || !d.lista || !d.lista.length) {
      d = { activa: FICHA_BASE.id, lista: [clonar(FICHA_BASE)] };
    }
    d.lista = d.lista.map(completarFicha);
    if (!d.lista.some(function (f) { return f.id === d.activa; })) d.activa = d.lista[0].id;
    return d;
  }

  function fichaActiva() {
    var d = leerFichas();
    return d.lista.filter(function (f) { return f.id === d.activa; })[0];
  }

  function leerAjustes() { return Object.assign({}, AJUSTES_BASE, leer('ajustes', {})); }

  function leerEstado() {
    var e = Object.assign(clonar(ESTADO_BASE), leer('estado', {}));
    if (e.ficha) e.ficha = completarFicha(e.ficha);
    return e;
  }

  /* Número aleatorio justo en [0, 1) con el generador criptográfico del navegador. */
  function aleatorio() {
    var a = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(a);
    return a[0] / 4294967296;
  }

  function hexARgb(hex) {
    var m = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hex || '');
    if (!m) return '255,255,255';
    return parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16);
  }

  window.Sorteo = {
    FICHA_BASE: FICHA_BASE,
    AJUSTES_BASE: AJUSTES_BASE,
    clonar: clonar,
    leer: leer,
    guardar: guardar,
    leerRaw: leerRaw,
    completarFicha: completarFicha,
    leerFichas: leerFichas,
    guardarFichas: function (d) { return guardar('fichas', d); },
    fichaActiva: fichaActiva,
    leerAjustes: leerAjustes,
    guardarAjustes: function (a) { return guardar('ajustes', a); },
    leerEstado: leerEstado,
    guardarEstado: function (e) { e.rev = (e.rev || 0) + 1; return guardar('estado', e); },
    aleatorio: aleatorio,
    hexARgb: hexARgb
  };
})();
