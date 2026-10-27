// ============================================================
//  DATOS COMPARTIDOS — TrikiVals
//  Los subs son los mismos para todas las series.
//  Cada serie solo cambia su aspecto y sus textos.
//  Todo se guarda en el navegador de OBS (compartido entre
//  la Fuente de navegador y el Dock del panel).
// ============================================================

const TV = (() => {
  const K_CONFIG = 'tv_config_v1';
  const K_TOKEN = 'tv_token';
  const K_CLIENT = 'tv_client_id';
  const SCOPE = 'channel:read:subscriptions';
  const MESES = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

  // ---- Series por defecto (luego se editan desde el panel) ----
  const SERIES_INICIALES = {
    survival: {
      nombre: 'Survival',
      titulo: 'SURVIVAL TÉCNICO DECORATIVO',
      horas: '+6812 HORAS',
      comandos: ['!porra', '!web'],
      gracias1: 'Mil gracias',
      gracias2: 'por estar por aquí',
      despedida: 'LA AVENTURA CONTINÚA EN EL PRÓXIMO DIRECTO',
      subtitulo: 'Crónicas de',
      cita: 'Cada piedra de este mundo\ntambién lleva vuestro nombre.',
      fondo: 'img/faro.jpg',
      acento: '#e8c56b',
      efecto: 'barrera',
      tema: 'epica'
    },
    hardcore: {
      nombre: 'Hardcore',
      titulo: 'HARDCORE T5',
      horas: 'TEMPORADA 5',
      comandos: ['!porra', '!web'],
      gracias1: 'Mil gracias',
      gracias2: 'por sobrevivir conmigo',
      despedida: 'SI SEGUIMOS VIVOS, NOS VEMOS EN EL PRÓXIMO',
      subtitulo: 'Supervivientes de',
      cita: 'Una sola vida.\nY la habéis compartido aquí.',
      fondo: 'img/hardcore-t5.jpg',
      video: 'video/hardcore-t5.webm',
      acento: '#ffc04d',
      efecto: 'brasas',
      tema: 'hc5',
      estilo: 'hc5',
      patroTitulo: 'PATROCINADORES DE LA SERIE',
      patrocinadores: [
        { nombre: 'Patrocinador 1', detalle: 'Cuenta de Minecraft · se gana con la !porra' },
        { nombre: 'Patrocinador 2', detalle: 'Cuenta de Minecraft · sorteo en directo al morir' }
      ]
    },
    wow: {
      nombre: 'World of Warcraft',
      titulo: 'WORLD OF WARCRAFT',
      horas: 'NIVEL 1',
      comandos: ['!guild', '!web'],
      gracias1: 'Mil gracias',
      gracias2: 'por acompañarme en Azeroth',
      despedida: 'NOS VEMOS EN LA PRÓXIMA AVENTURA',
      subtitulo: 'Héroes de',
      cita: 'Por la Horda, por la Alianza\ny por vosotros.',
      fondo: 'img/jardin.jpg',
      acento: '#8fe0cf',
      efecto: 'ninguno',
      tema: 'warcraft'
    }
  };

  // Temas de tipografía: cada serie elige uno
  const TEMAS = {
    epica:     { nombre: 'Épica (Survival)',        titulo: "'Cinzel', serif",               texto: "'Cormorant Garamond', Georgia, serif", google: 'Cinzel:wght@500;700;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,600', mayus: true,  espaciado: 6 },
    hardcore:  { nombre: 'Hardcore (cruda)',        titulo: "'Bebas Neue', Impact, sans-serif", texto: "'Barlow Condensed', 'Arial Narrow', sans-serif", google: 'Bebas+Neue&family=Barlow+Condensed:ital,wght@0,500;0,600;1,500', mayus: true, espaciado: 4 },
    warcraft:  { nombre: 'Fantasía clásica (WoW)',  titulo: "'Cinzel Decorative', serif",   texto: "'Spectral', Georgia, serif", google: 'Cinzel+Decorative:wght@700;900&family=Spectral:ital,wght@0,500;0,600;1,500', mayus: false, espaciado: 2 },
    gotica:    { nombre: 'Gótica oscura',           titulo: "'UnifrakturMaguntia', serif",  texto: "'EB Garamond', Georgia, serif", google: 'UnifrakturMaguntia&family=EB+Garamond:ital,wght@0,500;0,600;1,500', mayus: false, espaciado: 1 },
    moderna:   { nombre: 'Moderna limpia',          titulo: "'Montserrat', sans-serif",     texto: "'Inter', system-ui, sans-serif", google: 'Montserrat:wght@600;800;900&family=Inter:ital,wght@0,500;0,600;1,500', mayus: true, espaciado: 5 },
    hc5:       { nombre: 'Hardcore T5 (Oswald + Cinzel)', titulo: "'Cinzel', serif", texto: "'Oswald', Impact, sans-serif", google: 'Oswald:wght@500;700&family=Cinzel:wght@700;900', mayus: true, espaciado: 7 },
    pirata:    { nombre: 'Aventura / pirata',       titulo: "'Pirata One', serif",          texto: "'Crimson Text', Georgia, serif", google: 'Pirata+One&family=Crimson+Text:ital,wght@0,600;1,600', mayus: false, espaciado: 2 }
  };

  const FONDOS = ['img/faro.jpg','img/hardcore-t5.jpg','img/cueva.jpg','img/abismo.jpg','img/bosque.jpg','img/jardin.jpg','img/puerto.jpg','img/zepelines.jpg','img/ciudad-selva.jpg'];

  const leerJSON = (k, def) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? def; } catch { return def; } };
  const guardarJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { console.error(e); } };

  function config() {
    const c = leerJSON(K_CONFIG, null);
    if (c && c.series) return c;
    const nueva = { activa: 'survival', series: JSON.parse(JSON.stringify(SERIES_INICIALES)) };
    guardarJSON(K_CONFIG, nueva);
    return nueva;
  }
  const guardarConfig = (c) => guardarJSON(K_CONFIG, c);

  const claveMes = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const nombreMes = (mes) => MESES[+mes.split('-')[1] - 1];
  const kSubs = (mes) => `tv_subs_${mes}`;

  // subs del mes: { clave: { nombre, regaloDe, oculto, manual } }
  const subs = (mes = claveMes()) => leerJSON(kSubs(mes), {});
  const guardarSubs = (mes, s) => guardarJSON(kSubs(mes), s);

  function listaVisible(mes = claveMes()) {
    const s = subs(mes);
    const vis = Object.values(s).filter((e) => !e.oculto).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    return { lista: vis, total: vis.length, regaladas: vis.filter((e) => e.regaloDe).length };
  }

  // ---- Twitch ----
  const token = () => localStorage.getItem(K_TOKEN);
  const clientId = () => localStorage.getItem(K_CLIENT) || '';

  async function api(path) {
    const r = await fetch('https://api.twitch.tv/helix/' + path, { headers: { Authorization: 'Bearer ' + token(), 'Client-Id': clientId() } });
    if (r.status === 401) { localStorage.removeItem(K_TOKEN); throw new Error('Sesión de Twitch caducada: vuelve a conectar desde el panel'); }
    if (!r.ok) throw new Error('Twitch respondió ' + r.status);
    return r.json();
  }

  // Lee los subs activos y los SUMA a los del mes (nunca borra a nadie del mes)
  async function sincronizar() {
    if (!token() || !clientId()) return { ok: false, motivo: 'sin-conexion' };
    const yo = (await api('users')).data[0];
    const mes = claveMes();
    const s = subs(mes);
    let cursor = '';
    do {
      const j = await api(`subscriptions?broadcaster_id=${yo.id}&first=100${cursor ? '&after=' + cursor : ''}`);
      for (const x of j.data) {
        if (x.user_id === yo.id) continue;
        const k = x.user_login.toLowerCase();
        if (!s[k]) s[k] = { nombre: x.user_name };
        if (x.is_gift && x.gifter_name && !s[k].regaloDe) s[k].regaloDe = x.gifter_name;
        if (x.is_gift && x.gifter_login) {
          const g = x.gifter_login.toLowerCase();
          if (!s[g]) s[g] = { nombre: x.gifter_name };
        }
      }
      cursor = j.pagination && j.pagination.cursor;
    } while (cursor);
    guardarSubs(mes, s);
    localStorage.setItem('tv_ultima_sync', new Date().toISOString());
    return { ok: true, total: Object.keys(s).length, canal: yo.display_name };
  }

  function urlLogin(redirect) {
    return `https://id.twitch.tv/oauth2/authorize?client_id=${encodeURIComponent(clientId())}&redirect_uri=${encodeURIComponent(redirect)}&response_type=token&scope=${encodeURIComponent(SCOPE)}`;
  }
  function recogerTokenDeURL() {
    if (!location.hash.includes('access_token')) return false;
    localStorage.setItem(K_TOKEN, new URLSearchParams(location.hash.slice(1)).get('access_token'));
    history.replaceState(null, '', location.pathname + location.search);
    return true;
  }

  // Datos de ejemplo para probar el diseño (?demo=1)
  function demo() {
    const n = ['Xabierino','Errulo_','Eprismar','Sr_Ash147','Otakus321','Formentstrend','Seb_Pixel','Biopx','Hanstalee','David_Vargas','Titania_Dragonic','Deextern','Lescarmax','Progonysz','Remux_12','Bermie','Aitorlaiana','Jordinc2000','Fur30','Joba_LG','Xhenryhynotx','Lord_Barba','Elbrandito','Bad_Carlos','Danielcraftz','Dragonrider98','Tzimolti','Enikos','Barto_085','Fransiasmas','Alfajes','Gorydx','Romanellas','Nurseberlan'];
    const r = { 3: 'Errulo_', 8: 'Errulo_', 11: 'Jordinc2000', 20: 'Errulo_', 25: 'Lord_Barba' };
    const lista = n.map((x, i) => ({ nombre: x, regaloDe: r[i] })).sort((a, b) => a.nombre.localeCompare(b.nombre, 'es', { sensitivity: 'base' }));
    return { lista, total: lista.length, regaladas: lista.filter((e) => e.regaloDe).length };
  }

  return { config, guardarConfig, claveMes, nombreMes, subs, guardarSubs, listaVisible, sincronizar, urlLogin, recogerTokenDeURL, token, clientId, K_CLIENT, K_TOKEN, FONDOS, TEMAS, SERIES_INICIALES, demo };
})();
