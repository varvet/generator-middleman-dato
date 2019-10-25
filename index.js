#!/usr/bin/env node

var fs = require('fs');
var _ = require('lodash');
var chalk = require('chalk');

const args = process.argv;
var module_type = _.snakeCase( args[3] );
var module_name = _.snakeCase( args[4] );
var module_dir = './source/modules/';
var scss_dir = './source/stylesheets/modules/';

if( args.length < 5 ) {
  return console.log( chalk.red('Not enough parameters, use: "middleman-dato g [type (m/p)] [module-name]".') )
}

if( module_type == 'm' ) { // Module
  if (!fs.existsSync(module_dir)) {
    fs.mkdirSync(module_dir);
  }
  var files = [{
      dir: module_dir,
      file_name: '_' + module_name + '.html.erb',
      content: '<!-- ' + _.upperCase(module_name) + ' -->\n' +
        '<div class="' + module_name + '">\n' +'\t' + _.upperCase(module_name) + '\n' +'</div>\n'
    },
    {
      dir: scss_dir,
      file_name: module_name + '.css.scss',
      content: '/* ' + _.upperCase(module_name) + ' */\n' +
        '.' + module_name + ' {\n}'
    }];

  _.forEach(files, function(f) {
    fs.writeFile(f.dir + f.file_name, f.content, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log( chalk.green('Created ' + f.dir + f.file_name + '!') );
    });
  });
}