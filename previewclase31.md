# Clase Extra · De `require` a `import`: Guía del Refactor de MatchHub

Hoy vamos a realizar un **refactor estructural** completo de nuestra API (**MatchHub**). No añadiremos funciones nuevas; cambiaremos la ingeniería interna de CommonJS (`require`) al estándar oficial de la industria: **ES Modules (`import`/`export`)**.

---

## 🧠 La Teoría en 3 Líneas de Pizarra

1. **CommonJS (`require`):** El sistema clásico y antiguo de Node.js (2009).
2. **ES Modules (`import`):** El estándar oficial de JavaScript (2015). Es el que entiende el navegador, el backend moderno y **el que usarás en React (M3)**.
3. **El objetivo:** Que tu backend y tu futuro frontend hablen exactamente el mismo idioma.

---

## 📊 Tabla de Equivalencias Rápidas

| Sistema Antiguo (CommonJS) | Sistema Moderno (ES Modules) | Cuándo se usa |
| :--- | :--- | :--- |
| `const x = require("x")` | `import x from "x"` | Librerías de `node_modules` (Sin `.js`) |
| `const x = require("./x")` | `import x from "./x.js"` | Archivos locales (**¡OBLIGATORIO `.js`!**) |
| `module.exports = jefe` | `export default jefe` | Exportar **una sola cosa** (Sin llaves `{}` al importar) |
| `module.exports = { a, b }` | `export const a = ...` | Exportar **varias cosas** (Con llaves `{}` al importar) |
| `require("dotenv").config()` | `import "dotenv/config"` | Debe ser siempre la **línea 1** del proyecto |

---

## 🛠️ Ruta de Migración: Archivo por Archivo

Sigue la estrategia **"De la Hoja a la Raíz"** (desde los archivos más aislados hasta el punto de entrada) para evitar que el servidor se rompa de forma irreversible.

### 🔌 Bloque 0: El Interruptor Global (`package.json`)
* **Cambio:** Añade la propiedad `"type": "module"` en la raíz del JSON.
* **Resultado:** A partir de este segundo, `require` queda prohibido y el servidor se apagará hasta terminar la migración.

---

### 📂 Carpeta: `src/config/`

#### 📄 `db.js` (Exportación única)
* **Arriba:** Sustituye `const mongoose = require('mongoose');` por `import mongoose from "mongoose";`.
* **Abajo:** Cambia `module.exports = connectDB;` por `export default connectDB;`.

---

### 📂 Carpeta: `src/validators/`

#### 📄 `auth_validators.js` (Exportaciones múltiples)
* **Arriba:** Cambia `const { body } = require("express-validator");` por `import { body } from "express-validator";`.
* **En las variables:** Clava la palabra **`export`** justo delante de tus arrays: `export const registerRules = [...]` y `export const loginRules = [...]`.
* **Abajo:** Borra por completo el bloque `module.exports = { ... };`.

---

### 📂 Carpeta: `src/middlewares/`

#### 📄 `validate.js` (Exportación única)
* **Arriba:** Cambia `const { validationResult } = require("express-validator");` por `import { validationResult } from "express-validator";`.
* **Abajo:** Sustituye `module.exports = validate;` por `export default validate;`.

---

### 📂 Carpeta: `src/models/`

#### 📄 `user_model.js` (Exportación única)
* **Arriba:** Cambia `const mongoose = require("mongoose");` por `import mongoose from "mongoose";`.
* **Abajo:** Cambia `module.exports = User;` por `export default User;`.

---

### 📂 Carpeta: `src/controllers/`

#### 📄 `auth_controller.js` (Exportaciones múltiples con lógica)
* **Arriba:** * Cambia el `require` de bcrypt por `import bcrypt from "bcryptjs";`.
  * Cambia el `require` del modelo por `import User from "../models/user_model.js";` (**¡Ojo al `.js`!**).
* **En las funciones:** Añade la palabra **`export`** delante de cada función flecha: `export const register = ...` y `export const login = ...`.
* **Abajo:** Elimina el bloque `module.exports = { ... };`.

---

### 📂 Carpeta: `src/routes/`

#### 📄 `auth_routes.js` (El truco del Asterisco)
* **Arriba:** Transforma todos los `require` en `import`. **Todos los archivos locales llevan `.js`**:
  ```javascript
  import express from "express";
  import * as authController from "../controllers/auth_controller.js"; // 👈 Agrupa todo en un objeto
  import { registerRules, loginRules } from "../validators/auth_validators.js";
  import validate from "../middlewares/validate.js";