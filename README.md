# QingPopover

[![Latest Version](https://img.shields.io/npm/v/qing-popover.svg)](https://www.npmjs.com/package/qing-popover)
[![Build Status](https://img.shields.io/travis/mycolorway/qing-popover.svg)](https://travis-ci.org/mycolorway/qing-popover)
[![Coveralls](https://img.shields.io/coveralls/mycolorway/qing-popover.svg)](https://coveralls.io/github/mycolorway/qing-popover)
[![David](https://img.shields.io/david/mycolorway/qing-popover.svg)](https://david-dm.org/mycolorway/qing-popover)
[![David](https://img.shields.io/david/dev/mycolorway/qing-popover.svg)](https://david-dm.org/mycolorway/qing-popover#info=devDependencies)

QingPopover is a ui component inherited from QingModule.

## Usage

```html
<script type="text/javascript" src="node_modules/jquery/dist/jquery.js"></script>
<script type="text/javascript" src="node_modules/qing-module/dist/qing-module.js"></script>
<script type="text/javascript" src="node_modules/qing-popover/dist/qing-popover.js"></script>

<div class="qing-popover"></div>
```

```js
var qingPopover = new QingPopover({
  pointTo: '.point-to'
});

## Options

__pointTo__

Selector/Element/jQuery Object, required, specify the html element.

__boundarySelector__

specific boundary element to calculate popover direction

__cls__

html class add to popover element

__content__

popover content

__direction__

specific popover direction instead of auto calculate

__offset__

offset distance between pointTo and popover

__align__

object, popover arrow point to which part of pointTo target

```
{
  horizental: 'center'
  vertical: 'middle'
}
```

## Methods

__refresh__()

update the popover position.

__destroy__ ()

Destroy component, restore element to original state.

## Installation

Install via npm:

```bash
npm install --save qing-popover
```

## Development

Clone repository from github:

```bash
git clone https://github.com/mycolorway/qing-popover.git
```

Install npm dependencies:

```bash
npm install
```

Run default gulp task to build project, which will compile source files, run test and watch file changes for you:

```bash
gulp
```

Now, you are ready to go.

## Publish

When you want to publish new version to npm and bower, please make sure all tests have passed, and you need to do these preparations:

* Add release information in `CHANGELOG.md`. The format of markdown contents will matter, because build scripts will get version and release content from the markdown file by regular expression. You can follow the format of the older releases.

* Put your [personal API tokens](https://github.com/blog/1509-personal-api-tokens) in `/.token.json`(listed in `.gitignore`), which is required by the build scripts to request [Github API](https://developer.github.com/v3/) for creating new release:

```json
{
  "github": "[your github personal access token]"
}
```

Now you can run `gulp publish` task, which will do these work for you:

* Get version number from `CHANGELOG.md` and bump it into `package.json` and `bower.json`.
* Get release information from `CHANGELOG.md` and request Github API to create new release.

If everything goes fine, you can see your release at [https://github.com/mycolorway/qing-module/releases](https://github.com/mycolorway/qing-module/releases). At the End you can publish new version to npm with the command:

```bash
npm publish
```

Please be careful with the last step, because you cannot delete or republish a version on npm.
