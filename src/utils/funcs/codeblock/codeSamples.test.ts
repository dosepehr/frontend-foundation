import { loadHighlighter } from '@/utils/funcs/highlighter';
import {
    ansiOutput,
    componentCode,
    configJson,
    languageSamples,
    longFile,
    longLine,
} from './codeSamples';

describe('codeSamples', () => {
    it.each(Object.keys(languageSamples))(
        'uses a language the highlighter supports (%s)',
        async (language) => {
            await expect(loadHighlighter(language)).resolves.not.toBeNull();
        },
    );

    it('has valid JSON in the config sample', () => {
        expect(() => JSON.parse(configJson)).not.toThrow();
    });

    it('keeps the long line on one line and the long file long', () => {
        expect(longLine).not.toContain('\n');
        expect(longFile.split('\n')).toHaveLength(40);
    });

    it('colors the terminal output with ANSI escape codes', () => {
        expect(ansiOutput).toContain('\u001B[');
    });

    it('shows a multi-line component snippet', () => {
        expect(componentCode.split('\n').length).toBeGreaterThan(5);
    });
});
