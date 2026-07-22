# 境界夜話 公開サイト品質定期監査 設定監査

- 定期実行: 毎日06:45 JST
- 追加実行: 公開読書監査完了後・設定変更時・手動
- ブラウザー: Chromium desktop / WebKit mobile
- 対象ページ: トップ・4シリーズ・単独作品・連作作品・読書記録
- 実行ケース: 8ページ×2ブラウザー＝16件
- アクセシビリティ: axe-core WCAG 2.1 A/AA
- 実行時監視: console.error・JavaScript例外・通信失敗・HTTP 4xx/5xx
- 再試行: 最大1回
- 実行上限: 20分
- 失敗資料: HTML・trace・screenshot・videoを14日保存
- エラー: 0
- 警告: 0

## エラー

- なし

## 警告

- なし
