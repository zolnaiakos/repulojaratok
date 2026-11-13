import pool from '../data/db.js'
import { Router } from 'express';

const router = Router()

router.get('/', async (req, res) => {

    const { honnan, hova, legitarsasag } = req.query;

    if ((honnan && honnan.length !== 3) ||
        (hova && hova.length !== 3)) {
        return res.status(400).json({
            error: 'Érvénytelen'
        });
    }


    let sql = `
        SELECT *
        FROM jaratok j
        JOIN repuloterek h ON j.honnan_id = h.id
        JOIN repuloterek c ON j.hova_id = c.id
        JOIN legitarsasagok l ON j.legitarsasag_id = l.id
`

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

    if (legitarsasag) {
    feltetelek.push('LOWER(l.kod) = LOWER(?)');
    parameterek.push(legitarsasag);
    }

    if (feltetelek.length > 0) {
        sql += ' WHERE ' + feltetelek.join(' AND ');
    }

    sql += ' ORDER BY j.indulas ASC';

    const [eredmeny] = await pool.query(sql, parameterek);

    res.json(eredmeny);

});

router.get('/:jaratszam', async(req,res)=>{
    const {jaratszam} = req.params

    const [eredmeny] = await pool.query(
        `
        SELECT *
        FROM jaratok j
        JOIN repuloterek h ON j.honnan_id = h.id
        JOIN repuloterek c ON j.hova_id = c.id
        WHERE j.jaratszam = ?
`, [jaratszam]
    )

     if (eredmeny.length === 0) {
        return res.status(404).json({
            error: 'A járat nem található!'
        });
    }

    res.status(200).json(eredmeny[0]);
})

export default router;
