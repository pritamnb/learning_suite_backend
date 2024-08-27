import fs from 'fs';
import path from 'path';
export class FileHandler {
    public static getFilePath(fileName: string): string {
        return path.join(__dirname, '../uploads', fileName);
    }

    public static deleteFile(fileName: string): void {
        const filePath = this.getFilePath(fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    }
}
