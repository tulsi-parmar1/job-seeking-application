import app from "./app.js";
import dotenv from "dotenv";
dotenv.config({path:'HireHub/config/config.env'});

const port = process.env.PORT // Provide a default port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});