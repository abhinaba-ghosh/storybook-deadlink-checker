#!/usr/bin/env node

import walkSync from 'walk-sync';
import chalk from 'chalk';

import { fetchLinks, filterArray } from './src/utils.js';
import { checkLinks } from './src/checker.js';

const dir = process.argv[2] || '.';
const storybookURL = process.argv[3];
const basePath = process.argv[4] || '.';
const ignorePattern = process.argv[5];

const filePaths = walkSync(dir, { directories: false });
const linkObject = fetchLinks(dir, filePaths, basePath);

checkLinks(linkObject, storybookURL, ignorePattern)
	.then((errFiles) => {
		if (errFiles.length > 0) {
			console.log(
				'\n\n',
				chalk.red(
					`${errFiles.length} files have broken links. Please fix them before committing.`
				)
			);
			console.log(chalk.red(filterArray(errFiles).join('\n')));
			throw new Error(
				`${errFiles.length} files have broken links. Please fix them before committing.`
			);
		} else {
			console.log('\n\n', chalk.green(`No broken links found.`));
		}
	})
	.catch((err) => {
		throw err;
	});
