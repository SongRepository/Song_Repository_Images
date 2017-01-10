var _Path = require('path');
var _FileSystem = require('./../Song_Repository_Server/src/file-system');


var ImgManager = {
    list: [{
        name: 'github',
        site: 'https://songrepository.github.io/Song_Repository_Images/img/'
    }],
    _resolveUrl: function (url) {
        var result = {
            imgName: '',
            siteName: ''
        };
        if (url.indexOf('+') > (-1)) {
            var urls = url.split('+');
            result.siteName = urls[0];
            result.imgName = urls[1];
        } else {
            result.imgName = url;
        }
        return result;
    },
    _bulidLocalPath: function (imgName) {
        return __dirname + '/img/' + imgName;
    },
    _bulidLocalUrl: function (imgName) {
        return '/img/' + imgName;
    },
    _bulidRemoteUrl: function (siteName, imgName) {
        var result = imgName;
        ImgManager.list.forEach(function (item) {
            if (item.name === siteName) {
                result = item.site + imgName;
                return result;
            }
        });
        return result;
    },

    _exists: function (imgName) {
        var path = ImgManager._bulidLocalPath(imgName);
        return _FileSystem.existsSync(path);
    },
    _get: function (url) {
        var reuslt = '';
        var rResult = ImgManager._resolveUrl(url);
        if (rResult.siteName) {
            if (ImgManager._exists(rResult.imgName)) {
                reuslt = ImgManager._bulidLocalUrl(rResult.imgName);
            } else {
                reuslt = ImgManager._bulidRemoteUrl(rResult.siteName, rResult.imgName);
            }
        } else {
            reuslt = rResult.imgName;
        }
        return reuslt;
    },
    get: function (path, response) {
        var url = ImgManager._get(path);
        var result = {
            url : url
        };
        response.send(JSON.stringify(result));
    }
};


module.exports = exports = ImgManager;