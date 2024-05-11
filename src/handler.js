const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  if (!name) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    }).code(400);
  }

  if (readPage > pageCount) {
    return h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    }).code(400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return h.response({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: {
      bookId: id,
    },
  }).code(201);
};

const getAllBooks = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name !== undefined) {
    const nameLowerCase = name.toLowerCase();
    filteredBooks = filteredBooks.filter((book) =>
      book.name.toLowerCase().includes(nameLowerCase)
    );
  }

  if (reading !== undefined) {
    const isReading = reading === '1';
    filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
  }

  if (finished !== undefined) {
    const isFinished = finished === '1';
    filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
  }

  const responseBooks = filteredBooks.map(({ id, name, publisher }) => ({
    id,
    name,
    publisher,
  }));

  return h.response({
    status: 'success',
    data: {
      books: responseBooks,
    },
  }).code(200);
};
  
  const getBookById = (request, h) => {
    const { id } = request.params;
    const book = books.find((b) => b.id === id);
  
    if (book) {
      return h.response({
        status: 'success',
        data: {
          book,
        },
      }).code(200);
    }
  
    return h.response({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    }).code(404);
  };
  
  const updateBookById = (request, h) => {
    const { id } = request.params;
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
  
    if (!name) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      }).code(400);
    }
  
    if (readPage > pageCount) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      }).code(400);
    }
  
    const index = books.findIndex((book) => book.id === id);
  
    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      }).code(404);
    }
  
    const updatedAt = new Date().toISOString();
    const finished = readPage === pageCount;
  
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };
  
    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  };
  
  const deleteBookById = (request, h) => {
    const { id } = request.params;
  
    const index = books.findIndex((book) => book.id === id);
  
    if (index === -1) {
      return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      }).code(404);
    }
  
    books.splice(index, 1);
  
    return h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
  };
  
  module.exports = {
    getAllBooks,
    getBookById,
    addBook,
    updateBookById,
    deleteBookById,
  };