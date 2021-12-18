#!/usr/bin/env node

import walkSync from 'walk-sync';
import chalk from 'chalk';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { fetchLinks, filterArray } from './src/utils.js';
import { checkLinks } from './src/checker.js';

const options = yargs(hideBin(process.argv))
	.options({
		dir: {
			alias: 'directory',
			description: 'directory path',
			type: 'string',
			required: true,
		},
		url: {
			alias: 'storybook-url',
			description: 'storybook live or local build url',
			type: 'string',
		},
		ignore: {
			alias: 'ignore-pattern',
			description: 'ignore pattern',
			type: 'string',
		},
		onlyFail: {
			alias: 'only-fail',
			description: 'only show failed links',
			type: 'boolean',
			default: false,
		},
	})
	.check((argv) => {
		if (!argv.dir) {
			throw new Error(`${chalk.red('Missing required argument:')} dir`);
		}
		return true;
	})
	.help().argv;

const dir = options.dir;
const storybookURL = options.url;
const ignorePattern = options.ignore;
const onlyFail = options.onlyFail;

const filePaths = walkSync(dir, { directories: false });
const linkObject = fetchLinks(dir, filePaths);

process.exitCode = 0;

if (onlyFail) {
	console.log = function () {};
}

checkLinks(linkObject, storybookURL, ignorePattern)
	.then((errFiles) => {
		if (errFiles.length > 0) {
			const filteredFiles = filterArray(errFiles);
			console.error(
				'\n\n',
				chalk.red(
					`${filteredFiles.length} files have broken links. Please fix them before committing.`
				)
			);
			console.error(chalk.red(filteredFiles.join('\n')));
			process.exitCode = 1;
		} else {
			console.log('\n\n', chalk.green(`No broken links found.`));
		}
		process.exit();
	})
	.catch((err) => {
		console.error(err);
		process.exitCode = 1;
		process.exit();
	});
