const { createBook, getAllBooks, getBookById, updateBookById, deleteBookById } = require("./controllers/BookController")

const routes = [
    {
        method: 'GET',
        path: '/books',
        handler: getAllBooks
    },
    {
        method: 'GET',
        path: '/books/{bookId}',
        handler: getBookById
    },
    {
        method: 'POST',
        path: '/books',
        handler: createBook
    },
    {
        method: 'PUT',
        path: '/books/{bookId}',
        handler: updateBookById
    },
    {
        method: 'DELETE',
        path: '/books/{bookId}',
        handler: deleteBookById
    },
]

module.exports = routes