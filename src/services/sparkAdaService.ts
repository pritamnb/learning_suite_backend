import { exec } from 'child_process';
import path from 'path';
import { config } from '../config/config';
import logger from '../config/logger';
import { promises as fs } from 'fs';
import escape from 'shell-escape';
export class SparkAdaService {
    private projectFile: string;
    private adaSourceDir: string;

    constructor() {
        this.projectFile = config.adaProjectFile;
        this.adaSourceDir = config.adaSourceDir;
    }
    private async cleanUp(): Promise<void> {
        try {
            // Remove uploaded and generated files
            console.log('this.adaSourceDir : ', this.adaSourceDir)
            await fs.rm(this.adaSourceDir, { recursive: true, force: true });
            await fs.rm(path.resolve(__dirname, '../spark_ada_project/bin'), { recursive: true, force: true });
            await fs.rm(path.resolve(__dirname, '../spark_ada_project/obj'), { recursive: true, force: true });
            logger.info(`Cleaned up ${this.adaSourceDir} directory.`);
            await fs.mkdir(this.adaSourceDir, { recursive: true });
        } catch (error) {
            logger.error(`Error during cleanup: ${error}`);
        }
    }
    // private runCommand(command: string): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         exec(command, (error, stdout, stderr) => {
    //             if (error) {
    //                 logger.error(`Command failed: ${stderr}`);
    //                 reject(stderr);
    //             } else {
    //                 console.log("stdout :", stdout)

    //                 resolve(stdout);
    //             }
    //         });
    //     });
    // }

    private runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            // Escape the command to prevent injection attacks
            const sanitizedCommand = escape(command.split(' '));
            logger.info(`\n Executing command: ${sanitizedCommand}\n`);

            exec(sanitizedCommand, (error, stdout, stderr) => {
                if (error) {
                    // Log the error and reject the promise
                    logger.error(`Command failed: ${stderr}`);
                    reject(new Error(`Command failed: ${stderr}`));
                } else {
                    // Log the output and resolve the promise
                    logger.info(`Command output: ${stdout}`);
                    resolve(stdout);
                }
            });
        });
    }
    public async prove(specFile: string, bodyFile: string, level: number): Promise<string> {
        try {
            const command = `gnatprove -P ${this.projectFile} --checks-as-errors --level=${level} --no-axiom-guard`;
            console.log("command :", command)

            const output = await this.runCommand(command);
            await this.cleanUp();  // Clean up after proving
            return output;
        } catch (error) {
            logger.error(`Prove operation failed: ${error}`);
            throw error;
        }
    }

    public async examine(specFile: string, bodyFile: string, reportAll: boolean, level: number): Promise<string> {
        try {
            const command = reportAll
                ? `gnatprove -P ${this.projectFile} --checks-as-errors --level=${level} --no-axiom-guard --mode=flow --report=all`
                : `gnatprove -P ${this.projectFile} --checks-as-errors --level=${level} --no-axiom-guard --mode=flow`;

            const output = await this.runCommand(command);
            await this.cleanUp();  // Clean up after examining
            return output;
        } catch (error) {
            logger.error(`Examine operation failed: ${error}`);
            throw error;
        }
    }
}
