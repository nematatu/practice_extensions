//拡張機能がインストールされたら実行
chrome.runtime.onInstalled.addListener(() => {
    //拡張機能が表示される上のバーのアイコンにバッジテキストを"OFF"と表示
    chrome.action.setBadgeText({
      text: "OFF",
    });
  });

  const extensions = 'https://developer.chrome.com/docs/extensions'
  const webstore = 'https://developer.chrome.com/docs/webstore'
//拡張機能アイコンをクリックしたら実行
  chrome.action.onClicked.addListener(async(tab)=>{
    //タブのURLが上記２つから始まるなら、
    if(tab.url.startsWith(extensions)||tab.url.startsWith(webstore)){
        //そのタブの拡張機能バッジテキストを取得
        const prevState=await chrome.action.getBadgeText({tabId:tab.id});
        //↑がONならOFFを、OFFならONを代入する
        const nextState=prevState==='ON'?'OFF':'ON'

        //バッジテキストをセットする
        await chrome.action.setBadgeText({
            tabId:tab.id,
            text:nextState,
        });
        //バッジテキストがONなら
        if(nextState==="ON"){
            //focus_modeになるCSSを適用
            await chrome.scripting.insertCSS({
                files:["focus_mode.css"],
                target:{tabId:tab.id},
            });
        //バッジテキストがOFFなら
        }else if(nextState==="OFF"){
            //CSSを取り除く
            await chrome.scripting.removeCSS({
                files:["focus_mode.css"],
                target:{tabId:tab.id},
            });
        }
    }
  })