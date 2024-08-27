import fs from 'fs';
import path from 'path';
import logger from '../config/logger';

export const setupAdaProject = () => {
    const adaProjectDir = path.join(__dirname, '../spark_ada_project');
    const adaSourceDir = path.join(adaProjectDir, 'src');
    const adaObjDir = path.join(adaProjectDir, 'obj');
    const adaBinDir = path.join(adaProjectDir, 'bin');
    const mainGprPath = path.join(adaProjectDir, 'main.gpr');

    // Ensure spark_ada_project/src directory exists
    if (!fs.existsSync(adaSourceDir)) {
        fs.mkdirSync(adaSourceDir, { recursive: true });
        logger.info(`Created directory: ${adaSourceDir}`);
    }

    // Ensure spark_ada_project/obj directory exists
    if (!fs.existsSync(adaObjDir)) {
        fs.mkdirSync(adaObjDir, { recursive: true });
        logger.info(`Created directory: ${adaObjDir}`);
    }

    // Ensure spark_ada_project/bin directory exists
    if (!fs.existsSync(adaBinDir)) {
        fs.mkdirSync(adaBinDir, { recursive: true });
        logger.info(`Created directory: ${adaBinDir}`);
    }

    // Ensure main.gpr file exists
    if (!fs.existsSync(mainGprPath)) {
        const mainGprContent = `
            project Main is
                for Source_Dirs use ("src");
                for Object_Dir  use "obj";
                for Exec_Dir    use "bin";
            end Main;
        `;
        fs.writeFileSync(mainGprPath, mainGprContent);
        logger.info(`Created main.gpr file at: ${mainGprPath}`);
    }
};
