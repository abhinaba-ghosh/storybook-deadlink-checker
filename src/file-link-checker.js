import { existsSync } from 'fs';
import retus from 'retus';
import chalk from 'chalk';
import logSymbols from 'log-symbols';
import micromatch from 'micromatch';
import { validateSidebarLinks } from './live-link-checker.js';

const isMatch = micromatch.isMatch;

let exitCode = 0;

export const checkLinks = async (linkCache, ignorePattern) => {

    for (const file in linkCache) {
        const { storybookLinks, externalLinks, internalLinks, filePathAbs } = linkCache[file];

        console.log(chalk.cyan(`FILE: ${filePathAbs}`));

        // console.log(linkCache[file].storybookLinks);

        // validate external links are valid using link-checker
        externalLinks.forEach(link => {
            try {
                retus.head(link, {
                    throwHttpErrors: true,
                })
                console.log(`\t[${logSymbols.success}]`, `${link}`);
            } catch {
                exitCode = 1;
                console.log(`\t[${logSymbols.error}]`, `${link}`);
            }
        })

        internalLinks.forEach((link) => {
            if (ignorePattern && isMatch(link.original, ignorePattern)) return;

            const [targetFile, targetId] = link.absolute.split('#');

            if (!linkCache[targetFile]) {
                if (existsSync(targetFile)) {
                    readFileIntolinkCache(targetFile);
                    console.log(`\t[${logSymbols.success}]`, `${link.absolute}`);
                } else {
                    exitCode = 1;
                    console.log(`\t[${logSymbols.error}]`, `${link.absolute}`);
                }
            }

            // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            if (targetId && (!linkCache[targetFile] || !linkCache[targetFile].ids[targetId])) {
                exitCode = 1;
                console.log(`\t[${logSymbols.error}]`, `${link.original}`);
            }
        });

        await validateSidebarLinks(storybookLinks);
    }

}




