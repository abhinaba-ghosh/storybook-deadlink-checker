import * as utils from '../src/utils.js';

import { expect } from 'chai';

describe('utils', () => {
	describe('#checkExternalLinks', () => {
		it('should return an array of errors', () => {
			const linkCache = {
				'file1.js': {
					externalLinks: [
						'https://google.com',
						'https://httpstat.us/500',
					],
				},
			};

			const ignorePattern = 'https://google.com';
			const errorFiles = [];

			utils.checkExternalLinks(
				'file1.js',
				linkCache['file1.js'].externalLinks,
				ignorePattern,
				errorFiles
			);

			expect(errorFiles).to.contain('file1.js');
		});
	});

	describe('#checkInternalLinks', () => {
		it('should return an array of errors', () => {
			const linkCache = {
				'file1.js': {
					internalLinks: [
						{
							absolute: 'file2.js',
							original: './file2.js',
						},
						{
							absolute: 'file3.js#id',
							original: './file3.js#id',
						},
					],
				},
				'file2.js': {
					ids: {
						id: 'id',
					},
				},
			};

			const ignorePattern = 'file3.js';
			const errorFiles = [];

			utils.checkInternalLinks(
				linkCache,
				'file1.js',
				linkCache['file1.js'].internalLinks,
				ignorePattern,
				errorFiles
			);

			expect(errorFiles).to.contain('file1.js');
		});
	});
});
