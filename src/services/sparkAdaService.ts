import { exec, spawn } from 'child_process';
import path from 'path';
import { config } from '../config/config';
import logger from '../config/logger';
import { promises as fs } from 'fs';
import escape from 'shell-escape';
import { setupAdaProject } from '../utils/projectSetup';
import { removeTextAfterPhrase } from '../utils/utility';
export class SparkAdaService {
    private projectFile: string;
    private adaSourceDir: string;

    constructor() {
        this.projectFile = config.adaProjectFile;
        this.adaSourceDir = config.adaSourceDir;
        setupAdaProject();

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

    private runCommand(command: string, args: string[], timeout: number = 10000): Promise<string> {
        return new Promise((resolve, reject) => {
            const escapedCommand = escape([command, ...args]);
            const commandParts = escapedCommand.split(' ');
            const cmd = commandParts.shift();

            if (!cmd) {
                return reject(new Error('Invalid command'));
            }

            const process = spawn(cmd, commandParts, { timeout });

            let output = '';

            process.stdout.on('data', (data) => {
                console.log('stdout:', data.toString());
                output += data.toString();
            });

            process.stderr.on('data', (data) => {
                console.log('stderr:', data.toString());
                output += data.toString();
            });

            process.on('close', (code) => {
                console.log('Process exited with code:', code);
                output = removeTextAfterPhrase(output.trim(), "Summary logged");
                resolve(output.trim());
            });

            process.on('error', (error) => {
                reject(error);
            });
        });
    }

    public async prove(specFile: string | null, bodyFile: string | null, level: number): Promise<string> {
        try {
            const command = 'gnatprove';
            const args = ['-P', this.projectFile, '--checks-as-errors', `--level=${level}`, '--no-axiom-guard'];
            const timeout = 10000;  // Timeout in milliseconds (10 seconds)

            const output = await this.runCommand(command, args, timeout);
            await this.cleanUp();  // Clean up after proving
            return output;
        } catch (error) {
            logger.error(`Prove operation failed: ${error}`);
            throw error;
        }
    }

    public async examine(specFile: string | null, bodyFile: string | null, reportAll: boolean, level: number): Promise<string> {
        try {
            const command = 'gnatprove';
            const args = reportAll
                ? ['-P', this.projectFile, '--checks-as-errors', `--level=${level}`, '--no-axiom-guard', '--mode=flow', '--report=all']
                : ['-P', this.projectFile, '--checks-as-errors', `--level=${level}`, '--no-axiom-guard', '--mode=flow'];
            const timeout = 10000;  // Timeout in milliseconds (10 seconds)
            // const output = await this.runCommand(command);

            const output = await this.runCommand(command, args, timeout);
            await this.cleanUp();  // Clean up after examining
            return output;
        } catch (error) {
            logger.error(`Examine operation failed: ${error}`);
            throw error;
        }
    }
}
