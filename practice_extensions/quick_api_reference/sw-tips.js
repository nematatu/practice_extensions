console.log("sw-tips.js");
console.log(Math.floor(Math.random()*700));
const updateTip=async()=>{
    //fetchで↓APIを取得
    const response=await fetch('https://extension-tips.glitch.me/tips.json');
    //.json()とすることでAPIの本体（たくさんのtips）をオブジェクト形式で代入
    const tips=await response.json();
    //これで確認できる
    console.log(tips);
    //indexの設定
    //tips.lengthは18
    //ランダム値は0以上1未満
    //ランダム値*18をして切り捨て
    const randomIndex=Math.floor(Math.random()*tips.length);
    //tipという名前でtipsのインデックス:ランダム値の要素を格納
    return chrome.storage.local.set({tip:tips[randomIndex]});
};

const ALARM_NAME='tip';

async function createAlarm(){
//chrome.alarmsとは定期的に作業を繰り返すやつ
//setTimeout()やsetInterval()でもいけるらしいが、service workerが終了したときタイマーが止まるらしく、alarmsを使ってるらしい
//tipという名前のalarmsを取得
    const alarm=await chrome.alarms.get(ALARM_NAME);
    //無いなら、作る
    if(typeof alarm==='undefined'){
        chrome.alarms.create(ALARM_NAME,{
            //アラームが設定されてから1分後に実行
            //1分間に1回以上実行はできない
            //delayInMinutesに1未満の値を指定しても、実行されるのは1分後
            delayInMinutes:1,
            //1440分 = １日後にもう一度実行
            periodInMinutes:1440
        });
        updateTip();
    }
}

createAlarm();
//アラームが鳴ったら: 一日立ったら=>実行
chrome.alarms.onAlarm.addListener(updateTip);
//runtime.sendMessageなどでメッセージを受け取ったら実行
//content.jsで送ってる
//content.jsはhttps://developer.chrome.com/docs/extensions/reference/*にアクセスしたら実行される
//つまり↑にアクセスしたら↓が実行される
//boolean
chrome.runtime.onMessage.addListener((message,sender,sendResponse)=>{
    //greetingがtipなら（{greeting:'tip'}というオブジェクトを送ってる）
    if(message.greeting==='tip'){
        //取り出したtipを応答として送信する
        chrome.storage.local.get('tip').then(sendResponse);
        //この行があることでストレージから値が取り出されるまで応答が保留される
        //よくわからん
        return true;
    }
})