var http = require('http');
var fs = require('fs');

module.exports = {
    download: function(url, dest, cb) {
        var file = fs.createWriteStream(dest);
        file.on('open', function(fd) {
            var request = http.get(url, function(response) {
                response.pipe(file);
                file.on('finish', function() {
                    file.close(cb); // close() is async, call cb after close completes.
                });
            }).on('error', function(err) { // Handle errors
                fs.unlink(dest); // Delete the file async. (But we don't check the result)
                cb && cb(err.message);
            });
        });
    },
    listToTree: function(data, options) {
        options = options || {};
        var ID_KEY = options.idKey || 'id';
        var PARENT_KEY = options.parentKey || 'parent';
        var CHILDREN_KEY = options.childrenKey || 'children';

        var item, id, parentId;
        var map = {};
        for (var i = 0; i < data.length; i++) { // make cache
            if (data[i][ID_KEY]) {
                map[data[i][ID_KEY]] = data[i];
                data[i][CHILDREN_KEY] = [];
            }
        }
        for (var i = 0; i < data.length; i++) {
            if (data[i][PARENT_KEY]) { // is a child
                if (map[data[i][PARENT_KEY]]) // for dirty data
                {
                    map[data[i][PARENT_KEY]][CHILDREN_KEY].push(data[i]); // add child to parent
                    data.splice(i, 1); // remove from root
                    i--; // iterator correction
                } else {
                    data[i][PARENT_KEY] = 0; // clean dirty data
                }
            }
        };
        return data;
    }
}
