# svg-sprite-generator development guide

## Development Pre-requisites

This nodejs project is built with grunt-cli and babel-cli

```
npm install -g grunt-cli
npm install -g babel-cli
```

## Testing

From the root folder, build the project (it will run babel to translate to es2015 and put files in the lib folder)

```
grunt
```

Running the code (you will have to re-build as above each time):

```
node ./test/run -d ./test/svg -o ./test/out.svg
```
