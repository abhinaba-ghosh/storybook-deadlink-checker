import puppeteer from 'puppeteer';
import logSymbols from 'log-symbols';

export const validateSidebarLinks = async (links) => {

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    for (const link of links) {

        const finalLink = `https://aether.postmanlabs.com/iframe.html?id=${link}`;
        await page.goto(finalLink, { waitUntil: 'networkidle2' });

        const storyRootContent = await page.$eval('#docs-root', (element) => {
            return element.innerHTML;
        });
        const docsRootContent = await page.$eval('#root', (element) => {
            return element.innerHTML;
        });

        if (!storyRootContent && !docsRootContent) {
            console.log(`\t[${logSymbols.error}] ${link}`);
        } else {
            console.log(`\t[${logSymbols.success}] ${link}`);
        }



    };
    await browser.close();
};

export const formatLiveLinks = (link) => {
    let linkPrefix = 'docs';

    // if (linkPrefix !== 'page' || linkPrefix !== 'story') {
    //     console.log(`storybook link prefix is not correct: ${linkPrefix}`);
    // }

    if (link.includes('story')) {
        linkPrefix = 'story';
    }

    const formattedLink = `${link}&viewMode=${linkPrefix}`;

    return formattedLink;

};





    // await page.goto('https://aether.postmanlabs.com/iframe.html?id=get-started-contribution-guides-component-code-documentation--page&viewMode=docs');

    // const data = [];

    // const storyRootContent = await page.$eval('#docs-root', (element) => {
    //     return element.innerHTML
    // })

    // const docsRootContent = await page.$eval('#root', (element) => {
    //     return element.innerHTML;
    // }