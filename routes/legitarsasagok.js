import pool from '../data/db.js'
import { Router } from 'express'

const router = Router();


router.get('/', async (req, res) => {

    const sql = `
        SELECT
        l.kod, l.nev, COUNT(j.id) AS jaratDb, COUNT(DISTINCT j.hova_id) AS celallomasDb, MIN(j.ar) AS legolcsobb, ROUND(AVG(j.ar)) AS atlagAr
        FROM legitarsasagok l
        LEFT JOIN jaratok j ON l.id = j.id
        GROUP BY l.id, l.kod, l.nev
        ORDER BY jaratDb DESC, l.nev ASC
    `;

    const [eredmeny] = await pool.query(sql);

    res.json(eredmeny);
});

export default router