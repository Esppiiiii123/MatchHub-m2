import Field from "../models/field_model.js";

export const createField = async (req, res) => {
    try {
        const { name, location, pricePerHour, description } = req.body;

        const newField = new Field({
            name,
            location,
            pricePerHour,
            description,
            club: req.usuario.id // El ID viene del token del club logueado
        });

        const savedField = await newField.save();
        return res.status(201).json(savedField);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al registrar la pista deportiva" });
    }
};

export const getFields = async (req, res) => {
    try {
        const { location } = req.query;
        // Filtro opcional por localización (por si buscan "Málaga")
        const filter = location ? { location: new RegExp(location, "i") } : {};

        const fields = await Field.find(filter).populate("club", "username email");
        return res.status(200).json(fields);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al obtener las pistas" });
    }
};