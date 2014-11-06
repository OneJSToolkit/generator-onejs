# OneJS generator

The [Yeoman](http://yeoman.io/) generator for [OneJS](https://github.com/OneJSToolkit/onejs) will do all the heavy lifting so you can stay focused on building amazing tools!

## Usage

1. Install [generator-onejs](https://www.npmjs.org/package/generator-onejs) `npm install -g generator-onejs`
1. Make a new directory, and cd into it `mkdir my-onejs-project && cd $_`
1. Run the generator and follow the prompts to create a new "site" `yo onejs`
1. Run the initial build `gulp`
1. Spin up a server/browser with watch/livereload support, which will auto build your stuff and refresh your page: `gulp watch`

## yo onejs

You can use `yo onejs` to follow prompts to scaffold anything that we have a generator for. Alternately, power users may want to skip the prompts in order to scaffold with just command line arguments.

## Site

Use this as a starting point for a brand new site. Scaffolds a site root, a controller with example data, and test framework.

`yo onejs --site --name=MySiteName`

## Control

Generates a the control source with the name passed in and a test stub.

`yo onejs --control --name=FavoritesPane`

## Test Framework

Sets up a Karma test runner with Mocha and Chai library and a PhantomJS browser to run tests in. Already included in the site scaffolding, so only run this if you didn't use the site generator to create your project.

`yo onejs --testFramework`
