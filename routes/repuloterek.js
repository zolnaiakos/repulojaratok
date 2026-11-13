import pool from '../data/db.js'
import { Router } from 'express'

const router = Router()

router.get('/', async(req,res)=>{
    let sql = `
    SELECT r.kod, r.nev, r.varos, r.orszag,
    (SELECT COUNT(*)
    FROM jaratok j
    WHERE j.honnan_id = r.id) AS indulo,
    (SELECT COUNT(*)
    FROM jaratok j
    WHERE j.hova_id = r.id) AS erkezo
    FROM repuloterek r
    ORDER BY r.kod ASC
`

    const [eredmeny] = await pool.query(sql)

    res.json(eredmeny)
})


router.get('/:kod', async(req,res)=>{
    const {kod} = req.query

     const sql = `
        SELECT * FROM repuloterek WHERE kod = ?
`

    const [eredmeny] = await pool.query(sql, [kod]);

    if (eredmeny.length === 0) {
        return res.status(404).json({
            error: 'A repülőtér nem található!'
        });
    }

    res.status(200).json(eredmeny[0]);

})


router.get('/:kod/indulasok', async (req, res) => {
    const { kod } = req.params;

    //lekérdezéshez AI segítségét kértem
    const sql = `
        SELECT j.indulas, j.jaratszam, l.nev AS legitarsasag, CONCAT(c.varos, ' (', c.kod, ')') AS celallomas, ADDTIME(j.indulas, SEC_TO_TIME(j.idotartam* 60)) AS erkezes
        FROM jaratok j
        JOIN repuloterek h ON j.honnan_id = h.id
        JOIN repuloterek c ON j.hova_id = c.id
        JOIN legitarsasagok l ON j.legitarsasag_id = l.id
        WHERE h.kod = ?
        ORDER BY j.indulas ASC
    `;

    const [eredmeny] = await pool.query(sql, [kod]);

    res.json(eredmeny);
});

export default router