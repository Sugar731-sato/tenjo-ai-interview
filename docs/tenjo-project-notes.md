# TENJO AIインタビュー プロジェクトメモ

会話の記録が残らないことがあるため、決定事項をここにまとめる。

## プロジェクトの目的

- [team-mirai/mirai-gikai](https://github.com/team-mirai/mirai-gikai)（AGPL-3.0）を fork して、金沢向けの「TENJO AIインタビュー」を作る。
- 非公式であること（政党チームみらいの運営ではないこと）の免責文を表示する。

## 方針

- テーマは、最初は `bills` テーブルの行を使う。
- DB は変更しない。
- 分析機能（topic-analysis、worker、Google Cloud）は、最初は使わない。

## 色

| 用途 | 色 |
|---|---|
| ベース | `#311915` |
| クリーム | `#FBF5E6` |
| 紙の白 | `#FFFDF7` |
| 吹き出し | `#F3EAD2` |
| 罫線 | `#E6DCC3` |
| 補助の文字 | `#5C5249` |
| アクセント | `#A4262C` |

賛否の色:

| 賛否 | 背景 | 文字 |
|---|---|---|
| 賛成 | `#E4EEE7` | `#1F6B4F` |
| 反対 | `#F4E1DE` | `#A4262C` |
| 中立 | `#EFEDE8` | `#5C5249` |

- 緑は、賛否の表示だけに使う。

## 形

- ボタン: カプセル形（`rounded-full`）
- テーマのカード: 角丸 8px
- バッジ: 角丸 4px
- 外側の大きなカード: 角丸 12px
- ほかの四角い枠: 角丸なし
- チャットの吹き出し:
  - AI側: 左上だけ小さい角（`4px 16px 16px 16px`）。丸い「AI」アバターを付ける。
  - ユーザー側: 右上だけ小さい角（`16px 4px 16px 16px`）

## 進め方のルール

- **TENJO の作業は `tenjo/main` から切る。`develop` は本家と同じに保つ。**（CLAUDE.md の「develop から分岐」より、こちらを優先する）
  - `develop` には、TENJO の変更を何も取り込まない。`.github/workflows/deploy.yml` は `develop` への push で本番 DB のマイグレーションとデプロイを動かすため。
  - 手順のブランチ（`tenjo/step-N`）は、PR で `tenjo/main` に取り込む。マージは「Create a merge commit」で行う。
- 手順ごとにブランチを切る（`tenjo/step-N`）。
- push は、オーナーの許可を得てから行う。
- 削除と、DB のマイグレーションの変更も、許可を得てから行う。
- 報告は日本語で行う。
- 開発サーバーとローカル Supabase は、オーナーが自分のターミナルで起動する（メモリ節約のため、Claude からは起動しない）。
- 削除などの作業は小さなステップに分け、1ステップごとに「変更 → 型チェック → テスト → コミット」を行う。テストはパッケージごとに順番に実行し（同時に実行しない）、`tests/supabase` などの統合テストも毎回実行する。
- 型チェックの前に、`corepack pnpm --filter web exec next typegen` と `corepack pnpm --filter admin exec next typegen` を実行する。ページや API を消したあと、`.next/types` に残った古い一覧で型チェックが落ちるため。
- 型チェックやテストが失敗したら、そこで止めて、原因と、変更前から失敗していたかを調べて報告する（勝手に直さない）。

## 本家に追いつく手順

```bash
git fetch upstream

# 1. develop を本家と同じにする（早送りだけ。TENJO の変更は入れない）
git switch develop
git merge --ff-only upstream/develop
git push origin develop

# 2. 本家の変更を、TENJO の土台に取り込むブランチを作る
git switch -c tenjo/sync-YYYYMMDD tenjo/main
git merge upstream/develop
# ぶつかった所を直し、typegen・型チェック・テストを通してコミットする

# 3. push して、tenjo/sync-YYYYMMDD → tenjo/main の PR を作る（push はオーナーの許可を得てから）
```

## 進捗

- 手順1〜3: 完了
- 手順4: 完了（色、フォント、角丸、ヘッダー・フッターの暗い背景、チャットの吹き出しと「AI」アバター、英語の小さなラベル、イラストのベージュ化、チャット画面の免責文）。`tenjo/step-4` は push 済み。
- 手順5: 完了（分析機能の削除。13コミット）。`tenjo/step-5` は未 push。
  - web: トピックの画面・API・表示用ファイルと `ai-chat.svg` を削除。法案ページの「◯件のご意見」は、レポート一覧と同じ読み込み（`getPublicBillRespondents`）で数える。
  - admin: トピック分析、分析ビューア、法案ごとのトピック分析、意見の後追い抽出、MCP の分析ツールを削除。シミュレーションが使う2つの関数は `interview-simulation` に移した。
  - worker（Cloud Run）、デプロイのワークフロー、`infra/cloud-run` を削除。
  - `packages/topic-analysis-core` は残した（web のレポート一覧と回答者カードが、公開用の読み取り部分を使うため）。DB は変更していない。
- 手順5b: 完了（インタビューに不要な機能の削除。`tenjo/step-5b`、未 push）。
  - web: 記事の誤り報告、チームみらいの賛否のカードと動画、法案の解説（本文）と難易度の案内、説明の詳しさの切り替え、「AIに質問する」チャット（インタビューが使う部分は残した）、トップの本家紹介、国会の会期（今の会期の枠・過去の会期・/kokkai）、附帯決議、審議ステータスの進み具合を削除。使われなくなったイラスト2枚も削除。
  - トップの「注目」の欄は、会期に関係なくいつも出す。
  - admin と MCP: 記事の誤り報告、動画、国会会期の管理（議案フォームの会期の欄も）、附帯決議、審議ステータス、賛否の速報画像、チームみらいの賛否を削除。
  - DB（マイグレーション、型、DB の関数）は変更していない。
- フォークの土台は `tenjo/main`（`develop` は本家と同じ）。手順2〜5は PR #1 で取り込み中。
