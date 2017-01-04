# tinyPNG-webpack

a img compress plugin use with tinyPNG for webpack.

## get tinyPNG key

[link](https://tinypng.com/developers)

## Installation

`$ npm install tinyPNG-webpack --save-dev`

## Example Webpack Config

```javascript
var tinyPngWebpackPlugin = require('tinypng-webpack-plugin');

    //in your webpack plugins array
    module.exports = {
      plugins: [
          new tinyPngWebpackPlugin({
              key:"your tinyPNG key",
              relativePath:"./img/"//can be array,is relative path to output.puth
          })
      ]
    }
```
## Usage
```javascript
new tinyPngWebpackPlugin({
    key:"your tinyPNG key",
    relativePath:"./img/",//can be array,is relative path to output.puth
    ext: ['png', 'jpeg', 'jpg']//img ext name
})
```
### Options Description
* key: Required, tinyPNG key
* relativePath: not Required, to your img dir,relative to your webpack output path.
* ext: not Required, to be compress img ext name.

### defaults Options
```javascript
    {
        key:'',
        relativePath:'./',
        ext: ['png', 'jpeg', 'jpg']
    }
```

## License
http://www.opensource.org/licenses/mit-license.php
