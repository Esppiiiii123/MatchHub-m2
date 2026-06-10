
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

    it("Debería devolver false si la contraseña tiene menos de 6 caracteres", () => {
        const resultado = esPasswordSegura("123");
        expect(resultado).toBe(false); // Estructura compacta
    });
});