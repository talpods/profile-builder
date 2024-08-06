const { downloadAndParseDocument } = require('../../helpers/fileToText');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

jest.mock('pdf-parse');
jest.mock('mammoth');

describe('downloadAndParseDocument', () => {
    const pdfBuffer = Buffer.from('fake pdf buffer');
    const docxBuffer = Buffer.from('fake docx buffer');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should parse PDF file and return text', async () => {
        const mockPdfData = { text: 'Parsed PDF text' };
        pdf.mockResolvedValue(mockPdfData);

        const result = await downloadAndParseDocument(pdfBuffer, 'file.pdf');

        expect(result).toBe(mockPdfData.text);
        expect(pdf).toHaveBeenCalledWith(pdfBuffer);
    });

    it('should parse DOCX file and return text', async () => {
        const mockDocxData = { value: 'Parsed DOCX text' };
        mammoth.extractRawText.mockResolvedValue(mockDocxData);

        const result = await downloadAndParseDocument(docxBuffer, 'file.docx');

        expect(result).toBe(mockDocxData.value);
        expect(mammoth.extractRawText).toHaveBeenCalledWith({ buffer: docxBuffer });
    });

    it('should throw an error for unsupported file types', async () => {
        await expect(downloadAndParseDocument(pdfBuffer, 'file.txt')).rejects.toThrow(
            'Unsupported file type. Please provide a PDF or DOCX file URL.'
        );
    });
});
