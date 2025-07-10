const form = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const message = document.getElementById('message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  await fetch('/books', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, author })
  });

  form.reset();
  loadBooks();
  message.textContent = "Book added successfully!";
});

async function loadBooks() {
  const res = await fetch('/books');
  const books = await res.json();
  bookList.innerHTML = '';
  books.forEach(book => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.status}</td>
      <td>
        <button onclick="toggleStatus('${book.title}')">Toggle Status</button>
        <button onclick="deleteBook('${book.title}')">Delete</button>
      </td>
    `;
    bookList.appendChild(row);
  });
}

async function toggleStatus(title) {
  await fetch(`/books/status/${title}`, { method: 'PUT' });
  loadBooks();
}

async function deleteBook(title) {
  await fetch(`/books/${title}`, { method: 'DELETE' });
  loadBooks();
}

loadBooks();
