var _ImgManager = require('./img-manager');
var _Assert = require("assert");


describe("img-manager", function () {

    describe('_resolveUrl', function () {
        it('', function () {
            var url = 'github+honey-and-clover-cover.jpeg';
            var url2 = 'honey-and-clover-cover.jpeg';

            var result = _ImgManager._resolveUrl(url);
            var result2 = _ImgManager._resolveUrl(url2);

            _Assert.equal(result.imgName, 'honey-and-clover-cover.jpeg');
            _Assert.equal(result.siteName, 'github');
            _Assert.equal(result2.imgName, 'honey-and-clover-cover.jpeg');
            _Assert.equal(result2.siteName, '');
        });
    });

    describe('_bulidLocalPath', function () {
        it('', function () {
            var imgName = 'honey-and-clover-cover.jpeg';
            var expect = __dirname + '/img/' + imgName;

            var result = _ImgManager._bulidLocalPath(imgName);

            _Assert.equal(result, expect);
        });
    });

    describe('_bulidLocalUrl', function () {
        it('', function () {
            var imgName = 'honey-and-clover-cover.jpeg';
            var expect = '/img/' + imgName;

            var result = _ImgManager._bulidLocalUrl(imgName);

            _Assert.equal(result, expect);
        });
    });

    describe('_bulidRemoteUrl', function () {
        it('', function () {
            var siteName = 'github';
            var imgName = 'honey-and-clover-cover.jpeg';
            var expect = 'https://songrepository.github.io/Song_Repository_Images/img/' + imgName;

            var result = _ImgManager._bulidRemoteUrl(siteName, imgName);

            _Assert.equal(result, expect);
        });
    });

    describe('_exists', function () {
        it('', function () {
            var imgName = 'honey-and-clover-cover.jpeg';
            var imgName2 = 'honey-and-clover-cover222.jpeg';

            var result = _ImgManager._exists(imgName);
            var result2 = _ImgManager._exists(imgName2);

            _Assert.equal(result, true);
            _Assert.equal(result2, false);
        });
    });

    describe('_get', function () {
        it('none github', function () {
            var url = 'honey-and-clover-cover.jpeg';
            var expect = url;

            var result = _ImgManager._get(url);

            _Assert.equal(result, expect);
        });

        it('has local img', function () {
            var imgName = 'honey-and-clover-cover.jpeg';
            var url = 'github+' + imgName;
            var expect ='/img/' + imgName;

            var result = _ImgManager._get(url);

            _Assert.equal(result, expect);
        });

        it('not has local img', function () {
            var imgName = 'honey-and-clover-cover---1.jpeg';
            var url = 'github+' + imgName;
            var expect = 'https://songrepository.github.io/Song_Repository_Images/img/' + imgName;

            var result = _ImgManager._get(url);

            _Assert.equal(result, expect);
        });
    });
});