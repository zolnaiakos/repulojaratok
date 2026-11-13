import pool from '../data/db.js'
import { Router } from 'express';

const router = Router()

router.get('/', async (req, res) => {

    const { honnan, hova } = req.query;

    if ((honnan && honnan.length !== 3) ||
        (hova && hova.length !== 3)) {
        return res.status(400).json({
            error: 'Érvénytelen'
        });
    }

    let sql = `
        SELECT j.*
        FROM jaratok j
        JOIN repuloterek h ON j.honnan_id = h.id
        JOIN repuloterek c ON j.hova_id = c.id
    `;

    let feltetelek = [];
    let parameterek = [];

    if (honnan) {
        feltetelek.push('LOWER(h.kod) = LOWER(?)');
        parameterek.push(honnan);
    }

    if (hova) {
        feltetelek.push('LOWER(c.kod) = LOWER(?)');
        parameterek.push(hova);
    }

    if (feltetelek.length > 0) {
        sql += ' WHERE ' + feltetelek.join(' AND ');
    }

    sql += ' ORDER BY j.indulas ASC';

    const [eredmeny] = await pool.query(sql, parameterek);

    res.json(eredmeny);

});

export default router;
