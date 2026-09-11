import { describe, it, expect } from 'vitest';
import { parseMarkdownFrontmatter } from './generate-thumbnails.mjs';

describe('parseMarkdownFrontmatter', () => {
	it('parses simple key/value pairs', () => {
		const content = '---\ntitle: My Project\nlink: https://example.com\n---\nBody text';
		expect(parseMarkdownFrontmatter(content)).toEqual({
			title: 'My Project',
			link: 'https://example.com',
		});
	});

	it('strips surrounding single and double quotes', () => {
		const content = '---\ntitle: "Quoted Title"\nlink: \'https://example.com\'\n---\n';
		expect(parseMarkdownFrontmatter(content)).toEqual({
			title: 'Quoted Title',
			link: 'https://example.com',
		});
	});

	it('returns an empty object when there is no frontmatter block', () => {
		expect(parseMarkdownFrontmatter('# Just a heading\n\nSome text')).toEqual({});
	});

	it('ignores lines without a colon', () => {
		const content = '---\ntitle: Test\njust some text\nlink: https://example.com\n---\n';
		expect(parseMarkdownFrontmatter(content)).toEqual({
			title: 'Test',
			link: 'https://example.com',
		});
	});
});
