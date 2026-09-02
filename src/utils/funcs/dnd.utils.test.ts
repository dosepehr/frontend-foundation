import {
    createDndFile,
    formatAcceptedExtensions,
    formatFileSize,
    isPreviewableImage,
    validateFiles,
} from './dnd.utils';

function makeFile(name: string, type: string, sizeBytes = 10) {
    const content = new Array(sizeBytes).fill('a').join('');
    return new File([content], name, { type });
}

describe('createDndFile', () => {
    it('creates a DndFile with a preview URL for image files', () => {
        const file = makeFile('photo.png', 'image/png');

        const dndFile = createDndFile(file);

        expect(dndFile.name).toBe('photo.png');
        expect(dndFile.type).toBe('image/png');
        expect(dndFile.size).toBe(file.size);
        expect(dndFile.state).toBe('done');
        expect(dndFile.previewUrl).toBeDefined();
        expect(typeof dndFile.id).toBe('string');
    });

    it('does not create a preview URL for non-image files', () => {
        const file = makeFile('doc.pdf', 'application/pdf');

        const dndFile = createDndFile(file);

        expect(dndFile.previewUrl).toBeUndefined();
    });
});

describe('isPreviewableImage', () => {
    it('returns true for a previewable image type with a previewUrl', () => {
        const file = makeFile('photo.png', 'image/png');
        const dndFile = createDndFile(file);

        expect(isPreviewableImage(dndFile)).toBe(true);
    });

    it('returns false when there is no previewUrl', () => {
        const file = makeFile('doc.pdf', 'application/pdf');
        const dndFile = createDndFile(file);

        expect(isPreviewableImage(dndFile)).toBe(false);
    });

    it('returns false for an unsupported image type even with a previewUrl', () => {
        const dndFile = createDndFile(makeFile('photo.png', 'image/png'));
        // Force an unsupported type while previewUrl remains set.
        const forced = { ...dndFile, type: 'image/tiff' };

        expect(isPreviewableImage(forced)).toBe(false);
    });
});

describe('formatFileSize', () => {
    it('returns undefined for falsy byte counts', () => {
        expect(formatFileSize(0)).toBeUndefined();
        expect(formatFileSize()).toBeUndefined();
    });

    it('formats bytes without decimals', () => {
        expect(formatFileSize(500)).toBe('500 B');
    });

    it('formats KB/MB/GB with one decimal', () => {
        expect(formatFileSize(1536)).toBe('1.5 KB');
        expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
    });

    it('caps the exponent at the largest unit (GB)', () => {
        const hugeBytes = 1024 ** 5; // would be PB otherwise
        expect(formatFileSize(hugeBytes)).toBe('1048576.0 GB');
    });
});

describe('formatAcceptedExtensions', () => {
    it('flattens, strips leading dots, uppercases, and joins extensions', () => {
        const result = formatAcceptedExtensions({
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg'],
        });

        expect(result).toBe('PNG, JPG, JPEG');
    });
});

describe('validateFiles', () => {
    it('accepts files that match a wildcard MIME pattern', () => {
        const file = makeFile('photo.png', 'image/png');

        const { accepted, rejections } = validateFiles([file], {
            accept: { 'image/*': ['.png'] },
            maxSizeMB: 5,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([file]);
        expect(rejections).toEqual([]);
    });

    it('accepts a file matching the wildcard MIME even when its extension differs from the accept list', () => {
        const file = makeFile('photo.jfif', 'image/png');

        const { accepted, rejections } = validateFiles([file], {
            accept: { 'image/*': ['.png'] },
            maxSizeMB: 5,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([file]);
        expect(rejections).toEqual([]);
    });

    it('rejects files with reason "count" once remainingSlots is exceeded', () => {
        const file1 = makeFile('a.png', 'image/png');
        const file2 = makeFile('b.png', 'image/png');

        const { accepted, rejections } = validateFiles([file1, file2], {
            maxSizeMB: 5,
            remainingSlots: 1,
        });

        expect(accepted).toEqual([file1]);
        expect(rejections).toEqual([
            {
                fileName: 'b.png',
                reason: 'count',
                message: 'Only 1 more file(s) can be added.',
            },
        ]);
    });

    it('rejects files with reason "type" when the file does not match accept', () => {
        const file = makeFile('doc.pdf', 'application/pdf');

        const { accepted, rejections } = validateFiles([file], {
            accept: { 'image/*': ['.png'] },
            maxSizeMB: 5,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([]);
        expect(rejections).toEqual([
            {
                fileName: 'doc.pdf',
                reason: 'type',
                message: '"doc.pdf" has an unsupported file type.',
            },
        ]);
    });

    it('rejects files with reason "size" when exceeding the max size', () => {
        const file = makeFile('big.png', 'image/png', 2 * 1024 * 1024);

        const { accepted, rejections } = validateFiles([file], {
            maxSizeMB: 1,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([]);
        expect(rejections).toEqual([
            {
                fileName: 'big.png',
                reason: 'size',
                message: '"big.png" exceeds the 1MB size limit.',
            },
        ]);
    });

    it('accepts any file when accept is not provided', () => {
        const file = makeFile('anything.xyz', 'application/octet-stream');

        const { accepted, rejections } = validateFiles([file], {
            maxSizeMB: 5,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([file]);
        expect(rejections).toEqual([]);
    });

    it('matches by extension when the MIME type does not match', () => {
        const file = makeFile('report.csv', 'application/vnd.ms-excel');

        const { accepted, rejections } = validateFiles([file], {
            accept: { 'text/csv': ['.csv'] },
            maxSizeMB: 5,
            remainingSlots: 5,
        });

        expect(accepted).toEqual([file]);
        expect(rejections).toEqual([]);
    });
});
