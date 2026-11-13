import pool  from "../data/db.js";
import { Router } from "express";

const router = Router()

//feladat megoldáshoz AI segítségét kértem
router.get('/', async (req, res) => {
    const { honnan, hova } = req.query;

    if (!honnan || !hova) {
        return res.status(400).json({
            error: 'Hiányzó repülőtérkód'
        });
    }

    if (honnan.toUpperCase() === hova.toUpperCase()) {
        return res.status(400).json({
            error: 'Az indulási és érkezés nem lehet azonos'
        });
    }
    const sql = `
    SELECT j.jaratszam, j.indulas, j.idotartam, j.ar
    FROM jaratok j
    JOIN repuloterek h ON j.honnan_id = h.id
    JOIN repuloterek c ON j.hova_id = c.id
    WHERE h.kod = ? AND c.kod = ?
    ORDER BY j.ar ASC
`;
const [kozvetlen] = await pool.query(sql, [
    honnan.toUpperCase(),
    hova.toUpperCase()
    ]);
})

export default router