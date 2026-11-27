# TENJO リブランドの TODO

あとの手順でまとめて行う作業を、ここに書きためる。削除はオーナーの許可を得てから行う。

## 手順5で削除

- [x] `web/public/icons/ai-chat.svg`: チャットの AI 側の表示を、丸い「AI」アバター(`MessageAiAvatar`)に置き換えたため、どこからも参照されなくなった(`5092eee7`)。(手順5の W4 で削除済み)

## 手順5で見つかった、あとで判断すること

- [ ] `.dockerignore`: worker の Docker イメージ専用だった。worker を削除したので不要だが、手順5の計画に入っていなかったため残した。
- [ ] `packages/topic-analysis-core` の、分析を実行する部分（`analyze`、`backfill`、`tag-backfill` など）: 使う側はなくなったが、パッケージは公開用の読み取り部分のために残した。切り分けるかどうか。
- [ ] `web/src/features/interview-report/server/loaders/get-public-reports-by-bill-id.ts` の `getPublicReportsByBillId`: 法案ページの件数の読み込みを替えたため、本体のコードからは使われなくなった。
- [ ] `docs/` のトピック分析の設計ドキュメント5本: 経緯の記録として残している。
- [x] 手順5b の候補（会期の表示、チームみらいの賛否のカードなど）: 手順5b で削除済み。

## 手順5b で見つかった、あとで判断すること

- [ ] あとで判断すると決めたもの: オープンデータ API と /developers、MCP 全体、開発用の画面（/dev）、`topic-analysis-core` の分析を実行する部分。
  - `/developers/interview-data-terms` の本文には、本家の URL（gikai.team-mir.ai）が書かれている。
- [ ] 画面を消したあとに残った、データを読む側のコード（DB は触らないため残した）:
  - web の `bill-repository.ts`: `findComingSoonBills`、`findPublishedSupplementaryResolutionsByBillId` など。
  - 法案の読み込みは、賛否（`mirai_stance`）や本文（`content`）も読み続けている。
  - admin の `bill-edit-repository.ts` の動画の更新、`findBillsWithDietSessions`（会期の名前を結合して読む）。
  - キャッシュのタグ `DIET_SESSIONS`。
- [ ] 難易度: 切り替えの画面はなくしたが、データの部分（`bill-difficulty` の型、`get-difficulty-level`、`middleware.ts` の処理）は残している。いつも「ふつう」の文章になる。
- [ ] web の `package.json` で使われなくなった可能性がある依存: `remark-breaks`、`remark-parse`、`remark-rehype`、`unified`、`hast-util-to-jsx-runtime`（法案の本文の表示で使っていた）。
