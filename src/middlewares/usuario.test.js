import { describe, it, expect } from "vitest";
import { usuarioPublico } from "./usuario.js";

describe("usuarioPublico", () => {
    it("devuelve solo id y email, ignorando la contraseña", () => {
        const mockUser = { id: "1", email: "a@a.com", password: "segreto" };
        expect(usuarioPublico(mockUser)).toEqual({ id: "1", email: "a@a.com" });
    });
});