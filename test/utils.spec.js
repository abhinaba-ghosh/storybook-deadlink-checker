import * as utils from '../src/utils.js';

import { expect } from 'chai';
import nock from 'nock';

describe('utils', () => {
	describe('#checkExternalLinks', () => {
		it('should return an array of errors', () => {
			const linkCache = {
				'file1.js': {
					externalLinks: [
						'https://google.com',
						'https://api.github.com',
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

			console.log('errorFiles:', errorFiles);

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

			console.log('errorFiles:', errorFiles);

			expect(errorFiles).to.contain('file1.js');
		});
	});
});
