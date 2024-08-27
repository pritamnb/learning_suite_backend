import { exec } from 'child_process';
import path from 'path';
import { config } from '../config/config';
import logger from '../config/logger';

export class SparkAdaService {
    private projectFile: string;
    private adaSourceDir: string;

    constructor() {
        this.projectFile = config.adaProjectFile;
        this.adaSourceDir = config.adaSourceDir;
    }

    private runCommand(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    logger.error(`Command failed: ${stderr}`);
                    reject(stderr);
                } else {
                    console.log("stdout :", stdout)

                    resolve(stdout);
                }
            });
        });
    }

    public async prove(specFile: string, bodyFile: string, level: number): Promise<string> {
        try {
            const command = `gnatprove -P ${this.projectFile} --checks-as-errors --level=${level} --no-axiom-guard`;
            console.log("command :", command)

            return await this.runCommand(command);
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

            return await this.runCommand(command);
        } catch (error) {
            logger.error(`Examine operation failed: ${error}`);
            throw error;
        }
    }
}
