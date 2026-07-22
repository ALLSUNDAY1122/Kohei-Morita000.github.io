# 境界夜話 公開サイト オフライン・PWA 実ブラウザー監査

- 実行日時: 2026-07-22T23:33:18.447Z
- 実行対象: https://allsunday1122.github.io/kyokai-yawa/
- 実行環境: chromium-desktop / webkit-mobile
- 対象操作: Service Worker登録・事前保存・閲覧済み作品再読・未保存ページのオフライン案内・読書記録のオフライン表示・manifest/icon配信
- テスト領域: 実行ごとに独立したブラウザー保存領域
- テスト結果: failed
- 成功: 7
- 失敗: 3
- スキップ: 0
- 所要時間: 41.4秒

## ケース別結果

| ブラウザー | テスト | 結果 | 時間 |
|---|---|---:|---:|
| chromium-desktop | offline-pwa.spec.mjs › manifestとアプリアイコンが公開されている | passed | 1082ms |
| chromium-desktop | offline-pwa.spec.mjs › Service Workerが登録され、PWA共通資産を事前保存する | passed | 1207ms |
| chromium-desktop | offline-pwa.spec.mjs › 一度開いた作品を通信遮断後も本文付きで再読できる | passed | 1202ms |
| chromium-desktop | offline-pwa.spec.mjs › 未保存の作品は通信遮断時にオフライン案内を表示する | passed | 752ms |
| chromium-desktop | offline-pwa.spec.mjs › 読書記録ページを未訪問でもオフラインで開ける | passed | 988ms |
| webkit-mobile | offline-pwa.spec.mjs › manifestとアプリアイコンが公開されている | passed | 2862ms |
| webkit-mobile | offline-pwa.spec.mjs › Service Workerが登録され、PWA共通資産を事前保存する | passed | 18482ms |
| webkit-mobile | offline-pwa.spec.mjs › 一度開いた作品を通信遮断後も本文付きで再読できる | failed（再試行1） | 1441ms |
| webkit-mobile | offline-pwa.spec.mjs › 未保存の作品は通信遮断時にオフライン案内を表示する | failed（再試行1） | 1382ms |
| webkit-mobile | offline-pwa.spec.mjs › 読書記録ページを未訪問でもオフラインで開ける | failed（再試行1） | 1295ms |

## エラー

- webkit-mobile / offline-pwa.spec.mjs › 一度開いた作品を通信遮断後も本文付きで再読できる: Error: page.reload: WebKit encountered an internal error
- webkit-mobile / offline-pwa.spec.mjs › 未保存の作品は通信遮断時にオフライン案内を表示する: Error: page.goto: WebKit encountered an internal error
- webkit-mobile / offline-pwa.spec.mjs › 読書記録ページを未訪問でもオフラインで開ける: Error: page.goto: WebKit encountered an internal error
