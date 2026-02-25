/**
 * File Reader - Read code files from disk for API analysis
 *
 * Globs for code files, respects common ignore patterns,
 * and enforces size limits for API submission.
 */
export interface CodeFile {
    path: string;
    content: string;
}
export declare function readCodeFiles(targetPath: string): Promise<CodeFile[]>;
export declare const FILE_READER_LIMITS: {
    MAX_FILES: number;
    MAX_FILE_SIZE: number;
    MAX_TOTAL_SIZE: number;
};
//# sourceMappingURL=file-reader.d.ts.map