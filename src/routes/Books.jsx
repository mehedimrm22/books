import { useEffect, useState } from "react";
//import axios from "axios";
import useAxios from "../services/useAxios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActions,
  CardMedia,
  Button,
  CircularProgress,
  Stack,
  Rating,
  Chip,
  Typography,
  TextField,
} from "@mui/material";

// it fetches and shows the list of the books
// useAxios implemented
function Books() {
  const { data: books, loading, get } = useAxios("http://localhost:3000");
  const [search, setSearch] = useState("");
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    get("books");
  }, []);

  useEffect(() => {
    if (books) {
      const results = books.filter(
        (book) =>
          book.name.toLowerCase().includes(search.toLowerCase()) ||
          book.author.toLowerCase().includes(search.toLowerCase()) ||
          book.genres.some((genre) =>
            genre.toLowerCase().includes(search.toLowerCase())
          )
      );
      setFilteredBooks(results);
    }
  }, [books, search]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // TODO: Replace axios with useAxios hook
  /* async function getBooks() {
    try {
      const response = await axios.get("http://localhost:3000/books");
      setBooks(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  } */

  // TODO: Implement search functionality
  return (
    <Box sx={{ mx: "auto", p: 2 }}>
      {/* Search Input Added here */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={handleSearchChange}
          sx={{ width: 300 }}
        />
      </Box>
      {loading && <CircularProgress />}
      {!loading && books && (
        <div>
          <Stack
            sx={{ justifyContent: "space-around" }}
            spacing={{ xs: 1 }}
            direction="row"
            useFlexGap
            flexWrap="wrap"
          >
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <Card
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "15%",
                    minWidth: 200,
                  }}
                  key={book.name}
                >
                  <CardMedia
                    sx={{ height: 250 }}
                    image={book.img}
                    title={book.name}
                  />
                  <Box sx={{ pt: 2, pl: 2 }}>
                    {book.genres.map((genre, i) => (
                      <Chip
                        key={i}
                        label={genre}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                    <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
                      {book.name}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                      {book.author}
                    </Typography>
                  </Box>
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      mt: "auto",
                      pl: 2,
                    }}
                  >
                    <Rating
                      name="read-only"
                      value={book.stars}
                      readOnly
                      size="small"
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        navigate(`/book/${book.id}`); // Navigate to the detailed page
                      }}
                    >
                      Learn More
                    </Button>
                  </CardActions>
                </Card>
              ))
            ) : (
              <Typography variant="h6" sx={{ textAlign: "center" }}>
                No books found.
              </Typography>
            )}
          </Stack>
        </div>
      )}
    </Box>
  );
}

export default Books;
