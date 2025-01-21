import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Rating from "@mui/material/Rating";
import Button from "@mui/material/Button";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Alert from "@mui/material/Alert";
import { DateField } from "@mui/x-date-pickers/DateField";
import useAxios from "../services/useAxios";
import { bookGenres } from "../genres";
import { Stack, Typography, Box } from "@mui/material";

// AddBook function provides a form for the user to add a new book
function AddBook() {
  const { alert, post } = useAxios("http://localhost:3000");
  const [rateValue, setRateValue] = useState(3);
  const defaultImg =
    "https://st2.depositphotos.com/1069290/5358/v/450/depositphotos_53581759-stock-illustration-book-icon-vector-logo.jpg";
  const [book, setBook] = useState({
    author: "",
    name: "",
    genres: [],
    completed: false,
    start: null,
    end: null,
    stars: null,
  });

  // genreChangeHandler handles the changes for the genre selection
  const genreChangeHandler = (event) => {
    const { value } = event.target;
    setBook({
      ...book,
      genres: typeof value === "string" ? value.split(",") : value,
    });
  };

  // rateChangeHandler handles the changes for the rating
  const rateChangeHandler = (event) => {
    const { value } = event.target;
    setBook({
      ...book,
      stars: value,
    });
  };

  // handles the checkbox
  const addBookHandler = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox" && name === "completed") {
      setBook({ ...book, [name]: checked });
    } else {
      setBook({ ...book, [name]: value });
    }
  };

  //adds book data to the server
  const postHandler = async (e) => {
    e.preventDefault();
    const bookWithDefaultImg = {
      ...book,
      img: book.img || defaultImg,
    };
    try {
      await post("books", bookWithDefaultImg);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <form onChange={addBookHandler} onSubmit={postHandler}>
      <Stack
        spacing={1}
        alignItems="stretch"
        sx={{ my: 2, mx: "auto", width: "25%" }}
      >
        {alert.show && (
          <Alert
            severity={alert.type}
            sx={{
              transition: "opacity 0.5s ease",
              animation: "fadeout 5s forwards",
            }}
          >
            {alert.message}
          </Alert>
        )}
        <Typography variant="h4" component="h2" sx={{ my: 10 }}>
          Add a book
        </Typography>
        <TextField
          name="name"
          id="outlined-basic"
          label="Title"
          variant="outlined"
        />
        <TextField
          name="author"
          id="outlined-basic"
          label="Author"
          variant="outlined"
        />
        <TextField
          name="img"
          id="outlined-basic"
          label="Image (url)"
          variant="outlined"
        />
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={book.genres}
          name="genres"
          onChange={genreChangeHandler}
          input={<OutlinedInput label="Genre" />}
        >
          {bookGenres.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>

        <FormControlLabel
          name="completed"
          control={<Checkbox checked={book.completed} />}
          label="Completed"
        />

        <DateField name="start" label="Started" />
        <DateField name="end" label="Finished" disabled={!book.completed} />
        <Stack spacing={1}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Rating
              name="stars"
              value={rateValue}
              onClick={rateChangeHandler}
              size="large"
              onChange={(event, newValue) => {
                setRateValue(newValue);
              }}
            />
          </Box>
        </Stack>
        <Button variant="contained" type="submit">
          Add new
        </Button>
      </Stack>
    </form>
  );
}

export default AddBook;
