获取阿里旅行的机票信息
===================

[![Build Status](https://travis-ci.org/derekhe/alitripAPI.svg?branch=master)](https://travis-ci.org/derekhe/alitripAPI)

运行测试

```javascript
grunt
```

使用

```javascript
var alitrip = require('alitrip');

//getFlight(出发地机场编码，到达地机场编码，日期)
alitrip.getFlight("CTU", "CAN", "2015-01-02").then(function(result){
    console.log(result);
});
```