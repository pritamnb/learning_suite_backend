import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
// import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import logger from '../config/logger';
// Define types for request files
interface SparkFiles {
    specFile: Express.Multer.File[];
    bodyFile: Express.Multer.File[];
}
// Helper function to create GNAT project file
const createGnatProjectFile = (dirPath: string): void => {
    const projectFilePath = path.join(dirPath, 'project.gpr');
    const projectFileContent = `
  project Project is
     for Source_Dirs use ("${dirPath}");
     for Object_Dir use "${dirPath}/obj";
     for Main use ("main_prog.adb");
  end Project;
    `;
    fs.writeFileSync(projectFilePath, projectFileContent.trim());
};

// Helper function to get available procedures
const getAvailableProcedures = (specFilePath: string): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        exec(`gnatls ${specFilePath}`, (error, stdout, stderr) => {
            if (error) {
                reject(`Error listing procedures: ${stderr}`);
            } else {
                const procedures = stdout.split('\n')
                    .filter(line => line.trim().endsWith('.adb'))
                    .map(line => line.trim().replace('.adb', ''));
                resolve(procedures);
            }
        });
    });
};

export const runSparkAdaCode = async (req: any, res: Response, next: NextFunction) => {

    try {
        const files = req.files as SparkFiles;

        if (!files || !files.specFile || !files.bodyFile) {
            logger.error('Both SPARK Ada specification and body files are required');
            return res.status(400).send({ error: 'Both SPARK Ada specification (.ads) and body (.adb) files are required' });
        }

        const specFile = files.specFile[0];
        const bodyFile = files.bodyFile[0];
        let verificationLevel = parseInt(req.body.verificationLevel, 10);

        if (isNaN(verificationLevel) || verificationLevel < 0 || verificationLevel > 3) {
            verificationLevel = 0; // Default to level 0 if invalid
        }

        const dirPath = path.join(__dirname, 'spark_code');
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const specFilePath = path.join(dirPath, specFile.originalname);
        const bodyFilePath = path.join(dirPath, bodyFile.originalname);

        fs.renameSync(specFile.path, specFilePath);
        fs.renameSync(bodyFile.path, bodyFilePath);

        try {
            // Create GNAT project file
            createGnatProjectFile(dirPath);

            // Check if the .ads file exists and is readable
            if (!fs.existsSync(specFilePath)) {
                logger.error(`Specification file not found: ${specFilePath}`);
                return res.status(400).send({ error: `Specification file not found: ${specFilePath}` });
            }

            // Get available procedures from the specification file
            const procedures = await getAvailableProcedures(specFilePath);
            if (procedures.length === 0) {
                logger.error('No procedures found to execute');
                return res.status(400).send({ error: 'No procedures found to execute' });
            }

            // Create a main procedure file
            const mainProcedurePath = path.join(dirPath, 'main_prog.adb');
            const mainProcedureContent = `
with ${path.basename(specFile.originalname, '.ads')};

procedure Main_Prog is
begin
   ${procedures[0]};  -- Call the first available procedure
end Main_Prog;
    `;

            fs.writeFileSync(mainProcedurePath, mainProcedureContent.trim());
            logger.info(`Main procedure file created at: ${mainProcedurePath}`);

            // Compile the project
            const compileCommand = `gprbuild -P ${path.join(dirPath, 'project.gpr')}`;
            exec(compileCommand, { cwd: dirPath }, (compileError, compileStdout, compileStderr) => {
                if (compileError) {
                    logger.error(`Compile error: ${compileStderr}`);
                    return res.status(500).send({ error: 'Compile error', details: compileStderr });
                }

                // Run the verification command
                const verificationCommand = `gnatprove -P ${path.join(dirPath, 'project.gpr')} --checks-as-errors --level=${verificationLevel} --no-axiom-guard --report=all`;
                exec(verificationCommand, { cwd: dirPath }, (proveError, proveStdout, proveStderr) => {
                    if (proveError) {
                        logger.error(`Verification error: ${proveStderr}`);
                        return res.status(500).send({ error: 'Verification error', details: proveStderr });
                    }

                    res.send({ output: proveStdout });
                    logger.info('Code verified successfully');

                    // Clean up temporary files
                    fs.unlinkSync(specFilePath);
                    fs.unlinkSync(bodyFilePath);
                    fs.unlinkSync(mainProcedurePath);
                    fs.unlinkSync(path.join(dirPath, 'project.gpr'));
                });
            });
        } catch (error) {
            logger.error(`Error during processing: ${error}`);
            res.status(500).send({ error: 'Error during processing', details: error });
        }
    } catch (err) {
        next(err);
    }
};

