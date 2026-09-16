// ===== preRule: 专属Vercel代理参数版 =====
var headers = {'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36'};

// ⚠️ 你的专属 Vercel 域名
var PROXY_DOMAIN = 'https://my-hiker-proxy.vercel.app';

function b64decode(str){
    try{ if(typeof Base64 !== 'undefined' && Base64.decode){ var r = Base64.decode(str); if(r) return r; } }catch(e){}
    try{
        var bin = atob(str);
        var out = '';
        for(var i=0;i<bin.length;){
            var c = bin.charCodeAt(i++);
            if(c < 128) out += String.fromCharCode(c);
            else if(c < 224) out += String.fromCharCode(((c&31)<<6) | (bin.charCodeAt(i++)&63));
            else if(c < 240) out += String.fromCharCode(((c&15)<<12) | ((bin.charCodeAt(i++)&63)<<6) | (bin.charCodeAt(i++)&63));
            else i+=3;
        }
        return out;
    }catch(e){}
    return '';
}

var words = [];
var suffixes = [];

// 1. 通过代理抓入口站并解码（注意 URL 拼接方式已改为 ?url=）
try {
    var entryProxyUrl = PROXY_DOMAIN + '/api/proxy?url=' + encodeURIComponent('http://www.ymbdqdtoo.cc/');
    var entryHtml = fetch(entryProxyUrl, {headers: headers});
    
    if(entryHtml){
        var b64m = entryHtml.match(/Base64\.decode\(['"]([A-Za-z0-9+\/=]+)['"]\)/);
        if(b64m){
            var decoded = b64decode(b64m[1]);
            if(decoded){
                var wm = decoded.match(/words\s*=\s*['"]([^'"]+)['"]/);
                if(wm) words = wm[1].split(',');
                var seen = {};
                var re = /\.([a-z0-9]{4,}\.cc)\b/g;
                var m;
                while((m = re.exec(decoded)) !== null){
                    var suf = '.' + m[1];
                    if(!seen[suf]){ seen[suf]=1; suffixes.push(suf); }
                }
            }
        }
    }
} catch(e) {}

if(words.length < 10) {
    words = 'abandon,ability,able,above,abroad,absence,absorb,abuse,accept,access,account,accuse,achieve,acid,acquire,across,act,action,active,actor,actress,actual,ad,adapt,add,address,adjust,admire,admit,adopt,adult,advance,advice,advise,adviser,affair,affect,afford,afraid,african,after,again,against,age,agency,agenda,agent,ago,agree,ah,ahead,aid,aide,aids,air,airline,airport,album,alcohol,alive,all,allow,ally,almost,alone,already,also,alter,always,am,amazing,among,amount,analyst,analyze,ancient,and,anger,angle,angry,animal,annual,another,answer,anxiety,any,anybody,anymore,anyone,anyway,apart,appeal,appear,apple,apply,appoint,approve,arab,area,argue,arise,arm,armed,army,around,arrange,arrest,arrival,arrive,art,article,artist,as,asian,aside,ask,asleep,aspect,assault,assert,assess,asset,assign,assist,assume,assure,at,athlete,attach,attack,attempt,attend,attract,author,auto,average,avoid,award,aware,away,awful,baby,back,bad,badly,bag,bake,balance,ball,ban,band,bank,bar,barely,barrel,barrier,base,basic,basis,basket,battery,battle,be,beach,bean,bear,beat,beauty,because,become,bed,beer,before,begin,behind,being,belief,believe,bell,belong,below,belt,bench,bend,beneath,benefit,beside,besides,best,bet,better,between,beyond,bible,big,bike,bill,billion,bind,bird,birth,bit,bite,black,blade,blame,blanket,blind,block,blood,blow,blue,board,boat,body,bomb,bombing,bond,bone,book,boom,boot,border,born,borrow,boss,both,bother,bottle,bottom,bowl,box,boy,brain,branch,brand,bread,break,breast,breath,breathe,brick,bridge,brief,briefly,bright,bring,british,broad,broken,brother,brown,brush,buck,budget,build,bullet,bunch,burden,burn,bury,bus,busy,but,butter,buy,buyer,by'.split(',');
}
if(!suffixes.length) {
    suffixes = ['.artgvtdac.cc', '.asdqdorb.cc', '.mzslngyu.cc', '.aotpmvbq.cc'];
}

// 2. 生成候选域名
var candidates = [];
for(var s = 0; s < suffixes.length; s++){
    for(var k = 0; k < 5; k++){
        candidates.push(words[Math.floor(Math.random() * words.length)] + suffixes[s]);
    }
}
candidates = candidates.concat(['beer.mzslngyu.cc', 'award.artgvtdac.cc', '8.aotpmvbq.cc']);

var host = '';

// 3. 通过代理寻找可用域名（注意 URL 拼接方式已改为 ?url=）
for(var c = 0; c < candidates.length; c++){
    try {
        var target = 'http://' + candidates[c] + '/category/mrds/';
        var proxyUrl = PROXY_DOMAIN + '/api/proxy?url=' + encodeURIComponent(target);
        var r = fetch(proxyUrl, {headers: headers});
        if(r && r.length > 2000 && r.indexOf('每日大赛') > -1){
            // 找到可用域名后，host 存完整拼接表达式
            host = PROXY_DOMAIN + '/api/proxy?url=' + encodeURIComponent('http://' + candidates[c]);
            break;
        }
    } catch(e) {
        continue;
    }
}

if(!host) {
    host = PROXY_DOMAIN + '/api/proxy?url=' + encodeURIComponent('http://beer.mzslngyu.cc');
}

toast('代理通道: ' + host);
initConfig({host: host});
