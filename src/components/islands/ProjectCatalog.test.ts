import { describe, it, expect } from 'vitest';
import { matchesProjectQuery, collectTags, hasTag, type SerializedProject } from './ProjectCatalog';

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

describe('collectTags / hasTag', () => {
	const a = project({ tags: ['WordPress', 'PHP'] });
	const b = project({ tags: ['wordpress', 'Canvas'] });

	it('groups duplicate tags case-insensitively and sorts by count', () => {
		const tags = collectTags([a, b]);
		expect(tags[0]).toEqual({ key: 'wordpress', label: 'WordPress', count: 2 });
		expect(tags.map((t) => t.key)).toEqual(['wordpress', 'canvas', 'php']);
	});

	it('filters by tag, empty key matches all', () => {
		expect(hasTag(a, 'php')).toBe(true);
		expect(hasTag(b, 'php')).toBe(false);
		expect(hasTag(b, '')).toBe(true);
	});
});
