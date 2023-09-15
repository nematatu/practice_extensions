const article = document.querySelector("article");

//articleがあったら
if (article) {
  //articleの内容を取得
  const text = article.textContent;
  //正規表現
  //"/[^\s]"で空白文字以外を抽出
  //+/gでグローバルフラグを意味していて、すべてのテキストに対して実行する
  const wordMatchRegExp = /[^\s]+/g; 
  //article内のテキストに↑の正規表現で抽出
  //例）"This is example text."というテキストに実行すると
  //["This","is","example","text"]というリストが返される
  const words = text.matchAll(wordMatchRegExp);
  //リストの長さ
  const wordCount = [...words].length;
  //単語を200で割って四捨五入する
  const readingTime = Math.round(wordCount / 200);
  //<p>タグを作成
  const badge = document.createElement("p");
  //↑に"color-secondary-text", "type--caption"クラスを追加
  badge.classList.add("color-secondary-text", "type--caption");
  //<p>に入れるテキスト
  badge.textContent = `⏱️ ${readingTime} min read`;

  //
  const heading = article.querySelector("h1");
  // <time>の親タグを定義
  const date = article.querySelector("time")?.parentNode;
  //date（無かったらheading）の後ろにbadgeを挿入
  (date ?? heading).insertAdjacentElement("afterend", badge);
}