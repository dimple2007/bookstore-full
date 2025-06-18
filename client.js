import axios from 'axios';

// TASK 10: Get all books
async function getAllBooks() {
  try {
    const res = await axios.get("http://localhost:3005/books");
    console.log("All Books:", res.data);
  } catch (err) {
    console.error(err);
  }
}

// TASK 11: Get by ISBN
function getByISBN(isbn) {
  axios.get(`http://localhost:3005/books/isbn/${isbn}`)
    .then(res => console.log("Book by ISBN:", res.data))
    .catch(err => console.error(err));
}

// TASK 12: Get by Author
async function getByAuthor(author) {
  try {
    const res = await axios.get(`http://localhost:3005/books/author/${author}`);
    console.log("Books by Author:", res.data);
  } catch (err) {
    console.error(err);
  }
}

// TASK 13: Get by Title
async function getByTitle(title) {
  try {
    const res = await axios.get(`http://localhost:3005/books/title/${title}`);
    console.log("Books by Title:", res.data);
  } catch (err) {
    console.error(err);
  }
}

// RUN all
getAllBooks();
getByISBN("1234");
getByAuthor("F. Scott Fitzgerald");
getByTitle("The Great Gatsby");
