import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger';
const SPARK_FILE_PATH = './spark_code/temp_spark_code.adb';
const SPARK_EXEC_PATH = './spark_code';

export const runAdaCode = async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;
    if (!code) {
        logger.error('SPARK Ada code is required');
        return res.status(400).send({ error: 'SPARK Ada code is required' });
    }

    const dirPath = path.join(__dirname, 'spark_code');
    const filePath = path.join(dirPath, 'temp_spark_code.adb');


    try {

        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write the code to a file
        fs.writeFileSync(filePath, code);

        // Compile the SPARK Ada code
        exec(`gnatmake ${filePath}`, { cwd: dirPath }, (compileError, compileStdout, compileStderr) => {
            if (compileError) {
                return res.status(500).send({ error: 'Compilation error', details: compileStderr });
            }

            // Run the compiled program
            exec(path.join(dirPath, 'temp_spark_code.exe'), (runError, runStdout, runStderr) => {
                if (runError) {
                    logger.error(`Execution error: ${runStderr}`);
                    return res.status(500).send({ error: 'Execution error', details: runStderr });
                }

                // Return the output of the program
                res.send({ output: runStdout });
                logger.info('Program executed successfully');
                // Clean up temporary files
                fs.unlinkSync(filePath);
                fs.unlinkSync(path.join(dirPath, 'temp_spark_code.exe'));
                fs.unlinkSync(path.join(dirPath, 'temp_spark_code.o'));
                fs.unlinkSync(path.join(dirPath, 'temp_spark_code.ali'));
            });
        });
    } catch (err) {
        next(err);
    }
};
