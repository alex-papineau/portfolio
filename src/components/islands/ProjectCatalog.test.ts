import { describe, it, expect } from 'vitest';
import { matchesProjectQuery, type SerializedProject } from './ProjectCatalog';

const project = (overrides: Partial<SerializedProject['data']> = {}): SerializedProject => ({
	id: 'test-project',
	data: {
		title: 'Ant Farm Simulator',
		description: 'A virtual ant colony sandbox',
		category: 'fun',
		tags: ['canvas', 'simulation'],
		...overrides,
	},
	thumbnail: { src: '/thumb.webp', isLogo: false },
});

describe('matchesProjectQuery', () => {
	it('matches everything when the query is empty', () => {
		expect(matchesProjectQuery(project(), '')).toBe(true);
	});

	it('matches on title, case-insensitively', () => {
		expect(matchesProjectQuery(project(), 'ANT FARM')).toBe(true);
	});

	it('matches on description', () => {
		expect(matchesProjectQuery(project(), 'sandbox')).toBe(true);
	});

	it('matches on tags', () => {
		expect(matchesProjectQuery(project(), 'canvas')).toBe(true);
	});

	it('matches category aliases for fun projects', () => {
		expect(matchesProjectQuery(project({ category: 'fun' }), 'experiments')).toBe(true);
	});

	it('matches category aliases for professional projects', () => {
		expect(matchesProjectQuery(project({ category: 'professional' }), 'client')).toBe(true);
	});

	it('does not match unrelated queries', () => {
		expect(matchesProjectQuery(project(), 'wordpress')).toBe(false);
	});

	it('handles projects with no tags', () => {
		expect(matchesProjectQuery(project({ tags: undefined }), 'anything')).toBe(false);
	});
});
