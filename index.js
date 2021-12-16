#!/usr/bin/env node

import walkSync from 'walk-sync';

import { fetchLinks } from './src/utils.js';
import { checkLinks } from './src/file-link-checker.js';
// import { validateSidebarLinks } from './src/live-link-checker.js';

let exitCode = 0;

const dir = process.argv[2] || '.';
const basePath = process.argv[3] || '.';
const ignorePattern = process.argv[4];

const filePaths = walkSync(dir, { directories: false });
const linkObject = fetchLinks(dir, filePaths, basePath)

// console.log(linkObject.storybookLinks);

checkLinks(linkObject, ignorePattern).then((p) => { console.log('done!'); }).catch((err) => {
  throw err;
});

// checkFileLinks(linkObject, ignorePattern);



// process.exit(exitCode);

