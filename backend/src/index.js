import express from "express"; // Correct import syntax
const app = express();

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
