# WHY3K PLUGINS — 配布サイト

WHY3K が制作したオーディオプラグイン（VST / AU / Max for Live など）を無料配布するための静的サイトです。

## 構成

```
website/
├── index.html                       トップ（プラグイン一覧）
├── countuptimer.html                CountUpTimer 個別ページ
├── assets/
│   ├── style.css                    共通デザイン
│   └── downloads/
│       └── CountUpTimer_v1.1.zip    配布ファイル（.amxd + README同梱）
└── README.md                        このファイル
```

## ローカルで確認する

`index.html` をブラウザで直接開けば、そのまま表示されます（サーバー不要）。

## GitHub Pages で公開する手順

1. GitHub でアカウントを作る（無料）: https://github.com
2. 新しいリポジトリを作る。名前は例：`why3k-plugins`（Public にする）
3. この `website` フォルダの中身一式をアップロードする
   - ブラウザの「Add file → Upload files」に、フォルダ内のファイルをドラッグするだけでOK
4. リポジトリの **Settings → Pages** を開く
5. 「Build and deployment」→ Source を **Deploy from a branch** にし、
   Branch を **main / (root)** に設定して Save
6. 数分待つと `https://<ユーザー名>.github.io/why3k-plugins/` で公開される

### 独自ドメインを使いたい場合（任意）
Settings → Pages の「Custom domain」に取得したドメインを入力すれば設定できます。

## プラグインを追加するとき

1. `assets/downloads/` に新しい zip を置く
2. 個別ページ（`countuptimer.html` をコピーして中身を差し替え）を1枚作る
3. `index.html` の `.plugin-grid` にカードを1枚追加する

## 配布ファイルの差し替え（バージョンアップ）

`assets/downloads/` に新しい zip を置き、`countuptimer.html` の
ダウンロードリンク（`href="assets/downloads/..."`）とバージョン表記を更新する。

---

制作：WHY3K ／ 再配布・販売はご遠慮ください。
