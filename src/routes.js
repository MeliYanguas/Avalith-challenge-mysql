const express = require('express');
const router = express.Router();

const mysqlFields = 'id, name, author_id, isbn, id_author, author_name, author_country';

router.get('/books', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);
    // no poner el asterico si no los campos
    connection.query(`SELECT ${mysqlFields} FROM books INNER JOIN authors ON books.author_id = authors.id_author`, (err, rows) => {
      if (err) return res.status(500).send(err);

      const response = rows.map((book) => ({
        id: book.id,
        name: book.name,
        isbn: book.isbn,
        author: {
          id: book.id_author,
          name: book.author_name,
          country: book.author_country,
        },
      }));

      res.json(response);
    });
  });
});

router.get('/books/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    connection.query(`SELECT ${mysqlFields} FROM books INNER JOIN authors ON books.author_id = authors.id_author WHERE id = ?`, [req.params.id], (err, rows) => {
      if (err) return res.status(500).send(err);

      const response = rows.map((book) => ({
        id: book.id,
        name: book.name,
        isbn: book.isbn,
        author: {
          id: book.id_author,
          name: book.author_name,
          country: book.author_country,
        },
      }));

      res.json(response[0]);
    });
  });
});

router.post('/books', (req, res) => {
  const { name, author_id, isbn } = req.body;
  if (!(name && author_id && isbn)) {
    return res.status(400).send('Completar los campos');
  }
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);
    connection.query('INSERT INTO books set ?', [req.body], (err, rows) => {
      if (err) return res.status(400).send(err);

      res.send('El libro ha sido registrado');
    });
  });
});

router.put('/books/:id', (req, res) => {
  const { name, author_id, isbn } = req.body;
  if (!(name && author_id && isbn)) {
    return res.status(400).send('Verifique los campos');
  }
  req.getConnection((err, connection) => {
    if (err) return res.send(err);
    connection.query('UPDATE books set ? WHERE id = ?', [req.body, req.params.id], (err, rows) => {
      if (err) return res.status(500).send(err);

      res.send('El libro ha sido actualizado');
    });
  });
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

// ---endopoints autores
router.get('/authors', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    connection.query('SELECT id_author, author_name, author_country FROM authors', (err, rows) => {
      if (err) return res.status(500).send(err);

      res.json(rows);
    });
  });
});

router.get('/authors/:id', (req, res) => {
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);

    connection.query('SELECT id_author, author_name, author_country FROM authors WHERE id_author = ?', [req.params.id], (err, rows) => {
      if (err) return res.status(500).send(err);
      res.json(rows[0]);
    });
  });
});

router.put('/authors/:id', (req, res) => {
  const { author_name, author_country } = req.body;
  if (!(author_name && author_country)) {
    return res.status(400).send('Verifique los campos');
  }
  req.getConnection((err, connection) => {
    if (err) return res.send(err);
    connection.query('UPDATE authors set ? WHERE id_author = ?', [req.body, req.params.id], (err, rows) => {
      if (err) return res.status(500).send(err);

      res.send('Los datos del autor han sido actualizados');
    });
  });
});

router.post('/authors', (req, res) => {
  const { author_name, author_country } = req.body;
  if (!(author_name && author_country)) {
    return res.status(400).send('Completar los campos');
  }
  req.getConnection((err, connection) => {
    if (err) return res.status(500).send(err);
    connection.query('INSERT INTO authors set ?', [req.body], (err, rows) => {
      if (err) return res.status(500).send(err);

      res.send('Nuevo autor ha sido agregado a la lista');
    });
  });
});

module.exports = router;
