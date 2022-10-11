const request = require('sync-request');
const cheerio = require('cheerio');

module.exports = function(app) {
    /**
     * 通过爬虫抓取交易列表
     * @params {Object} req.query 
     * @params {String} req.query.a      查询的账号
     * @params {Number} req.query.p      页码 默认为 1
     * @params {Number} req.query.offset 每页数量 默认为 50
     */
    app.get('/',async(req, res)=> {
        const {a, p, offset} = req.query;
        if (!a) {
            return res.status(500).json({
                status: 500,
                result: [],
                message: '请输入需要查询的账号!'
            })
        }
        try {
            const response = await request('POST', 
            `https://cn.etherscan.com/txs?a=${a}&p=${p || 1 }`, {
                json:{
                    "__EVENTTARGET": "ctl00$ContentPlaceHolder1$ddlRecordsPerPage",
                    "__EVENTARGUMENT":"", 
                    "__LASTFOCUS": "",
                    "__VIEWSTATE": "nWImE5U0DED7Mov+Edc0PVUnDo56nBtzr2chb8Z/vapJJLQPefcKhtAu59pO31robEOagJmju+Kk38QBz/Kf+ZpBPCkU0f9ftNKM6iRnfM0=",
                    "__VIEWSTATEGENERATOR": "FCB51872",
                    "__EVENTVALIDATION": "cnK+BBTb4WJjPkdbFw5L/tsDJBtJ5HzJfJtUhjkGKLMGaWlV0NxH4xWYmAkfbRsurAnxdT5zsW0nI3JnrDEmU8iCNqa7GVX/8XWI0jTrdZorQ915mhqI1a5Dc2BfataYgGlSukddSryfGIt9cZk6ZmR2f3fIGy/bWMZF/+yMTPzmvZ78kRN7mr7pql/Uf+G1JfaSaXM6YPLMnpPEAIX5mg==",
                    "ctl00$ContentPlaceHolder1$ddlRecordsPerPage": offset || 50 
                }
            });
            const $ = cheerio.load(response.getBody('utf8'));
            const results = []; // 建立一个存储结果的容器
            const table_tr = $(".table tr");
            for (let i = 0; i < table_tr.length; i++) {
                const table_td =table_tr.eq(i).find('td');
                const TxnHash = table_td.eq(1).text();  // Txn Hash
                const Method = table_td.eq(2).text();   // Method
                const Block = table_td.eq(3).text();    // Block
                const Age = table_td.eq(5).text();      // Age
                const From = table_td.eq(6).text();     // From
                const To = table_td.eq(8).text();       // To
                const Value = table_td.eq(9).text();    // Value
                const TxnFee =table_td.eq(10).text();    // Txn Fee
                results.push(Object.assign({
                    TxnHash, 
                    Method, 
                    Block, 
                    Age, 
                    From, 
                    To, 
                    Value,
                    TxnFee
                }));
            }
            return res.status(200).json({
                status: 200,
                message: '查询成功',
                result:[
                    ...results
                ]
            })
        }
        catch (err) {
            return res.status(500).json({
                status: 500,
                message: err,
                result: []
            });
        }
    })

    
    /**
     * 通过获取地址(普通)交易列表
     * @params {Object} req.query 
     * @params {String} req.query.a      查询的账号
     * @params {String} req.query.sort   排序 默认为 desc
     * @params {Number} req.query.p      页码 默认为 1
     * @params {Number} req.query.offset 每页数量 默认为 50
     */
    app.get('/api', async (req, res) => {
    
        const {a, sort, p, offset} = req.query;
        if (!a) {
            return res.status(500).json({
                status: 500,
                result: [],
                message: '请输入需要查询的账号!'
            })
        }
        const uri =`http://api.etherscan.io/api?module=account&action=txlist&address=${a}&sort=${sort || 'desc'}&page=${p || 1}&offset=${offset || 10}`
        const response = await request('GET', uri)
        if (response.statusCode === 200) {
            const result = await JSON.parse(response.getBody('utf8'))
            return res.status(200).json({
                status: Number(result.status) === 0 ? 500 : 200,
                message: Number(result.status) === 0 ? '在没有密钥的情况下，支持每秒最多五次请求'  : '查询成功',
                result: [
                    ...result.result
                ]
            })
        } else {
            return res.status(500)
        }
    })

}