// Routes for companies

const express = require("express");
const slugify = require("slugify");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

router.get('/', async(req, res, next) => {
    try{
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows })
    }catch(e){
        next(e)
    }
});

router.get('/:code', async(req, res, next) => {
    try{
        const {code} = req.params;
        const results = await db.query(`SELECT * FROM companies WHERE code = $1`, [code]);

        if(results.rows.length === 0){
            throw new ExpressError(`Can't find company with code: ${code}`, 404)
        }
        return res.json({ company: results.rows[0]})
    }catch(e){
        next(e)
    }
});

router.post('/', async(req, res, next) => {
    try{
        let {name, description} = req.body;
        let code = slugify(name, {lower: true});
    
        const result = await db.query(
              `INSERT INTO companies (code, name, description) 
               VALUES ($1, $2, $3) 
               RETURNING code, name, description`,
            [code, name, description]);
    
        return res.status(201).json({"company": result.rows[0]});
    } catch(e) {
        next(e)
    }
});

router.put('/:code', async(req, res, next) => {
    try{
        const {code} = req.params;
        const { name, description } = req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);

        if(results.rows.length === 0){
            throw new ExpressError(`Can't find company with code: ${code}`,404)
        }

        return res.json({company: results.rows[0]})
    }catch(e){
        next(e)
    }
});

router.delete('/:code', async(req, res, next) => {
    try{
        const {code} = req.params;
        const results = await db.query('DELETE FROM companies WHERE code = $1', [code]);
        if(results.rows.length === 0){
            throw new ExpressError(`Can't find company with code: ${code}`,404)
        }
        return res.send({msg: "DELETED!"})
    } catch(e){
        next(e)
    }
})

module.exports = router;