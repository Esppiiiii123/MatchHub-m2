import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import verifyToken from "./verifyToken.js";

describe("Middleware verifyToken", () => {

  // ----------------------------------------------------------------------
  // CASO 1: No viene el token
  // ----------------------------------------------------------------------
    it("Debería devolver 401 si no se envía el token", () => {
        // 1. Creamos variables normales para guardar lo que pasa
        let codigoRecibido = null;
        let datosRecibidos = null;
        let pasamosAlControlador = false;

        // 2. Construimos los objetos falsos con funciones JS de toda la vida
        const reqFalso = { headers: {} }; // Sin cabecera de token
        
        const resFalso = {
        status: function(codigo) {
            codigoRecibido = codigo; // Guardamos el 401 en nuestra variable
            return this;            // Devolvemos el objeto para poder encadenar el .json()
        },
        json: function(datos) {
            datosRecibidos = datos;  // Guardamos el mensaje de error
        }
        };

        const nextFalso = function() {
        pasamosAlControlador = true; // Si el portero nos deja pasar, esto cambiará a true
        };

        // 3. Ejecutamos la función real
        verifyToken(reqFalso, resFalso, nextFalso);

        // 4. Comprobamos los resultados con variables sencillas
        expect(codigoRecibido).toBe(401);
        expect(datosRecibidos).toEqual({ error: "No hay token o el formato es incorrecto" });
        expect(pasamosAlControlador).toBe(false); // Confirmamos que NO le ha dejado pasar
    });

  // ----------------------------------------------------------------------
  // CASO 2: El token es perfecto
  // ----------------------------------------------------------------------
    it("Debería dejar pasar al usuario si el token es válido", () => {
        let pasamosAlControlador = false;

        const reqFalso = { headers: { authorization: "Bearer token_bueno" } };
        const resFalso = {};
        const nextFalso = function() {
            pasamosAlControlador = true;
        };

        // Usamos el único truco de Vitest necesario: engañar a la máquina de JWT
        // Le decimos: "Cuando te pregunten, di que el token es bueno y devuelve este usuario"
        vi.spyOn(jwt, "verify").mockReturnValue({ id: "usuario_alvaro" });

        verifyToken(reqFalso, resFalso, nextFalso);

        // Comprobamos que el req ahora tiene los datos dentro
        expect(reqFalso.usuario).toEqual({ id: "usuario_alvaro" });
        expect(pasamosAlControlador).toBe(true); // ¡Luz verde!
    });

  // ----------------------------------------------------------------------
  // CASO 3: El token ha caducado
  // ----------------------------------------------------------------------
    it("Debería devolver 401 si el token ha caducado", () => {
        let codigoRecibido = null;
        let datosRecibidos = null;

        const reqFalso = { headers: { authorization: "Bearer token_viejo" } };
        const resFalso = {
            status: function(codigo) { codigoRecibido = codigo; return this; },
            json: function(datos) { datosRecibidos = datos; }
        };
        const nextFalso = function() {};

        // Forzamos a la librería a lanzar un objeto con el nombre del error que busca tu catch
        vi.spyOn(jwt, "verify").mockImplementation(() => {
            throw { name: "TokenExpiredError" };
        });

        verifyToken(reqFalso, resFalso, nextFalso);

        expect(codigoRecibido).toBe(401);
        expect(datosRecibidos).toEqual({ error: "Tu sesión ha caducado, vuelve a iniciar sesión" });
    });

  // ----------------------------------------------------------------------
  // CASO 4: El token es falso o inventado
  // ----------------------------------------------------------------------
    it("Debería devolver 401 si el token es totalmente inválido", () => {
        let codigoRecibido = null;
        let datosRecibidos = null;

        const reqFalso = { headers: { authorization: "Bearer token_inventado" } };
        const resFalso = {
        status: function(codigo) { codigoRecibido = codigo; return this; },
        json: function(datos) { datosRecibidos = datos; }
        };
        const nextFalso = function() {};

        // Lanzamos cualquier otro error para que caiga en el último return del catch
        vi.spyOn(jwt, "verify").mockImplementation(() => {
        throw { name: "JsonWebTokenError" };
        });

        verifyToken(reqFalso, resFalso, nextFalso);

        expect(codigoRecibido).toBe(401);
        expect(datosRecibidos).toEqual({ error: "Token inválido" });
    });

});