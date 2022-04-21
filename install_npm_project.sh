#!/bin/bash
git init
npm init -y

# webpack general
npm i --save-dev webpack webpack-cli webpack-dev-server webpack-merge html-webpack-plugin clean-webpack-plugin copy-webpack-plugin

# babel
npm i --save-dev babel-loader @babel/core @babel/preset-env

# eslint
npm i --save-dev eslint eslint-webpack-plugin @babel/eslint-parser

# sass & css
npm i --save-dev sass-loader sass style-loader css-loader mini-css-extract-plugin

# typeScript
npm i --save-dev typescript ts-loader @typescript-eslint/parser @typescript-eslint/eslint-plugin @types/web
