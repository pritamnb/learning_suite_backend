export function removeTextAfterPhrase(output: string, phrase: string): string {
    // Find the index of the phrase in the output text
    const index = output.indexOf(phrase);

    // If the phrase is found, slice the text up to that index only
    if (index !== -1) {
        return output.slice(0, index).trim();  // Using trim to clean up any trailing newlines or spaces
    }

    // If the phrase is not found, return the original text
    return output;
}