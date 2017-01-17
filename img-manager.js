var _Path = require('path');
var _FileSystem = require('./../Song_Repository_Server/src/file-system');

var IMAGES_ROOT = __dirname + '/img/';

var ImageFileList = function () {
    var self = this;
    self.list = {};
    return self;
};
/**
 * @param fileName      Acchi-Kocchi-Cover.jpg
 * @param filePath      /img/Acchi-Kocchi-Cover.jpg
 */
ImageFileList.prototype.pushImg = function (fileName, filePath) {
    this.list[fileName.toLowerCase()] = filePath;
};
ImageFileList.prototype.getImg = function (fileName) {
    return this.list[fileName.toLowerCase()];
};
ImageFileList.prototype.exists = function (fileName) {
    return this.get(fileName);
};
ImageFileList.prototype.count = function () {
    var count = 0;
    for (var item in this.list) {
        count++;
    }
    return count;
};
ImageFileList.prototype.setList = function (imgList) {
    if (imgList) {
        this.list = imgList;
    }
};
ImageFileList.prototype.getList = function () {
    return this.list;
};


var ImageMonitor = function () {
    var self = this;
    self._ImageFileList = new ImageFileList();

    self._scanDir(IMAGES_ROOT);
    setInterval(function () {
        self._scanDir(IMAGES_ROOT);
        var now = new Date().toLocaleString();
        console.log("ImageMonitor auto scan dir. Time: " + now);
    }, 5 * 60 * 1000);

    return self;
};
ImageMonitor.prototype._scanDir = function (dirPath) {
    var self = this;
    var dir = _FileSystem.readDir(dirPath);
    dir.forEach(function (fileName) {
        var filePath = _Path.join(dirPath, fileName);
        if (_FileSystem.isDirectory(filePath)) {
            self._scanDir(filePath);
        } else if (_FileSystem.isFile(filePath)) {
            // var baseFileName = _FileSystem.getFileBaseName(fileName);
            self._ImageFileList.pushImg(fileName, filePath);
        }
    });
};
ImageMonitor.prototype.ImageFileList = function () {
    return this._ImageFileList;
};


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
            url: url
        };
        response.send(JSON.stringify(result));
    }
};


var ImgManager2 = {
    _ImageMonitor: new ImageMonitor(),

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
    _bulidLocalUrl: function (filePath) {
        var result = _FileSystem.resolvePath(filePath, IMAGES_ROOT);
        result = _Path.join('/img/', result);
        return result.replace(/\\/g, '/');
    },

    _findImg: function (fileName) {
        var imageFileList = ImgManager2._ImageMonitor.ImageFileList();
        var filePath = imageFileList.getImg(fileName);
        if (filePath) {
            return ImgManager2._bulidLocalUrl(filePath);
        } else {
            return '';
        }
    },
    _get: function (url) {
        var reuslt = '';
        var rResult = ImgManager2._resolveUrl(url);
        if (rResult.siteName) {
            var localUrl = ImgManager2._findImg(rResult.imgName);
            if (localUrl) {
                reuslt = localUrl;
            } else {
                reuslt = ImgManager2._bulidRemoteUrl(rResult.siteName, rResult.imgName);
            }
        } else {
            reuslt = rResult.imgName;
        }
        return reuslt;
    },
    get: function (fileName, response) {
        var result = {
            url: ''
        };
        result.url = ImgManager2._get(fileName);
        response.send(JSON.stringify(result));
    }
};

module.exports = exports = ImgManager2;