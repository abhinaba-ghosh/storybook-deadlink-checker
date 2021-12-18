import puppeteer from 'puppeteer';
import logSymbols from 'log-symbols';

export const getScrapperInstance = async () => {
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox'],
	});

	return browser;
};

export const killScrapperInstance = async (browser) => {
	await browser.close();
};

export const validateSidebarLinks = async (
	browser,
	storybookURL,
	links,
	filePathAbs,
	errorFiles
) => {
	const page = await browser.newPage();
	for (const link of links) {
		const finalLink = `${storybookURL}/iframe.html?id=${link}`;
		await page.goto(finalLink, { waitUntil: 'domcontentloaded' });

		const storyRootContent = await page.$eval('#docs-root', (element) => {
			return element.innerHTML;
		});
		const docsRootContent = await page.$eval('#root', (element) => {
			return element.innerHTML;
		});

		if (!storyRootContent && !docsRootContent) {
			errorFiles.push(filePathAbs);
			console.error(`\t[${logSymbols.error}] ${link}`);
		} else {
			console.log(`\t[${logSymbols.success}] ${link}`);
		}
	}
};
