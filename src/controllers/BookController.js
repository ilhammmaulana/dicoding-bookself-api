const { nanoid } = require('nanoid');
const books = require('../storage/books');

const getBookById = (request, h) => {
    const { bookId } = request.params;
    console.log(books)
    const book = books.find((b) => b.id === bookId);

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
    const { bookId } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
    } = request.payload;

    const bookIndex = books.findIndex((b) => b.id === bookId);

    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }).code(404);
    }

    if (!name || typeof name !== 'string') {
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

    books[bookIndex] = {
        ...books[bookIndex],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt: new Date().toISOString(),
        finished: pageCount === readPage,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const createBook = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading
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

    const id = nanoid(16)
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt,
        finished,
    };

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }).code(201);
    }

    return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    }).code(500);
}


const getAllBooks = (request, h) => {
    let filteredBooks = [...books];

    // Filter by name (case insensitive)
    const { name } = request.query;
    if (name) {
        const lowerCaseName = name.toLowerCase();
        filteredBooks = filteredBooks.filter(book =>
            book.name.toLowerCase().includes(lowerCaseName)
        );
    }

    // Filter by reading status (0 or 1)
    const { reading } = request.query;
    if (reading !== undefined) {
        const isReading = parseInt(reading, 10) === 1;
        filteredBooks = filteredBooks.filter(book =>
            book.reading === isReading
        );
    }

    // Filter by finished status (0 or 1)
    const { finished } = request.query;
    if (finished !== undefined) {
        const isFinished = parseInt(finished, 10) === 1;
        filteredBooks = filteredBooks.filter(book =>
            book.finished === isFinished
        );
    }

    return h.response({
        status: 'success',
        data: {
            books: filteredBooks,
        },
    }).code(200);
};

const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    // Find the index of the book with the given id
    const bookIndex = books.findIndex((b) => b.id === bookId);

    // If book with id not found, return 404
    if (bookIndex === -1) {
        return h.response({
            status: 'fail',
            message: 'Buku gagal dihapus. Id tidak ditemukan',
        }).code(404);
    }

    // Remove the book from the array
    books.splice(bookIndex, 1);

    return h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
    }).code(200);
};


module.exports = { createBook, getBookById, getAllBooks, updateBookById, deleteBookById }