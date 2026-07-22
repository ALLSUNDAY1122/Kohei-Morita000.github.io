# 境界夜話 公開サイト アクセシビリティ・実行時品質監査

- 実行日時: 2026-07-22T22:50:29.754Z
- 実行対象: https://allsunday1122.github.io/kyokai-yawa/
- 実行環境: chromium-desktop / webkit-mobile
- 対象: トップ・4シリーズ・単独作品・連作作品・読書記録
- アクセシビリティ: axe-core WCAG 2.1 A/AA
- 実行時監視: console.error・JavaScript例外・通信失敗・HTTP 4xx/5xx
- テスト結果: failed
- 成功: 12
- 失敗: 4
- スキップ: 0
- 所要時間: 81.2秒

## ページ別結果

| ブラウザー | ページ | 結果 | 時間 |
|---|---|---:|---:|
| chromium-desktop | / | passed | 4611ms |
| chromium-desktop | reading-log.html | passed | 3158ms |
| chromium-desktop | series/kansoku.html | passed | 2454ms |
| chromium-desktop | series/kurose.html | passed | 2429ms |
| chromium-desktop | series/makabe.html | passed | 2556ms |
| chromium-desktop | series/sakaki.html | passed | 2510ms |
| chromium-desktop | stories/kks-s1e01-sakaime-no-heya.html | passed | 2124ms |
| chromium-desktop | stories/mkb-001-taikin-kiroku-2514.html | passed | 2231ms |
| webkit-mobile | / | passed | 12352ms |
| webkit-mobile | reading-log.html | failed（再試行1） | 3356ms |
| webkit-mobile | series/kansoku.html | failed（再試行1） | 2928ms |
| webkit-mobile | series/kurose.html | passed（再試行1） | 3014ms |
| webkit-mobile | series/makabe.html | failed（再試行1） | 2995ms |
| webkit-mobile | series/sakaki.html | failed（再試行1） | 3197ms |
| webkit-mobile | stories/kks-s1e01-sakaime-no-heya.html | passed | 2508ms |
| webkit-mobile | stories/mkb-001-taikin-kiroku-2514.html | passed | 2518ms |

## エラー

### webkit-mobile / reading-log.html

```text
Error: 読書記録で品質問題を1件検出しました。
{
  "accessibility": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must meet minimum color contrast ratio thresholds",
      "nodes": [
        {
          "target": [
            ".brand > span"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 3.8 (foreground color: #81786d, background color: #1d1f23, font size: 8.6pt (11.52px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".hero > div > .eyebrow"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 2.34 (foreground color: #c4a56b, background color: #ffffff, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "#reading-log-title"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.23 (foreground color: #eee6d8, background color: #ffffff, font size: 29.4pt (39.200001px), font weight: normal). Expected contrast ratio of 3:1"
        },
        {
          "target": [
            ".lead"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 2.21 (foreground color: #b8ad9c, background color: #ffffff, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "#log-list-title"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 2.34 (foreground color: #c4a56b, background color: #ffffff, font size: 9.0pt (12px), font weight: bold). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "select[data-log-series=\"\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.
```
### webkit-mobile / series/kansoku.html

```text
Error: 境界観測記で品質問題を1件検出しました。
{
  "accessibility": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must meet minimum color contrast ratio thresholds",
      "nodes": [
        {
          "target": [
            "select[data-role=\"filter\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".read-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".save-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "select[data-role=\"sort\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        }
      ]
    }
  ],
  "consoleErrors": [],
  "pageErrors": [],
  "requestFailures": [],
  "badResponses": []
}
```
### webkit-mobile / series/makabe.html

```text
Error: 真壁夜話で品質問題を1件検出しました。
{
  "accessibility": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must meet minimum color contrast ratio thresholds",
      "nodes": [
        {
          "target": [
            "select[data-role=\"filter\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".read-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".save-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "select[data-role=\"sort\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        }
      ]
    }
  ],
  "consoleErrors": [],
  "pageErrors": [],
  "requestFailures": [],
  "badResponses": []
}
```
### webkit-mobile / series/sakaki.html

```text
Error: 榊怪異相談所で品質問題を1件検出しました。
{
  "accessibility": [
    {
      "id": "color-contrast",
      "impact": "serious",
      "help": "Elements must meet minimum color contrast ratio thresholds",
      "nodes": [
        {
          "target": [
            "select[data-role=\"filter\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".read-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            ".save-status-select"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        },
        {
          "target": [
            "select[data-role=\"sort\"]"
          ],
          "summary": "Fix any of the following:\n  Element has insufficient color contrast of 1.11 (foreground color: #000000, background color: #13110f, font size: 12.0pt (16px), font weight: normal). Expected contrast ratio of 4.5:1"
        }
      ]
    }
  ],
  "consoleErrors": [],
  "pageErrors": [],
  "requestFailures": [],
  "badResponses": []
}
```
