//開いているタブの中でurl:[]に格納されているものから始まるURLをtabsに格納
const tabs=await chrome.tabs.query({
    url: [
        "https://developer.chrome.com/docs/webstore/*",
        "https://developer.chrome.com/docs/extensions/*",
    ]
})
//名前順に並び替え
const collator = new Intl.Collator();
tabs.sort((a,b)=>collator.compare(a.title,b.title));

const template=document.getElementById("li_template");

//Set(listみたいなもの)を定義
const elements=new Set();

//tabs内に格納されているすべてのtabに対して回す
for (const tab of tabs){
    //templateを使いまわしたいのでtabの数複製する
    const element=template.content.firstElementChild.cloneNode(true);
    //タイトルが"Chrome Extensions Tutorial: Reading time - Chrome Developers"
    //などとなっており、" - Chrome Developers"部分はいらないので取り除く作業をしている
    //.split("-")で["Chrome Extensions Tutorial: Reading time","-","Chrome Developers"]の３つの要素を持つリストになる。
    //.[0].trim()でリストの0番目を取り出す。
    //これによりタイトルを取得できた。
    const title = tab.title.split("-")[0].trim();
    //tab.urlでタブのurlを取得する。型はString
    //URL(tab.url)とすることでURLオブジェクトになる。
    //.pathnameとすることでURLのpath部分を取得する
    //例）URLが"https://developer.chrome.com/docs/extensions/mv3/getstarted/tut-focus-mode/"のとき
    //pahtは"/docs/extensions/mv3/getstarted/tut-focus-mode/"
    //.slice("/docs.length")とすることで"/docs"が先頭にあるとき取り除く。
    //これにより表示するURLを取得できた。
    const pathname = new URL(tab.url).pathname.slice("/docs".length);

    //element:(複製したtemplate)のプロパティを設定する
    element.querySelector(".title").textContent=title;
    element.querySelector(".pathname").textContent=pathname;
    //リスト中の特定のタブをクリックすると、実行
    element.querySelector("a").addEventListener("click",async()=>{
        //Chrome内で一番前に表示
        await chrome.tabs.update(tab.id,{active:true});
    //選択したタブがウィンドウとして後ろにある場合、一番前に表示
        await chrome.windows.update(tab.windowId,{focused:true});
    });
    //Set()を作ったelementsに格納
    elements.add(element);
}
//ulに入れる
document.querySelector("ul").append(...elements);
const button=document.querySelector("button");
button.addEventListener("click",async()=>{
    //取得したタブ:(tabs)のidを取り出し、tabIdに格納する
    const tabIds=tabs.map(({id})=>id);
    //取得したタブidをグループ化する（まだまとめてるだけ）
    const group=await chrome.tabs.group({tabIds});
    //.updateして更新する
    await chrome.tabGroups.update(group,{title:"extensions doc"});
});