# Notes for CS 260 Winter 2024

## Git Notes

```git clone https://github.com/berreys/startup``` - Clones repository to local directory

```git pull``` - Pulls from repository to local copy

```git commit``` - Commits local changes

```git push``` - Pushes commits to repository


## IP Address
http://34.198.68.87/

ssh -i production.pem ubuntu@34.198.68.87

## Deploy Command

```./deployFiles.sh -k "C:\Users\saber\Desktop\Winter 2024\CS 260\production.pem" -h venmo-calc.click -s startup```

## Node main steps

1) Create your project directory

2) Initialize it for use with NPM by running npm init -y

3) Make sure .gitignore file contains node_modules

4) Install any desired packages with npm install <package name here>

5) Add require('<package name here>') to your application's JavaScript

6) Use the code the package provides in your JavaScript

7) Run your code with node index.js