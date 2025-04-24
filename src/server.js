import express from 'express';
import path, {dirname} from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';


const app = express();
const port = process.env.PORT | 5003;



//GET the file path from the URL of the current module
const __filename = fileURLToPath(import.meta.url);

//GET the directory name for the file path
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
//Serves the HTML file from the /public directory tells express to server all files from the public folder
// as static assests/file any requests for the css files will be resolved to the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Serving up the HTML file from the public directory
app.get('/', (req, res)=>{
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
    console.log('Afrivas')
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware,todoRoutes);

app.listen(port, ()=>{
    console.log(`Server running on PORT ${port}`)
});