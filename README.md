<p align="center">
  <img src="./assets/logo.png"/>
</p>

# Storybook Deadlink Checker

![example workflow](https://github.com/abhinaba-ghosh/storybook-deadlink-checker/actions/workflows/main.yml/badge.svg)
[![NPM release](https://img.shields.io/npm/v/storybook-deadlink-checker.svg 'NPM release')](https://www.npmjs.com/package/storybook-deadlink-checker)
[![NPM Downloads](https://img.shields.io/npm/dt/storybook-deadlink-checker.svg?style=flat-square)](https://www.npmjs.com/package/storybook-deadlink-checker)

A lightweight storybook addon that validates dead-links for [storybook](https://storybook.js.org/) stories where links are created using the [@storybook/addon-links](https://storybook.js.org/addons/@storybook/addon-links) package.

## Highlights

-   Supports node v8.x and above
-   Validates all anchor/internal links in the stories (eg. #my-link)
-   Validates all external links in the stories (eg. https://my-link.com)
-   Validates all storybook link addons in the stories (eg. LinkTo kind='\*')

## Installation

```
npm i --save-dev storybook-deadlink-checker

yarn add --dev storybook-deadlink-checker
```

## Usage Guidelines

> :warning: Currently support CLI usage, programmatic usage is not supported yet

```
$ npx storybook-deadlink-checker [dir] [storybook-url] [fileIgnorePattern] [onlyFail]

Options:
  --version                   Show version number                       [boolean]
  --file, --file              file path                                 [string]
  --dir, --directory          directory path                            [string]
  --url, --storybook-url      storybook live or local build url         [string]
  --ignore, --ignore-pattern  ignore pattern                            [string]
  --onlyFail, --only-fail     only show failed links  [boolean] [default: false]
  --help                      Show help                                [boolean]
```

### Check Anchor and External Link used in md and mdx files

```
$ npx storybook-deadlink-checker --dir="./path/to/folder"
```

### Check storybook links along with anchor and external links

The magic is really simple. The scrapper finds all the `<LinkTo kind='*'/>` , `[Link](?path=/docs/*)` and `<a href="?path=/docs/*">Link</a>` tags in the storybook stories and checks if the links are valid in the hosted/local storybook build.

To validate the story links you need to have a storybook url. You can either use the live build url or the local build url.

For local build url, you can use the following command:

```
$ npx build-storybook -o ./local-storybook-build-folder

// then validate the links
$ npx storybook-deadlink-checker --dir="./path/to/folder" --url="file:///${PWD}/local-storybook-build-folder"
```

For live build url, you can use the following command:

```
$ npx start-storybook -p 9009 --no-manager-cache -s public
$ npx storybook-deadlink-checker --dir="./path/to/folder" --url="http://localhost:9009"
```

### Only show failed links

```
$ npx storybook-deadlink-checker --dir="./path/to/folder" --url="http://localhost:9009" --onlyFail
```

### Ignore special links

```
$ npx storybook-deadlink-checker --dir="./path/to/folder" --url="http://localhost:9009" --ignore="url-pattern-1,url-pattern-2..."
```

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/storybook-deadlink-checker/issues)

## Contribution

Any pull request is welcome.

## Before you go

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/storybook-deadlink-checker)! :star:
