
import { describe, it, expect } from "vitest";
import { esPasswordSegura } from "./password.js";

describe("Función esPasswordSegura()", () => {
    it("Debería devolver true si la contraseña tiene 6 caracteres o más", () => {
        // 1. Arrange
        const passValido = "123456";
        // 2. Act
        const resultado = esPasswordSegura(passValido);
        // 3. Assert
        expect(resultado).toBe(true);
    });

    it("Debería devolver false si la contraseña tiene 5 caracteres", () => {
        const pasValido = "12345"

        const resultado = esPasswordSegura(pasValido);

        expect(resultado).toBe(false); // Estructura compacta
    });

    it("Debería devolver false si el campo esta vacío", () => {
        const passValido = "";

        const resultado = esPasswordSegura(passValido);

        expect(resultado).toBe(false);
    });

    it("Debería devolver false si es undefined", () => {
        const passValido = undefined;

        const resultado = esPasswordSegura(passValido);

        expect(resultado).toBe(false);

    });

});