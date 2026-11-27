# TENJO リブランドの TODO

あとの手順でまとめて行う作業を、ここに書きためる。削除はオーナーの許可を得てから行う。

## 手順5で削除

- [x] `web/public/icons/ai-chat.svg`: チャットの AI 側の表示を、丸い「AI」アバター(`MessageAiAvatar`)に置き換えたため、どこからも参照されなくなった(`5092eee7`)。(手順5の W4 で削除済み)

## 手順5で見つかった、あとで判断すること

- [ ] `.dockerignore`: worker の Docker イメージ専用だった。worker を削除したので不要だが、手順5の計画に入っていなかったため残した。
- [ ] `packages/topic-analysis-core` の、分析を実行する部分（`analyze`、`backfill`、`tag-backfill` など）: 使う側はなくなったが、パッケージは公開用の読み取り部分のために残した。切り分けるかどうか。
- [ ] `web/src/features/interview-report/server/loaders/get-public-reports-by-bill-id.ts` の `getPublicReportsByBillId`: 法案ページの件数の読み込みを替えたため、本体のコードからは使われなくなった。
- [ ] `docs/` のトピック分析の設計ドキュメント5本: 経緯の記録として残している。
- [ ] 手順5b の候補: オープンデータ API と developers のページ、MCP 全体、会期の表示（`diet-sessions`、`/kokkai`）、チームみらいの賛否のカード（`mirai-stance`）、開発用のプレビュー画面（`/dev`）。
