var yeoman = require('yeoman-generator');
var path = require('path');
var chalk = require('chalk');

var AppGenerator = module.exports = yeoman.generators.Base.extend({
    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);
        this.option('coffee');
    },

    promptTask: function() {
        var done = this.async();
        this.prompt({
            type: 'input',
            name: 'name',
            message: 'Your OneJS view class name (e.g. FavoritesPane)',
            default: this.appname // Default to current folder name
        }, function(answers) {
            this.viewName = answers.name;
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

    bower: function() {
        this.template('_bower.json', 'bower.json');
    },

    package: function() {
        this.template('_package.json', 'package.json');
    },

    editorConfig: function() {
        this.copy('editorconfig', '.editorconfig');
    },

    app: function() {
        var viewPath = 'src/' + this.viewName;

        this.copy('index.html');
        this.mkdir('src');

        this.copy('main.ts', 'src/main.ts');

        this.mkdir('src/AppRoot');
        this.template('src/AppRoot/AppRoot.html', 'src/AppRoot/AppRoot.html');
        this.copy('src/AppRoot/AppRoot.less', 'src/AppRoot/AppRoot.less');
        this.copy('src/AppRoot/AppRootBase.ts', 'src/AppRoot/AppRootBase.ts');
        this.copy('src/AppRoot/AppRootModel.ts', 'src/AppRoot/AppRootModel.ts');

        this.mkdir(viewPath);
        this.template('src/View/View.html', viewPath + '/' + this.viewName + '.html');
        this.template('src/View/View.less', viewPath +'/' + this.viewName + '.less');
        this.template('src/View/ViewBase.ts', viewPath +'/' + this.viewName + 'Base.ts');
        this.template('src/View/ViewModel.ts', viewPath + '/' + this.viewName + 'Model.ts');
    },

    install: function() {
        var howToInstall =
            '\nAfter running `npm install & bower install`, inject your front end dependencies into' +
            '\nyour HTML by running:' +
            '\n' +
            chalk.yellow.bold('\n  gulp wiredep');

        if (this.options['skip-install']) {
            this.log(howToInstall);
            return;
        }
        var done = this.async();

        this.installDependencies({
            skipMessage: this.options['skip-install-message'],
            skipInstall: this.options['skip-install'],
            callback: function() {
                var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));

                // wire Bower packages to .html
                wiredep({
                    bowerJson: bowerJson,
                    directory: 'bower_components',
                    exclude: ['bootstrap-sass'],
                    src: 'app/index.html'
                });

                if (this.includeSass) {
                    // wire Bower packages to .scss
                    wiredep({
                        bowerJson: bowerJson,
                        directory: 'bower_components',
                        src: 'app/styles/*.scss'
                    });
                }

                done();
            }.bind(this)
        });
    }
});

function _toCamelCase(val) {
    val = val || '';

    val = val[0].toLowerCase() + val.substr(1);

    return val;
}