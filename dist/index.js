var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
var nodeFetch = require('node-fetch');
var path = require('path');
var express = require('express');
var requestIp = require('request-ip');
var PORT = process.env.PORT || 5001;
var BlogInfo = /** @class */ (function () {
    function BlogInfo() {
    }
    return BlogInfo;
}());
var app = express();
app.use(requestIp.mw());
app.get('/', function (req, res) {
    console.log(req.clientIp);
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/info', function (req, res) {
    console.log("Request IP address is " + req.clientIp);
    if (!req.clientIp.includes('185.199.111.153') && !req.clientIp.includes('127.0.0.1')) {
        console.log('IP Error');
        res.status(401).json({
            code: 401,
            data: 'Not allowed IP address'
        });
        return;
    }
    console.log("Request userId is " + req.query.userId);
    var url = "https://blog.csdn.net/" + req.query.userId + "/article/list/";
    var titleRegx = new RegExp('<span class="article-type type-.*?">\n.*?</span>\n(.*?)</a>', 'g');
    var regx = new RegExp('<span class="read-num">阅读数 <span class="num">(.*?)</span> </span>', 'g');
    var hasData = true;
    var result = [];
    function getInfo(i) {
        return __awaiter(this, void 0, void 0, function () {
            var response, body, titles, visits_1, pageData, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!hasData) {
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        console.log("Fetching page " + i);
                        return [4 /*yield*/, nodeFetch(url + i)];
                    case 2:
                        response = _a.sent();
                        return [4 /*yield*/, response.text()];
                    case 3:
                        body = _a.sent();
                        titles = body.match(titleRegx);
                        visits_1 = body.match(regx);
                        if (titles) {
                            pageData = titles.map(function (title, i) {
                                return {
                                    title: title.substring(63, title.length - 5).trim(),
                                    count: +visits_1[i].match(/\d+/)[0]
                                };
                            });
                            result = __spread(result, pageData);
                        }
                        else {
                            // null data, break
                            hasData = false;
                        }
                        return [3 /*break*/, 5];
                    case 4:
                        err_1 = _a.sent();
                        console.log('Error', err_1.message);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    }
    var pageLength = +req.query.pageNum || 10;
    var pages = __spread(new Array(pageLength).keys()).map(function (i) { return i + 1; });
    function processArray(array) {
        return __awaiter(this, void 0, void 0, function () {
            var e_1, _a, array_1, array_1_1, item, e_1_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 5, 6, 7]);
                        array_1 = __values(array), array_1_1 = array_1.next();
                        _b.label = 1;
                    case 1:
                        if (!!array_1_1.done) return [3 /*break*/, 4];
                        item = array_1_1.value;
                        return [4 /*yield*/, getInfo(item)];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        array_1_1 = array_1.next();
                        return [3 /*break*/, 1];
                    case 4: return [3 /*break*/, 7];
                    case 5:
                        e_1_1 = _b.sent();
                        e_1 = { error: e_1_1 };
                        return [3 /*break*/, 7];
                    case 6:
                        try {
                            if (array_1_1 && !array_1_1.done && (_a = array_1.return)) _a.call(array_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                        return [7 /*endfinally*/];
                    case 7:
                        console.log("Done, Fetch " + result.length + " posts");
                        res.set({
                            "Access-Control-Allow-Origin": "*"
                        });
                        res.json({
                            code: 200,
                            total: result.length,
                            data: result
                        });
                        return [2 /*return*/];
                }
            });
        });
    }
    processArray(pages);
});
app.listen(PORT, function () { return console.log("Example app listening on port " + PORT + "!"); });
