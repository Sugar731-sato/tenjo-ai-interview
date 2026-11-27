# イラストの塗り替え

イラスト3枚の緑の塗りを、1色に塗り替えます。黒い線・白・水玉の形は元のままです。macOS 専用です(swiftc と python3 を使います)。

- `web/public/illustrations/interview-illustration.png`
- `web/public/images/readingbook_woman_green.png`
- `web/public/illustrations/inspiration-simple-green.svg`(中に埋め込まれた PNG を塗り替えます)

## 使い方

```bash
scripts/tenjo/recolor-illustrations/recolor-illustrations.sh            # 既定の色(COLOR = E6DCC3)
scripts/tenjo/recolor-illustrations/recolor-illustrations.sh D9C9A3     # 色を指定
```

- 色は、引数か、`recolor-illustrations.sh` の先頭の定数 `COLOR` で変えられます。
- 元の緑のイラストは、`SOURCE_REF` のコミットから取り出します。何度実行しても、緑から塗り直します。
- 実行すると、リポジトリのファイルを直接上書きします。結果は `git diff` で確認してから、コミットしてください。

## ベージュを #D9C9A3 に変えるとき

`scripts/tenjo/recolor-illustrations/recolor-illustrations.sh D9C9A3` を実行し、3枚を確認してから「イラストをベージュ(#D9C9A3)に変更」としてコミットする。
