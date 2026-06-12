export const esPasswordSegura = (password) => {
    // Si la contraseña es 'undefined', nos plantamos y devolvemos false
    if (password === undefined) {
        return false;
    }
    // Si ha pasado, significa que sí hay texto. Ya podemos medir sin peligro.
    return password.length >= 6;
};