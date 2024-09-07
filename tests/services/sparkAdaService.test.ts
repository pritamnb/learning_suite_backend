import escape from 'shell-escape';
import { SparkAdaService } from '../../src/services/sparkAdaService';

describe('SparkAdaService', () => {
    let service: SparkAdaService;

    beforeEach(() => {
        service = new SparkAdaService();
    });

    it('should correctly escape command-line arguments', () => {
        // Arrange
        const command = 'gnatprove';
        const args = [
            '-P', '/path/to/projectFile',
            '--checks-as-errors',
            '--level=3',
            '--no-axiom-guard'
        ];

        // Act
        const escapedCommand = `${command} ${escape(args)}`;

        // Assert
        expect(escapedCommand).toBe(
            "gnatprove -P /path/to/projectFile --checks-as-errors '--level=3' --no-axiom-guard"
        );
    });

    it('should handle arguments with special characters', () => {
        // Arrange
        const command = 'gnatprove';
        const args = [
            '-P', '/path/to/projectFile',
            '--checks-as-errors',
            '--level=3',
            '--no-axiom-guard',
            '--extra-args=arg with spaces'
        ];

        // Act
        const escapedCommand = `${command} ${escape(args)}`;

        // Assert
        expect(escapedCommand).toBe(
            "gnatprove -P /path/to/projectFile --checks-as-errors '--level=3' --no-axiom-guard '--extra-args=arg with spaces'"
        );
    });

    it('should fail when escaping invalid arguments', () => {
        // Arrange
        const command = 'gnatprove';
        const invalidArgs: any = {}; // Invalid argument

        // Act & Assert
        expect(() => {
            escape(invalidArgs); // This should throw an error or produce incorrect output
        }).toThrow();
    });
});
