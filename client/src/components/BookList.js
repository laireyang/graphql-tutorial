import {
  gql,
  useQuery
} from "@apollo/client";

const getBooksQuery = gql`
{
  books {
    name
    id
  }
}
`

function displayBooks(data) {
  return data.books.map(book => {
    return (
      <li key={book.id}>{book.name}</li>
    )
  })
};

function BookList() {
  const { loading, error, data } = useQuery(getBooksQuery);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data);
  return (
    <div>
      <ul id="book-list">
        {displayBooks(data)}
      </ul>
    </div>
  );
}

export default BookList;
