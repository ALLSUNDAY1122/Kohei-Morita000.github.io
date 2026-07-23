# 境界夜話 公開サイト読書機能 実ブラウザー監査

- 実行日時: 2026-07-23T02:11:08.646Z
- 実行対象: https://allsunday1122.github.io/kyokai-yawa/
- 実行環境: chromium-desktop / webkit-mobile
- 対象操作: トップ/シリーズ検索・読了/保存絞り込み・個別化入口・読書記録検索/状態管理/途中再開・読了切替・あとで読む・途中位置保存/再開・自動読了・次の未読・JSON書き出し/追加復元/置換復元・不正JSON拒否・画面反映
- Service Worker: 試験中は無効化し、現在配信中のHTML・JavaScriptを直接検証
- テスト結果: passed
- 成功: 31
- 失敗: 0
- スキップ: 1
- 所要時間: 40.8秒

## ケース別結果

| ブラウザー | テスト | 結果 | 時間 |
|---|---|---:|---:|
| chromium-desktop | reading-backup.spec.mjs › JSON書き出しに読了・履歴・保存・途中位置・文字サイズを収録する | passed | 802ms |
| chromium-desktop | reading-backup.spec.mjs › モバイル幅でバックアップ操作が横にはみ出さずタップできる | skipped | 246ms |
| chromium-desktop | reading-backup.spec.mjs › 壊れたJSONを拒否し、現在の記録を変更しない | passed | 551ms |
| chromium-desktop | reading-backup.spec.mjs › 未知の作品IDを含むJSONを拒否し、復元確認を表示しない | passed | 591ms |
| chromium-desktop | reading-backup.spec.mjs › 置換復元で旧記録と旧途中位置を消し、バックアップ状態だけを表示する | passed | 1308ms |
| chromium-desktop | reading-backup.spec.mjs › 追加復元で現在記録を残し、より進んだ途中位置と画面件数を反映する | passed | 1277ms |
| chromium-desktop | reading-discovery.spec.mjs › シリーズページで検索・保存絞り込みを適用し、条件内の次の未読作品へ移動する | passed | 780ms |
| chromium-desktop | reading-discovery.spec.mjs › トップページで検索条件・読了・保存・並べ替えを組み合わせ、URLと表示件数を同期する | passed | 2662ms |
| chromium-desktop | reading-discovery.spec.mjs › 再訪履歴から続き・最近・保存・未読おすすめを重複なく表示する | passed | 742ms |
| chromium-desktop | reading-discovery.spec.mjs › 履歴がない初回訪問では個別化欄と続きナビを表示しない | passed | 650ms |
| chromium-desktop | reading-log-management.spec.mjs › 読書記録カードから読了とあとで読むを変更し、集計と絞り込みへ即時反映する | passed | 544ms |
| chromium-desktop | reading-log-management.spec.mjs › 読書記録で検索・シリーズ・保存状態・公開順を組み合わせ、URLと件数を同期する | passed | 493ms |
| chromium-desktop | reading-log-management.spec.mjs › 途中までの作品だけを表示し、保存位置から再開して条件をリセットする | passed | 652ms |
| chromium-desktop | reading-state.spec.mjs › 作品ページの読了とあとで読むを切り替え、読書記録へ即時反映する | passed | 1230ms |
| chromium-desktop | reading-state.spec.mjs › 本文末尾で自動読了し、途中位置を削除して次の未読作品へ進める | passed | 2000ms |
| chromium-desktop | reading-state.spec.mjs › 途中位置を保存し、ボタンとresume=1の両方から再開する | passed | 1079ms |
| webkit-mobile | reading-backup.spec.mjs › JSON書き出しに読了・履歴・保存・途中位置・文字サイズを収録する | passed | 4252ms |
| webkit-mobile | reading-backup.spec.mjs › モバイル幅でバックアップ操作が横にはみ出さずタップできる | passed | 687ms |
| webkit-mobile | reading-backup.spec.mjs › 壊れたJSONを拒否し、現在の記録を変更しない | passed | 691ms |
| webkit-mobile | reading-backup.spec.mjs › 未知の作品IDを含むJSONを拒否し、復元確認を表示しない | passed | 704ms |
| webkit-mobile | reading-backup.spec.mjs › 置換復元で旧記録と旧途中位置を消し、バックアップ状態だけを表示する | passed | 1488ms |
| webkit-mobile | reading-backup.spec.mjs › 追加復元で現在記録を残し、より進んだ途中位置と画面件数を反映する | passed | 1762ms |
| webkit-mobile | reading-discovery.spec.mjs › シリーズページで検索・保存絞り込みを適用し、条件内の次の未読作品へ移動する | passed | 1081ms |
| webkit-mobile | reading-discovery.spec.mjs › トップページで検索条件・読了・保存・並べ替えを組み合わせ、URLと表示件数を同期する | passed | 1981ms |
| webkit-mobile | reading-discovery.spec.mjs › 再訪履歴から続き・最近・保存・未読おすすめを重複なく表示する | passed | 1249ms |
| webkit-mobile | reading-discovery.spec.mjs › 履歴がない初回訪問では個別化欄と続きナビを表示しない | passed | 980ms |
| webkit-mobile | reading-log-management.spec.mjs › 読書記録カードから読了とあとで読むを変更し、集計と絞り込みへ即時反映する | passed | 810ms |
| webkit-mobile | reading-log-management.spec.mjs › 読書記録で検索・シリーズ・保存状態・公開順を組み合わせ、URLと件数を同期する | passed | 747ms |
| webkit-mobile | reading-log-management.spec.mjs › 途中までの作品だけを表示し、保存位置から再開して条件をリセットする | passed | 766ms |
| webkit-mobile | reading-state.spec.mjs › 作品ページの読了とあとで読むを切り替え、読書記録へ即時反映する | passed | 2256ms |
| webkit-mobile | reading-state.spec.mjs › 本文末尾で自動読了し、途中位置を削除して次の未読作品へ進める | passed | 1174ms |
| webkit-mobile | reading-state.spec.mjs › 途中位置を保存し、ボタンとresume=1の両方から再開する | passed | 1455ms |

## エラー

- なし
