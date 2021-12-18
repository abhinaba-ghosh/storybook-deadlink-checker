import { existsSync } from 'fs';
import retus from 'retus';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import micromatch from 'micromatch';
import {
	getScrapperInstance,
	killScrapperInstance,
	validateSidebarLinks,
} from './scrapper.js';
import { readFileIntoCache } from './utils.js';

const isMatch = micromatch.isMatch;

export const checkLinks = async (linkCache, storybookURL, ignorePattern) => {
	const errorFiles = [];
	let browser;

	if (storybookURL) {
		browser = await getScrapperInstance();
	}

	for (const file in linkCache) {
		const { storybookLinks, externalLinks, internalLinks, filePathAbs } =
			linkCache[file];

		console.info(chalk.cyan(`\nFILE: ${filePathAbs}`));

		// validate external links are valid using link - checker
		externalLinks.forEach((link) => {
			try {
				retus.get(link, {
					throwHttpErrors: true,
				});
				console.log(`\t[${logSymbols.success}]`, `${link}`);
			} catch {
				errorFiles.push(filePathAbs);
				console.error(`\t[${logSymbols.error}]`, `${link}`);
			}
		});

		internalLinks.forEach((link) => {
			if (ignorePattern && isMatch(link.original, ignorePattern)) return;

			const [targetFile, targetId] = link.absolute.split('#');

			if (
				targetId &&
				linkCache[targetFile] &&
				linkCache[targetFile].ids[targetId]
			) {
				console.log(`\t[${logSymbols.success}]`, `#${targetId}`);
			}

			if (!linkCache[targetFile]) {
				if (existsSync(targetFile)) {
					readFileIntoCache(linkCache, targetFile);
					console.log(
						`\t[${logSymbols.success}]`,
						targetId ? `#${targetId}` : link.original
					);
				} else {
					errorFiles.push(filePathAbs);
					console.error(
						`\t[${logSymbols.error}]`,
						targetId ? `#${targetId}` : link.original
					);
				}
			}

			if (
				targetId &&
				(!linkCache[targetFile] || !linkCache[targetFile].ids[targetId])
			) {
				errorFiles.push(filePathAbs);
				console.error(
					`\t[${logSymbols.error}]`,
					targetId ? `#${targetId}` : link.original
				);
			}
		});

		if (storybookURL) {
			try {
				await validateSidebarLinks(
					browser,
					storybookURL,
					storybookLinks,
					filePathAbs,
					errorFiles
				);
			} catch (err) {
				throw err;
			}
		}
	}

	if (browser) {
		await killScrapperInstance(browser);
	}

	return errorFiles;
};
