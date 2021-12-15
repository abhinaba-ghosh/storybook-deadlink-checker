#!/usr/bin/env node

import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import mdx from '@mdx-js/mdx';
import micromatch from 'micromatch';
import slugPlugin from 'remark-slug';
import { remove } from 'unist-util-remove';
import walkSync from 'walk-sync';
import retus from 'retus';
import chalk from 'chalk';
import logSymbols from 'log-symbols';

const isMatch = micromatch.isMatch;

function remarkRemoveCodeNodes() {
  return function transformer(tree) {
    remove(tree, 'code');
  };
}

function removeMarkdownCodeBlocks(markdown) {
  return markdown.replace(/```[\s\S]+?```/g, '');
}

const cache = {};
let exitCode = 0;

const dir = process.argv[2] || '.';
const basepath = process.argv[3] || '.';
const ignorePattern = process.argv[4];

const filePaths = walkSync(dir, { directories: false });

function fillCache(
  markdownOrJsx,
  filePath,
  filePathAbs,
) {
  markdownOrJsx.replace(
    /\s+(?:(?:"(?:id|name)":\s*)|(?:(?:id|name)=))"([^"]+)"/g,
    (str, match) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (match && match.match) {
        cache[filePathAbs].ids[match] = true;
      }
      // Discard replacement
      return '';
    },
  );

  markdownOrJsx.replace(
    /\s+(?:(?:"(?:href|to|src)":\s*)|(?:(?:href|to|src)=))"([^"]+)"/g,
    (str, match) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (match && match.match) {
        if (
          !match.match(
            /(^https?:\/\/)|(^#)|(^[^:]+:.*)|(\.mdx?(#[a-zA-Z0-9._,-]*)?$)/,
          )
        ) {
          if (match.match(/\/$/)) {
            match += 'index.mdx';
          } else if (match.match(/\/#[^/]+$/)) {
            match = match.replace(/(\/)(#[^/]+)$/, '$1index.mdx$2');
          }
        }

        if (match.match(/^https?:\/\//)) {
          cache[filePathAbs].externalLinks.push(match);
        } else if (match.match(/^[^:]+:.*/)) {
          // ignore links such as "mailto:" or "javascript:"
        } else {
          let absolute;

          const isAnchorLink = match.match(/^#/);
          const isRootRelativeLink = match.match(/^\//);

          if (isAnchorLink) {
            match = filePath + match;
            absolute = path.resolve(path.join(match));
          } else if (isRootRelativeLink) {
            absolute = path.resolve(path.join(basepath, match));
          } else {
            const result = filePath.match(/^(.+\/)[^/]+$/);
            const filePathBase = result?.[1];
            absolute = path.resolve(filePathBase + '/' + match);
          }

          cache[filePathAbs].internalLinks.push({
            original: match,
            absolute,
          });
        }
      }
      // Discard replacement
      return '';
    },
  );
}

function readFileIntoCache(filePath) {
  const filePathAbs = path.resolve(filePath);
  const fileExt = filePath.split('.').pop();

  if (!fileExt || !['mdx', 'md'].includes(fileExt)) {
    return;
  }

  const markdown = removeMarkdownCodeBlocks(
    readFileSync(filePathAbs).toString(),
  );

  let jsx = '';

  try {
    jsx = mdx.sync(markdown, {
      remarkPlugins: [slugPlugin, remarkRemoveCodeNodes],
    });
  } catch (e) {
    // Fail if there was an error parsing a mdx/md file
    if (fileExt === 'mdx' || fileExt === 'md') {
      console.error('Unable to parse mdx to jsx: ' + filePath);
      throw e;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!cache[filePathAbs]) {
    cache[filePathAbs] = {
      filePath,
      filePathAbs,
      externalLinks: [],
      internalLinks: [],
      ids: {},
    };
  }

  fillCache(jsx, filePath, filePathAbs);
  fillCache(markdown, filePath, filePathAbs);
}

filePaths.forEach((relativePath) => {
  const filePath = path.join(dir, relativePath);
  readFileIntoCache(filePath);
});

const errors = [];

for (const file in cache) {
  const { externalLinks, internalLinks, filePathAbs } = cache[file];

  console.log(chalk.cyan(`FILE: ${filePathAbs}`));

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

    if (!cache[targetFile]) {
      if (existsSync(targetFile)) {
        readFileIntoCache(targetFile);
        console.log(`\t[${logSymbols.success}]`, `${link.absolute}`);
      } else {
        exitCode = 1;
        console.log(`\t[${logSymbols.error}]`, `${link.absolute}`);
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (targetId && (!cache[targetFile] || !cache[targetFile].ids[targetId])) {
      exitCode = 1;
      console.log(`\t[${logSymbols.error}]`, `${link.original}`);
    }
  });
}

process.exit(exitCode);