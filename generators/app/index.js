'use strict';
const Generator = require('yeoman-generator');
let glob = require("glob");
let _ = require('lodash');
let mkdirp = require('mkdirp');

module.exports = class extends Generator {
  async prompting() {
    // Have Yeoman greet the user.
    this.log(`Heeeeeey! Great seeing you here mate 🤠`);

    var prompts = [
      {
        type: 'input',
        name: 'appname',
        message: 'Your project name'
      },
      {
        type: 'input',
        name: 'datoToken',
        message: 'Your DatoCMS API token'
      }
    ];

    return this.prompt(prompts).then(function (props) {
      // To access props later use this.props.someAnswer;
      props.realname = props.appname;
      props.appname = _.snakeCase( props.appname );
      this.props = props;
    }.bind(this));
  }

  async writing(prompts) {
    let t = this
    let templateFiles = {
    'config.rb': 'config.rb',
    'Gemfile': 'Gemfile',
    'Gemfile.lock': 'Gemfile.lock',
    'README.md': 'README.md',
    'source/index.html.erb': 'source/index.html.erb',
    'source/layouts/layout.erb': 'source/layouts/layout.erb',
    'lib/block_resolver.rb': 'lib/block_resolver.rb',
    '.gitkeep': '.gitkeep'
    }

    let templateFilesWithRender = {
      '.env': '.env'
    }

    glob('**/*.{js,scss,css,.}', {
      cwd: t.templatePath()
    }, function (er, files) {
      _.forEach( files, function(file) {
        if( !templateFiles[file] ) {
          t.fs.copyTpl(
            t.templatePath(file),
            t.destinationPath(file), {
              props: t.props
            }
          );
        }
      });
    });

    glob('**/*.{jpg,png,gif,md,woff,eot,svg,ttf}', {
      cwd: t.templatePath()
    }, function (er, files) {
      _.forEach( files, function(file) {
        if( !templateFiles[file] ) {
          t.fs.copy(
            t.templatePath(file),
            t.destinationPath(file)
          );
        }
      });
    });
    
    _.forEach( templateFiles, function(source, target) {
      t.fs.copy(
        t.templatePath(target),
        t.destinationPath(source), {
          props: t.props
        }
      );
    });

    _.forEach( templateFilesWithRender, function(source, target) {
      t.fs.copyTpl(
        t.templatePath(target),
        t.destinationPath(source), {
          props: t.props
        }
      );
    });

    // Make empty folders
    mkdirp.sync('source/stylesheets/modules');
    mkdirp.sync('source/modules');
  }

  async install() {
    this.spawnCommand('bundle', ['install']);
  }
};
