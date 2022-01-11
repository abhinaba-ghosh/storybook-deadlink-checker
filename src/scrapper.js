import puppeteer from 'puppeteer';
import logSymbols from 'log-symbols';
import micromatch from 'micromatch';

const isMatch = micromatch.isMatch;

export const getScrapperInstance = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox'],
	});

	return browser.newPage();
};

export const killScrapperInstance = async (browser) => {
	await browser.close();
};

export const validateSidebarLinks = async (
	browser,
	storybookURL,
	links,
	filePathAbs,
	ignorePattern,
	errorFiles
) => {
	const page = await browser;
	for (const link of links) {
		// terminate if the link is ignored by --ignore flag
		if (ignorePattern && isMatch(link, ignorePattern)) return;

		const finalLink = `${storybookURL}/iframe.html?id=${link}`;
		await page.goto(finalLink, { waitUntil: 'domcontentloaded' });

		const storyRootContent = await page.$eval('#docs-root', (element) => {
			return element.innerHTML;
		});
		const docsRootContent = await page.$eval('#root', (element) => {
			return element.innerHTML;
		});

		const formatLink = link.replace(/&viewMode=(.*)/, '');

		if (!storyRootContent && !docsRootContent) {
			errorFiles.push(filePathAbs);
			console.error(`\t[${logSymbols.error}] ${formatLink}`);
		} else {
			console.log(`\t[${logSymbols.success}] ${formatLink}`);
		}
	}
};
