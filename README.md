# 怪談夜話アーカイブ

このリポジトリは GitHub Pages で公開する「怖い話・怪談ライブラリー」サイトの公開用リポジトリです。

ソース一式は `packed-source/source.b64.part*` に分割した `tar.gz` として格納し、GitHub Actions の `Deploy Kaidan Library` ワークフローで展開、検査、ビルド、Pages デプロイを行います。

## 公開URL

https://kohei-morita000.github.io/

## ローカル運用

完全な編集用ソースはローカル作業ディレクトリにあります。主なコマンドは以下です。

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run test
npm run content:check
```

## デプロイ内容

- Astro + TypeScript
- Markdown Content Collections
- Pagefind 全文検索
- localStorage お気に入り・履歴・閲覧設定
- 24本の初期オリジナル怪談
- RSS、sitemap、robots、構造化データ
