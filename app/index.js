var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');

var AppGenerator = module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.generatorTypes = ['control', 'app'];
    },

    promptTask: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
          'Welcome to the awesome OneJS generator!'
        ));

        var prompts = [{
                type: 'list',
                name: 'generatorType',
                choices: this.generatorTypes,
                message: 'What do you want to generate?',
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

    writeTask: function() {
        var viewPath = 'src/' + this.viewName;

        if (this.selectedType === this.generatorTypes[0]) {
            var srcPath = 'src/Control/src/';
            var destPath = viewPath + '/';

            // Template and copy over the source files
            this.template(srcPath + '_Control.html', destPath + this.viewName + '.html');
            this.template(srcPath + '_Control.less', destPath + this.viewName + '.less');
            this.template(srcPath + '_ControlBase.ts', destPath + this.viewName + 'Base.ts');
            this.template(srcPath + '_ControlModel.ts', destPath + this.viewName + 'Model.ts');

            srcPath = 'src/Control/test/';
            destPath = 'test/';

            // Template and copy over the test stub file
            this.template(srcPath + '_Control.test.ts', destPath + this.viewName + '.test.ts');
        } else if (this.selectedType === this.generatorTypes[1]) {
            this.copy('index.html');

            this.copy('main.ts', 'src/main.ts');

            var srcPath = 'src/App/AppRoot/';
            var destPath = 'src/AppRoot/';

            this.template(srcPath + '_AppRoot.html', destPath + 'AppRoot.html');
            this.copy(srcPath + '_AppRoot.less', destPath + 'AppRoot.less');
            this.copy(srcPath + '_AppRootBase.ts', destPath + 'AppRootBase.ts');
            this.copy(srcPath + '_AppRootModel.ts', destPath + 'AppRootModel.ts');

            srcPath = 'src/App/View/';
            destPath = viewPath + '/';

            this.template(srcPath + '_View.html', destPath + this.viewName + '.html');
            this.template(srcPath + '_View.less', destPath + this.viewName + '.less');
            this.template(srcPath + '_ViewBase.ts', destPath + this.viewName + 'Base.ts');
            this.template(srcPath + '_ViewModel.ts', destPath + this.viewName + 'Model.ts');

            gulpfile.apply(this);
            git.apply(this);
            editorConfig.apply(this);
            package.apply(this);
            install.apply(this);
        }
    }
});

var _toCamelCase = function(val) {
    val = val || '';

    val = val[0].toLowerCase() + val.substr(1);

    return val;
}

var gulpfile = function() {
    this.template('gulpfile.js');
};

var git = function() {
    this.copy('gitignore', '.gitignore');
    this.copy('gitattributes', '.gitattributes');
};

var package = function() {
    this.template('_package.json', 'package.json');
};

var editorConfig = function() {
    this.copy('editorconfig', '.editorconfig');
};

var install = function() {
    var howToInstall =
        '\nAfter running `npm install install`, inject your front end dependencies into' +
        '\nyour HTML by running:' +
        '\n' +
        chalk.yellow.bold('\n  gulp wiredep');

    if (this.options['skip-install']) {
        this.log(howToInstall);
        return;
    }

    this.npmInstall();
};
