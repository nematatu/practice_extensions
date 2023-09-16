console.log("sw-omnibox.js");
//拡張機能がインストールされたとき、拡張機能がアップデートされたとき、Chromeがアップデートされたときに実行される
//コールバック関数のプロパティに({reason})とすると、↑のうちどの理由でこの関数が実行されたかを出力する
chrome.runtime.onInstalled.addListener(({reason})=>{
    //実行理由がインストールされたときなら、
    if(reason==="install"){
        //ローカルにapiSuggestionsというキーで['tabs','storage','scripting']リストを格納する
        chrome.storage.local.set({
            apiSuggestions:['tabs','storage','scripting']
        })
    }
})

const URL_CHROME_EXTENSIONS_DOC=  'https://developer.chrome.com/docs/extensions/reference/';
const NUMBER_OF_PREVIOUS_SEARCHES=4;
//Omniboxで入力を変更するたびに実行
chrome.omnibox.onInputChanged.addListener(async(input,suggest)=>{
    //Omniboxどデフォルトのサジェストを設定している
    await chrome.omnibox.setDefaultSuggestion({
        description: 'Enter a Chrome API or choose from past searches'
      });
    //↑でローカルにapiSuggestionsというキーで保存したリストを取り出して格納
    const {apiSuggestions}=await chrome.storage.local.get('apiSuggestions');
    const suggestions=apiSuggestions.map((api)=>{
        //contentが、omniboxに貼り付けられる値
        //descriptionがサジェストに表示される値
        //今回の場合、tabs,storage,scriptingのいずれかが貼り付けられる
        return {content: api, description: `Open chrome.${api} API`};
    });
    //確認
    //tabs,storage,scriptingをサジェストに表示
    suggest(suggestions);
})

chrome.omnibox.onInputEntered.addListener((input)=>{
    //inputがomniboxに入力されている値
    //URL_CHROME_EXTENSIONS_DOCと合体したものをURLとして新たなタブを開く
    chrome.tabs.create({url:URL_CHROME_EXTENSIONS_DOC+input});
    updateHistory(input);
});

async function updateHistory(input){
    const {apiSuggestions}=await chrome.storage.local.get('apiSuggestions');
    //unshiftで配列の先頭に追加する
    //今回の場合、omniboxに入力された値が追加される
    apiSuggestions.unshift(input);
    //spliceの使い方
    //splice(start, deleteCount, item1)
    //で配列のstart番目の要素からdeleteCount個削除してitem1要素を追加する
    //const list = ['1', '2', '3'];
    //list.splice(2, 0, '4'); 
    //listの2番目は'3'で、そこから0個削除して'4'を追加するので
    //['1', '2', '3', '4']になる
    //NUMBER_OF_PREVIOUS_SEARCHESは4なので
    //配列の4番目以降を削除する（4番目も含む）
    apiSuggestions.splice(NUMBER_OF_PREVIOUS_SEARCHES);
    //保存しますよ
    //例）omniboxのサジェストでstorageを選ぶとstorageのreferenceタブを新規作成する
    //apiSuggestionsのリストは、[storage, tabs, storage,  scripting]になる
    return chrome.storage.local.set({apiSuggestions});
}