var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');
var yosay = require('yosay');

// Some consts we'll use throughout the generator
var c_control = 'control';
var c_app = 'app';
var c_test_framework = 'testFramework';

var AppGenerator = module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
    },

    promptTask: function() {
        var done = this.async();

        // Have Yeoman greet the user.
        this.log(yosay(
          'Welcome to the OneJS generator!'
        ));

        var prompts = _processCommandLineArguments.apply(this);

        this.prompt(prompts, function (props) {
            this.selectedType = this.selectedType || props.generatorType;
            this.viewName = this.viewName || props.name;
            this.viewNameMember = _toCamelCase(this.viewName);
            done();
        }.bind(this));
    },

    writeTask: function() {
        if (_scaffold[this.selectedType]) {
            _scaffold[this.selectedType].apply(this);
        } else {
            this.log(chalk.red.bold('Error: ') + 'do not know how to generate type "' + this.selectedType + '".');
        }
    }
});

var _prompts = {
    generatorType: {
        type: 'list',
        name: 'generatorType',
        choices: [c_control, c_app, c_test_framework],
        message: 'What do you want to generate?'
    },
    name: {
        type: 'input',
        name: 'name',
        message: 'Your OneJS control name (e.g. FavoritesPane)',
        default: this.appname, // Default to current folder name
        validate: function(input) {
            if (input.replace(/ /g,'') === "") {
                return false;
            }
            return true;
        },
        when: function(answers) {
            // Do not prompt for a name if we're generating a test framework
            return answers.generatorType !== c_test_framework;
        }
    }
};

var _processCommandLineArguments = function() {
    var prompts = [];

    if (!(this.options[c_control] || this.options[c_app] || this.options[c_test_framework])) {
        prompts.push(_prompts.generatorType);
    }

    if (this.options[c_control]) {
        this.selectedType = c_control;
    }

    if (this.options[c_app]) {
        this.selectedType = c_app;
    }

    if (this.options[c_test_framework]) {
        this.selectedType = c_test_framework;
    }

    if (this.options['name']) {
        this.viewName = this.options['name'];
        this.viewNameMember = _toCamelCase(this.viewName);
    } else {
        if (!this.options[c_test_framework]) {
            prompts.push(_prompts.name);
        }
    }
    return prompts;
};

var _toCamelCase = function(val) {
    val = val || '';

    if (!val) {
        return;
    }

    val = val[0].toLowerCase() + val.substr(1);

    return val;
};

var _scaffold = {
    control: function() {
        var viewPath = 'src/' + this.viewName;
        var srcPath = 'src/Control/src/';
        var destPath = viewPath + '/';

        // Template and copy over the source files
        this.template(srcPath + '_Control.html', destPath + this.viewName + '.html');
        this.template(srcPath + '_Control.less', destPath + this.viewName + '.less');
        this.template(srcPath + '_ControlBase.ts', destPath + this.viewName + 'Base.ts');
        this.template(srcPath + '_ControlModel.ts', destPath + this.viewName + 'Model.ts');

        // Template and copy over the test stub file
        _testStub.apply(this);
    },
    app: function() {
        this.copy('_index.html', 'index.html');

        this.copy('_main.ts', 'src/main.ts');

        var viewPath = 'src/' + this.viewName;
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

        // Template and copy over the test stub file
        _testStub.apply(this);

        _gulpfile.apply(this);
        _git.apply(this);
        _package.apply(this);
        _bower.apply(this);
        _editorConfig.apply(this);
        _testFramework.apply(this);
        _install.apply(this);
    },
    testFramework: function() {
        _testFramework.apply(this);
    },
};

var _gulpfile = function() {
    this.template('_gulpfile.js', 'gulpfile.js');
};

var _git = function() {
    this.copy('_gitignore', '.gitignore');
    this.copy('_gitattributes', '.gitattributes');
};

var _package = function() {
    this.template('_package.json', 'package.json');
};

var _bower = function() {
    this.template('_bower.json', 'bower.json');
};

var _editorConfig = function() {
    this.copy('_editorconfig', '.editorconfig');
};

var _testFramework = function() {
    var srcPath = 'src/TestFramework/';
    this.copy(srcPath + '_karma.conf.js', 'karma.conf.js');
    this.copy('_test_main.js', 'test-main.js');
    this.copy(srcPath + 'typings/chai/chai.d.ts', 'typings/chai/chai.d.ts');
    this.copy(srcPath + 'typings/mocha/mocha.d.ts', 'typings/mocha/mocha.d.ts');
    this.copy(srcPath + 'typings/tsd.d.ts', 'typings/tsd.d.ts');
};

var _testStub = function() {
    srcPath = 'src/Control/test/';
    destPath = 'test/';

    // Template and copy over the test stub file
    this.template(srcPath + '_Control.test.ts', destPath + this.viewName + '.test.ts');
}

var _install = function() {
    var howToInstall =
        '\nAfter running `npm install`, inject your front end dependencies into' +
        '\nyour HTML by running:' +
        '\n' +
        chalk.yellow.bold('\n  gulp wiredep\n');

    if (this.options['skip-install']) {
        this.log(howToInstall);
        return;
    }

    // Run both npm and bower install
    this.installDependencies();
};
