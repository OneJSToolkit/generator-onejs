var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');

var AppGenerator = module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.option('coffee');
        this.generatorTypes = ['control', 'app'];
    },

    promptTask: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
          'Welcome to the awesome OneJS generator!'
        ));

        var prompts = [{
                type: 'input',
                name: 'generatorType',
                message: 'What do you want to generate? Options are {' + this.generatorTypes.map(function(i) { return i; }) + '}',
                default: this.generatorTypes[0] // Default to a control
            }, {
                type: 'input',
                name: 'name',
                message: 'Your OneJS control name (e.g. FavoritesPane)',
                default: this.appname // Default to current folder name
            }
        ];

        this.prompt(prompts, function (props) {
            this.selectedType = props.generatorType;
            this.viewName = props.name;
            this.viewNameMember = _toCamelCase(this.viewName);
            done();
        }.bind(this));
    },

    gulpfile: function() {
        this.template('gulpfile.js');
    },

    git: function() {
        this.copy('gitignore', '.gitignore');
        this.copy('gitattributes', '.gitattributes');
    },

    package: function() {
        this.template('_package.json', 'package.json');
    },

    editorConfig: function() {
        this.copy('editorconfig', '.editorconfig');
    },

    app: function() {
        var viewPath = 'src/' + this.viewName;
        this.mkdir(viewPath);

        if (this.selectedType === this.generatorTypes[0]) {
            // Template and copy over the source files
            this.template('src/Control/src/_Control.html', viewPath + '/' + this.viewName + '.html');
            this.template('src/Control/src/_Control.less', viewPath + '/' + this.viewName + '.less');
            this.template('src/Control/src/_ControlBase.ts', viewPath + '/' + this.viewName + 'Base.ts');
            this.template('src/Control/src/_ControlModel.ts', viewPath + '/' + this.viewName + 'Model.ts');

            // Template and copy over the test stub file
            this.template('src/Control/test/_Control.test.ts', 'test/' + this.viewName + '.test.ts');
        } else if (this.selectedType === this.generatorTypes[1]) {
            this.copy('index.html');
            this.mkdir('src');

            this.copy('main.ts', 'src/main.ts');

            this.mkdir('src/AppRoot');
            this.template('src/AppRoot/AppRoot.html', 'src/AppRoot/AppRoot.html');
            this.copy('src/AppRoot/AppRoot.less', 'src/AppRoot/AppRoot.less');
            this.copy('src/AppRoot/AppRootBase.ts', 'src/AppRoot/AppRootBase.ts');
            this.copy('src/AppRoot/AppRootModel.ts', 'src/AppRoot/AppRootModel.ts');

            this.template('src/View/View.html', viewPath + '/' + this.viewName + '.html');
            this.template('src/View/View.less', viewPath + '/' + this.viewName + '.less');
            this.template('src/View/ViewBase.ts', viewPath + '/' + this.viewName + 'Base.ts');
            this.template('src/View/ViewModel.ts', viewPath + '/' + this.viewName + 'Model.ts');
        }
    },

    install: function() {
        var howToInstall =
            '\nAfter running `npm install install`, inject your front end dependencies into' +
            '\nyour HTML by running:' +
            '\n' +
            chalk.yellow.bold('\n  gulp wiredep');

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }
        var done = this.async();

        this.npmInstall(null, null, done);
    }
});

function _toCamelCase(val) {
    val = val || '';

    val = val[0].toLowerCase() + val.substr(1);

    return val;
}