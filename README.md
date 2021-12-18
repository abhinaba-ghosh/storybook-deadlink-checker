<p align="center">
  <img src="./docs/logo.png"/>
</p>

# Storybook Deadlink Checker

A lightweight dead-link scrapper for md and mdx files. It also supports validating dead-links for [storybook](https://storybook.js.org/) stories where links has been created using the [@storybook/addon-links](https://storybook.js.org/addons/@storybook/addon-links) package.

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
  --version                   Show version number                      [boolean]
  --dir, --directory          directory path                 [string] [required]
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

## Tell me your issues

you can raise any issue [here](https://github.com/abhinaba-ghosh/storybook-deadlink-checker/issues)

## Contribution

Any pull request is welcome.

## Before you go

If it works for you , give a [Star](https://github.com/abhinaba-ghosh/storybook-deadlink-checker)! :star:
