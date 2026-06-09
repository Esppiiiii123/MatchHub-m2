

# Extra · De `require` a `import`: migrar tu proyecto a ES Modules

Si has mirado las clases nuevas (la de express-validator, la de bcrypt, la de JWT) habrás notado algo raro: el código ya no empieza con `const express = require("express")`, sino con `import express from "express"`. Y los archivos ya no terminan en `module.exports = ...`, sino en `export`.

No es un capricho ni un error de las clases. Son **dos formas distintas de escribir lo mismo** en Node, y a partir de ahora vamos a usar la moderna. Tu proyecto, montado desde el día 20, usa la antigua (`require`). Las clases nuevas usan la nueva (`import`). Hoy las reconciliamos: vas a pasar **todo tu proyecto** de un estilo al otro. Cuando termines, hará exactamente lo mismo que ahora —es un refactor, como el de MVC— pero hablará el mismo idioma que el resto del bootcamp y que React en M3.

---

## Teoría

### Dos sistemas de módulos

En JavaScript, "un módulo" es un archivo que exporta cosas para que otros archivos las usen. El problema es que en el mundo de Node conviven **dos sistemas** para hacer eso:

- **CommonJS (CJS)** — el original de Node. Usa `require(...)` para importar y `module.exports` para exportar. Es lo que has usado todo este tiempo.
- **ES Modules (ESM)** — el estándar **oficial del lenguaje** JavaScript. Usa `import` y `export`. Es lo que ya usabas en el navegador en M1, y lo que vas a usar todo el día en React (M3).

Fíjate en lo importante: `import`/`export` **no es de Node**, es de JavaScript a secas. El comité que define el lenguaje lo estandarizó en 2015 (lo verás escrito como "ES6" o "ES2015"). El navegador lo entiende, los bundlers lo entienden, React lo usa. CommonJS, en cambio, fue un invento de Node de cuando el lenguaje todavía no tenía módulos propios. Funciona perfectamente y no va a desaparecer, pero el sitio hacia el que va todo es ESM.

Por eso migramos: no porque `require` esté "roto", sino porque **`import` es el estándar** y queremos que tu backend hable el mismo idioma que tu frontend.

### La tabla de equivalencias

Casi toda la migración es mecánica. Es traducir, línea por línea, según esta tabla:

| CommonJS (lo que tienes)                       | ES Modules (a lo que vas)                       |
| ---------------------------------------------- | ----------------------------------------------- |
| `const express = require("express")`           | `import express from "express"`                 |
| `const { Router } = require("express")`        | `import { Router } from "express"`              |
| `const Notas = require("../models/notas.model")` | `import * as Notas from "../models/notas.model.js"` |
| `module.exports = router`                      | `export default router`                         |
| `module.exports = conectarBD`                  | `export default conectarBD`                     |
| `module.exports = { crear, borrar }`           | `export { crear, borrar }`                      |
| `function crear() {}` + export al final        | `export function crear() {}` (inline)           |
| `require("dotenv").config()`                   | `import "dotenv/config"`                        |

Hay tres ideas detrás de esta tabla. Vamos con ellas.

#### 1. `export default` vs exportaciones con nombre

Un módulo puede exportar de dos maneras:

- **Por defecto (`default`)**: exporta **una sola cosa**, la principal del archivo. Tu `db.js` exporta una sola función (`conectarBD`); tu `app.js` exporta una sola cosa (`app`); tu router exporta el `router`. Todos esos son `export default`.

  ```js
  // exportar
  export default app;

  // importar (el nombre lo eliges tú al importar, no lleva llaves)
  import app from "./src/app.js";
  ```

- **Con nombre (`named`)**: exporta **varias cosas**, cada una con su nombre. Tu modelo exporta `obtenerTodas`, `crear`, `borrar`… eso son exportaciones con nombre.

  ```js
  // exportar
  export function crear(datos) { ... }
  export function borrar(id) { ... }

  // importar (con llaves, y el nombre tiene que coincidir)
  import { crear, borrar } from "./models/notas.model.js";
  ```

Regla rápida: si tu `module.exports = unaCosaSola`, es `export default`. Si tu `module.exports = { variasCosas }`, son exportaciones con nombre.

#### 2. `import * as` = "todo el módulo como un objeto"

Mira cómo usabas el modelo en tu controlador:

```js
const Notas = require("../models/notas.model");
// ...
await Notas.obtenerTodas();
await Notas.crear(datos);
```

`Notas` es un objeto con todas las funciones dentro. Para conseguir exactamente eso con ESM, cuando el módulo exporta **con nombre**, usas `import * as`:

```js
import * as Notas from "../models/notas.model.js";
// ...
await Notas.obtenerTodas();   // ← idéntico a antes
await Notas.crear(datos);
```

`import * as Notas` significa "mete todas las exportaciones con nombre en un objeto llamado `Notas`". Es el equivalente exacto de tu viejo `const Notas = require(...)`. Por eso, usando esto, **el cuerpo de tus controladores y rutas no cambia ni una línea**: solo cambia la línea del import de arriba.

#### 3. La extensión `.js` ahora es **obligatoria**

Este es el detalle que más despista. Con `require` podías escribir:

```js
const app = require("./src/app");          // sin .js, funcionaba
```

Con `import`, en tus propios archivos, **tienes que poner la extensión**:

```js
import app from "./src/app.js";            // CON .js, obligatorio
```

¿Por qué? Porque ESM sigue el estándar del navegador, y en el navegador la ruta de un import es una URL exacta: no hay nadie "adivinando" si te referías a `app.js`, `app.json` o una carpeta `app/`. Tú lo dices, tú pones el `.js`.

> ⚠️ Ojo: esto **solo aplica a tus archivos** (los que empiezan por `./` o `../`). Los paquetes de `node_modules` (`express`, `mongoose`, `cors`, `jsonwebtoken`…) se importan **sin** extensión y sin ruta, igual que siempre: `import express from "express"`.

### El interruptor: `"type": "module"`

Por defecto, Node trata tus `.js` como CommonJS. Para decirle "este proyecto usa ES Modules", hay que tocar **una línea del `package.json`**:

```json
{
  "type": "module"
}
```

Ese es el interruptor. Cuando lo pones, **todo el proyecto pasa a ESM de golpe**: a partir de ahí, `require` deja de funcionar y `import` empieza a funcionar. Por eso esta migración no es incremental como otras: es de todo o nada. Pones el interruptor y migras todos los archivos en la misma sesión.

### Dos trampas que te vas a encontrar

Antes de ir a la práctica, dos cosas que en ESM se hacen distinto:

**1. `__dirname` no existe en ESM.** Si en algún archivo usabas `__dirname` (por ejemplo en la versión de fichero del modelo, antes de migrar a Mongo), en ESM esa variable no existe y peta. La forma de recuperarla es un poco fea, pero se copia y se olvida:

```js
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

Si ya migraste tu modelo a Mongoose (clase 26), probablemente **ya no uses `__dirname`** en ningún sitio y no tengas que preocuparte. Pero si te aparece el error `__dirname is not defined`, ahora sabes por qué y cómo arreglarlo.

**2. `dotenv` se carga distinto.** Tu `require("dotenv").config()` se traduce de la forma más limpia así:

```js
import "dotenv/config";
```

Eso carga las variables de entorno con solo importarlo. Y hay un matiz de **orden**: en ESM, todos los `import` de un archivo se ejecutan antes que cualquier otra cosa. Para asegurarte de que las variables de entorno están cargadas antes de que se evalúe ningún otro módulo, pon `import "dotenv/config"` **como la primera línea** de tu `index.js`.

---

## Práctica

Trabaja sobre tu proyecto M2. Vamos a migrar archivo por archivo. Como es todo-o-nada, lo más cómodo es empezar por las "hojas" (los archivos que no dependen de nadie) e ir subiendo hasta `index.js`. Hazlo todo seguido y prueba al final.

> 💡 Antes de empezar: asegúrate de tener el proyecto funcionando y commiteado. Así, si algo se tuerce, tienes un punto al que volver con `git restore .`.

### Bloque 0 — El interruptor

Abre tu `package.json` y añade la línea `"type": "module"`. Suele ir junto a `name`, `version`, `main`:

```json
{
  "name": "mi-proyecto-m2",
  "version": "1.0.0",
  "main": "index.js",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  }
}
```

En cuanto guardes, si arrancas el servidor (`npm run dev`) **va a petar** con un error tipo `require is not defined in ES module scope`. Es lo esperado: acabas de decirle a Node que todo es ESM, pero tus archivos todavía usan `require`. Vamos a arreglarlos.

### Bloque 1 — El modelo (`src/models/notas.model.js`)

Tu modelo de Mongoose empieza importando mongoose y termina con un `module.exports = { ... }`. Tradúcelo:

```js
// ANTES
const mongoose = require("mongoose");

// ...esquema, modelo y funciones igual que ahora...

module.exports = {
  obtenerTodas,
  obtenerPorId,
  crear,
  actualizar,
  borrar,
};
```

```js
// AHORA
import mongoose from "mongoose";

// ...esquema y modelo igual que ahora...

// Opción A (recomendada): export inline, delante de cada función
export async function obtenerTodas() {
  return await Nota.find();
}

export async function obtenerPorId(id) {
  return await Nota.findById(id);
}

export async function crear(datos) {
  const nueva = new Nota(datos);
  return await nueva.save();
}

export async function actualizar(id, datos) {
  return await Nota.findByIdAndUpdate(id, datos, {
    new: true,
    runValidators: true,
  });
}

export async function borrar(id) {
  return await Nota.findByIdAndDelete(id);
}
```

Le has quitado el `module.exports` del final y has puesto `export` delante de cada `function`. El esquema y el modelo (`notaSchema`, `Nota`) se quedan igual, sin `export`, porque son de uso interno del archivo.

> Si prefieres tocar menos, hay una **opción B**: deja las funciones tal cual están y cambia solo la última línea, de `module.exports = { obtenerTodas, ... }` a `export { obtenerTodas, obtenerPorId, crear, actualizar, borrar }`. Las dos opciones son válidas y hacen lo mismo. La opción A (inline) es la que verás en las clases nuevas.

### Bloque 2 — La conexión a la BD (`src/config/db.js`)

Una sola exportación → `export default`:

```js
// ANTES
const mongoose = require("mongoose");

async function conectarBD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

module.exports = conectarBD;
```

```js
// AHORA
import mongoose from "mongoose";

async function conectarBD() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error.message);
    process.exit(1);
  }
}

export default conectarBD;
```

Solo han cambiado la primera y la última línea. El cuerpo, intacto.

### Bloque 3 — El controlador (`src/controllers/notas.controller.js`)

Aquí entra en juego el `import * as`. La línea de arriba cambia y el `module.exports` del final desaparece (porque ponemos `export` delante de cada función):

```js
// ANTES
const Notas = require("../models/notas.model");

async function listarNotas(req, res) { ... }
// ...el resto de handlers...

module.exports = {
  listarNotas,
  obtenerNota,
  crearNota,
  actualizarNota,
  borrarNota,
};
```

```js
// AHORA
import * as Notas from "../models/notas.model.js";

export async function listarNotas(req, res) { ... }
export async function obtenerNota(req, res) { ... }
export async function crearNota(req, res) { ... }
export async function actualizarNota(req, res) { ... }
export async function borrarNota(req, res) { ... }
```

Fíjate en dos cosas:

- `import * as Notas from "../models/notas.model.js"` (¡con el `.js`!) te deja el objeto `Notas` igual que antes. Las llamadas dentro de los handlers —`await Notas.crear(...)`, `await Notas.obtenerTodas()`— **no cambian**.
- Le pones `export` delante de cada `async function` y borras el bloque `module.exports` del final.

### Bloque 4 — Las rutas (`src/routes/notas.routes.js`)

```js
// ANTES
const express = require("express");
const router = express.Router();
const controlador = require("../controllers/notas.controller");

router.get("/", controlador.listarNotas);
router.get("/:id", controlador.obtenerNota);
router.post("/", controlador.crearNota);
router.put("/:id", controlador.actualizarNota);
router.delete("/:id", controlador.borrarNota);

module.exports = router;
```

```js
// AHORA
import express from "express";
import * as controlador from "../controllers/notas.controller.js";

const router = express.Router();

router.get("/", controlador.listarNotas);
router.get("/:id", controlador.obtenerNota);
router.post("/", controlador.crearNota);
router.put("/:id", controlador.actualizarNota);
router.delete("/:id", controlador.borrarNota);

export default router;
```

Otra vez el patrón: imports arriba (con `.js` en el del controlador), `export default router` abajo, y el medio sin tocar.

### Bloque 5 — La app (`src/app.js`)

```js
// ANTES
const express = require("express");
const cors = require("cors");
const notasRoutes = require("./routes/notas.routes");

const app = express();
// ...middlewares y montaje de rutas...

module.exports = app;
```

```js
// AHORA
import express from "express";
import cors from "cors";
import notasRoutes from "./routes/notas.routes.js";

const app = express();
// ...middlewares y montaje de rutas, igual...

export default app;
```

`express` y `cors` vienen de `node_modules` → sin `.js`. `notasRoutes` es tuyo → con `.js`.

### Bloque 6 — El punto de entrada (`index.js`)

El último. Aquí va el truco del `dotenv` como primera línea:

```js
// ANTES
require("dotenv").config();
const app = require("./src/app");
const conectarBD = require("./src/config/db");

const PUERTO = process.env.PUERTO || 3000;

async function arrancar() {
  await conectarBD();
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
}

arrancar();
```

```js
// AHORA
import "dotenv/config";
import app from "./src/app.js";
import conectarBD from "./src/config/db.js";

const PUERTO = process.env.PUERTO || 3000;

async function arrancar() {
  await conectarBD();
  app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
  });
}

arrancar();
```

`import "dotenv/config"` **primera línea**, para que las variables de entorno estén cargadas antes que nada.

### Bloque 7 — Probar que todo sigue igual

Arranca el servidor:

```bash
npm run dev
```

Deberías ver, igual que siempre:

```
✅ Conectado a MongoDB
Servidor escuchando en http://localhost:3000
```

Ahora prueba las **cinco operaciones del CRUD** con Postman / tu `.http`, como hiciste en la clase de MVC y en la de Mongo:

```http
GET    http://localhost:3000/api/notas
GET    http://localhost:3000/api/notas/:id
POST   http://localhost:3000/api/notas
PUT    http://localhost:3000/api/notas/:id
DELETE http://localhost:3000/api/notas/:id
```

Si todas responden **exactamente igual que antes**, la migración está bien. Acuérdate de la regla de oro del refactor: el comportamiento no cambia, solo la forma de escribir el código.

> 💾 **Commit:** `refactor: migrar de CommonJS (require) a ES Modules (import)`

---

## Errores típicos y cómo leerlos

Es muy normal que algo pete en el primer intento. Estos son los errores que vas a ver y qué significan:

| Error en consola                                              | Qué pasó                                                                 |
| ------------------------------------------------------------ | ------------------------------------------------------------------------ |
| `require is not defined in ES module scope`                  | Ya pusiste `"type": "module"` pero queda algún `require` sin traducir.   |
| `Cannot use import statement outside a module`               | Al revés: usas `import` pero **falta** `"type": "module"` en el `package.json`. |
| `Cannot find module '.../src/app' imported from ...`         | Te falta la extensión `.js` en un import tuyo. Pon `./src/app.js`.       |
| `__dirname is not defined`                                   | Usas `__dirname` en ESM. Recupéralo con el truco de `fileURLToPath` (ver Teoría). |
| `The requested module ... does not provide an export named 'X'` | El nombre que importas con `{ X }` no coincide con cómo lo exportaste, o usaste `{ }` cuando era `export default` (o al revés). |

La mayoría se arreglan releyendo la tabla de equivalencias. El de la extensión `.js` es, con diferencia, el más frecuente: si algo "no encuentra un módulo" y es un archivo tuyo, casi seguro te falta el `.js`.

---

## Cierre

Has pasado tu proyecto entero de CommonJS a ES Modules. No le has añadido ni una funcionalidad: hace lo mismo que antes. Pero ahora tu backend escribe los módulos igual que el navegador, igual que las clases nuevas del bootcamp e igual que React en M3. A partir de aquí, todo el código que escribas y todo el que leas va a usar `import`/`export`.

### Lo que tienes que llevarte grabado

- En Node conviven **dos sistemas de módulos**: CommonJS (`require`/`module.exports`, el viejo) y ES Modules (`import`/`export`, el estándar del lenguaje). Vamos con ESM.
- El interruptor es **`"type": "module"`** en el `package.json`. Lo pones y el proyecto entero pasa a ESM de golpe.
- **Una sola cosa exportada** → `export default` (se importa sin llaves). **Varias cosas** → exportaciones con nombre (se importan con llaves).
- **`import * as X from "..."`** es el equivalente exacto del viejo `const X = require("...")` cuando el módulo exporta con nombre. Gracias a esto, el cuerpo de tus controladores y rutas no cambia.
- En tus propios imports (`./`, `../`) la **extensión `.js` es obligatoria**. En los paquetes de `node_modules`, no.
- `require("dotenv").config()` → `import "dotenv/config"` como **primera línea** del `index.js`.
- `__dirname` no existe en ESM; se recupera con `fileURLToPath(import.meta.url)`.

---

## 🚀 Reto opcional

1. **Top-level await.** Una de las ventajas que te regala ESM es que puedes usar `await` directamente en el nivel superior de un módulo, sin envolverlo en una función `async`. Reescribe el arranque de tu `index.js` aprovechándolo:

   ```js
   import "dotenv/config";
   import app from "./src/app.js";
   import conectarBD from "./src/config/db.js";

   const PUERTO = process.env.PUERTO || 3000;

   await conectarBD();        // ← await "a pelo", sin función arrancar()
   app.listen(PUERTO, () => {
     console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
   });
   ```

   Compruébalo: arranca el servidor y verifica que conecta y escucha igual. ¿Por qué esto era imposible con CommonJS?

2. **El `.mjs` alternativo.** Investiga: en vez de poner `"type": "module"`, podrías haber renombrado tus archivos de `.js` a `.mjs` y Node los trataría como ESM sin tocar el `package.json`. ¿En qué situación tendría sentido usar `.mjs` (o su gemelo `.cjs`) en lugar del interruptor global? Pista: piensa en un proyecto donde conviven archivos de los dos estilos.
