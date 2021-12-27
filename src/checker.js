import chalk from 'chalk';
import {
	getScrapperInstance,
	killScrapperInstance,
	validateSidebarLinks,
} from './scrapper.js';
import { checkExternalLinks, checkInternalLinks } from './utils.js';

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
		checkExternalLinks(
			filePathAbs,
			externalLinks,
			ignorePattern,
			errorFiles
		);

		checkInternalLinks(
			linkCache,
			filePathAbs,
			internalLinks,
			ignorePattern,
			errorFiles
		);

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
