# Pantalla de despedida — TrikiVals

Un mismo sistema para todas tus series (Survival, Hardcore, WoW…).
Los **colaboradores son los mismos en todas**. Cada serie cambia solo su título, sello de horas, comandos, textos, fondo y color.

## Archivos
- `index.html` → la pantalla de despedida (lo que sale en directo)
- `panel.html` → tu panel para editar todo
- `datos.js` → el sistema compartido (no hace falta tocarlo)
- `img/` → fondos y logo. Para añadir un fondo, mete la imagen aquí y escribe su ruta en el panel (`img/mi-fondo.jpg`)

## 1. Subirlo a internet (gratis, una vez)
1. Crea una cuenta en GitHub y un repositorio nuevo (por ejemplo `despedida`).
2. Sube todos los archivos tal cual (con la carpeta `img`).
3. En el repositorio: Settings → Pages → Branch `main` → Save.
4. Tendrás una dirección tipo `https://TUUSUARIO.github.io/despedida/`.

## 2. Conectar Twitch (una vez)
1. Entra en https://dev.twitch.tv/console → Registrar aplicación.
2. URL de redirección: `https://TUUSUARIO.github.io/despedida/panel.html`
3. Copia el Client ID.

## 3. En OBS
1. **Panel como dock**: Docks → Docks de navegador personalizados → URL `https://TUUSUARIO.github.io/despedida/panel.html`
   Pega el Client ID y pulsa *Conectar con Twitch*.
2. **Escena de despedida**: Fuente de navegador con la URL que te da el panel para cada serie:
   - Horizontal 1920×1080: `index.html?serie=survival`
   - Vertical TikTok 1080×1920: `index.html?serie=survival&formato=vertical`
3. Pon tu cámara encima del marco (en OBS el hueco es transparente).

El panel y la despedida comparten los datos dentro de OBS: lo que cambias en el panel se ve al instante.

## Opciones de la URL
- `&anterior=1` → muestra el mes pasado
- `&mes=2026-09` → un mes concreto
- `&velocidad=20` → velocidad del desplazamiento de nombres (por defecto 28)
- `&animacion=0` → sin animación
- `&demo=1` → nombres de ejemplo para probar el diseño
- `&obs=0` → muestra el marco de cámara relleno (para previsualizar en el navegador)

## Cómo funcionan los subs
- Cada vez que se abre la despedida (y cada 10 min) lee tus subs activos de Twitch y los **suma** a los del mes. Nadie se borra durante el mes.
- Los subs regalados salen con "regalo de …", y quien regaló también aparece.
- Si no caben todos, la lista sube despacio en bucle infinito.
- Desde el panel puedes añadir nombres a mano u ocultar a alguien.
- Haz una *copia de seguridad* desde el panel de vez en cuando: los datos viven en OBS.
