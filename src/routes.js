const express = require('express');
const router = express.Router();

router.get('/books', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('SELECT * FROM books', (err, rows) => {
            if (err) return res.status(500).send(err);

            res.json(rows);
            
        });
    });
});

router.get('/books/:id', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.status(500).send(err);

        connection.query('SELECT * FROM books WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) return res.status(500).send(err);
            res.json(rows[0]);
        });
    });
});

router.post('/books', (req, res) => {
    const {name, author, isbn} = req.body;
    if (!(name && author && isbn)){
        return res.status(400).send('Completar los campos')
    } else {
        req.getConnection((err, connection) => {
            if (err) return res.status(500).send(err);
            connection.query('INSERT INTO books set ?', [req.body], (err, rows) => {
                if (err) return res.status(500).send(err);

                res.send('El libro ha sido registrado');
            });
        });
    }
    
});

router.put('/books/:id', (req, res) => {
    const {name, author, isbn} = req.body;
    if(!(name && author && isbn)){
        return res.status(400).send('Verifique los campos')
    } else {
        req.getConnection((err, connection) => {
            if (err) return res.send(err);
            connection.query('UPDATE books set ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
                if (err) return res.status(500).send(err);

                res.send('El libro ha sido actualizado');
            });
        });
    }
    
});

router.delete('/books/:id', (req, res) => {
    req.getConnection((err, connection) => {
        if (err) return res.send(err);
        connection.query('DELETE FROM books WHERE id = ?', [req.params.id], (err, rows) => {
            if (err) return res.status(500).send(err);

            res.send('El libro ha sido eliminado');
        });
    });
});

module.exports = router;
