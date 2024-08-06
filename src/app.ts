import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import itemRoutes from './routes/itemRoutes';
import sparkRoutes from './routes/sparkRoutes';
import adaRoutes from './routes/adaRoutes';

import { errorHandler } from './middlewares/errorHandler';
import connectDB from './config/database';
import cors from 'cors';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
const app = express();

// Connect to the database
connectDB();
const allowedOrigins = ['*', 'http://localhost:3000'];

const options: cors.CorsOptions = {
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
app.use(cors(options));

app.use(bodyParser.json());
app.get('/hello', (req, res) => {
    res.json({
        message: "Hello from Spark Ada learning suite!"
    })
})
app.use('/api', itemRoutes);
app.use('/api', adaRoutes);
app.use('/api', sparkRoutes);
const PROJECT_DIR = path.join(__dirname, 'spark_project');

// Ensure the project directory exists
fs.mkdirSync(PROJECT_DIR, { recursive: true });
app.post('/run-spark', (req: Request, res: Response) => {
    const { specCode, bodyCode } = req.body;

    if (!specCode || !bodyCode) {
        return res.status(400).send('Both specCode and bodyCode are required.');
    }

    // File paths
    const specFilePath = path.join(PROJECT_DIR, 'main.ads');
    const bodyFilePath = path.join(PROJECT_DIR, 'main.adb');
    const projectFilePath = path.join(PROJECT_DIR, 'main.gpr');
    const exeFilePath = path.join(PROJECT_DIR, 'main.exe');

    // Write files
    try {
        fs.writeFileSync(specFilePath, specCode);
        fs.writeFileSync(bodyFilePath, bodyCode);
        fs.writeFileSync(projectFilePath, `
  project Main is

   for Source_Dirs use (".");
   for Object_Dir use ".";
   for Exec_Dir use ".";

   package Compiler is
      for Default_Switches ("ada") use ("-gnatwa");
   end Compiler;

end Main;

      `);
    } catch (writeError: any) {
        return res.status(500).send(`Error writing files: ${writeError.message}`);
    }

    // Clean old objects and binaries
    exec(`gnatclean -P ${projectFilePath}`, (cleanError, cleanStdout, cleanStderr) => {
        if (cleanError) {
            console.error(`Error cleaning project: ${cleanStderr}`);
            return res.status(500).send(`Error cleaning project: ${cleanStderr}`);
        }

        // Compile the Ada code
        exec(`gnatmake -P ${projectFilePath}`, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                console.error(`Compilation error: ${compileStderr}`);
                return res.status(500).send(`Compilation error: ${compileStderr}`);
            }

            // Check if the executable was created
            if (!fs.existsSync(exeFilePath)) {
                console.error(`Executable not found: ${exeFilePath}`);
                return res.status(500).send(`Executable not found: ${exeFilePath}`);
            }

            // Execute the compiled binary
            exec(`"${exeFilePath}"`, (execError, execStdout, execStderr) => {
                if (execError) {
                    console.error(`Execution error: ${execError}`);
                    return res.status(500).send(`Execution error: ${execStderr}`);
                }

                res.send(execStdout);
            });
        });
    });
});
// Error handler middleware should be the last middleware
app.use(errorHandler);

export default app;
