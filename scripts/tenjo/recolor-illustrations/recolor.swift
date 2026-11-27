// PNG の緑の塗りだけを、指定した1色に塗り替える。
// 黒い線・白・線のふちのなめらかさ(アンチエイリアス)は残す。
//
// 使い方: swift recolor.swift <入力.png> <出力.png> <RRGGBB>
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

let args = CommandLine.arguments
guard args.count == 4, let hex = Int(args[3], radix: 16) else {
  print("usage: recolor <in.png> <out.png> <RRGGBB>")
  exit(1)
}

guard let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: args[1]) as CFURL, nil),
  let img = CGImageSourceCreateImageAtIndex(src, 0, nil)
else {
  print("cannot read \(args[1])")
  exit(1)
}
let w = img.width, h = img.height
var px = [UInt8](repeating: 0, count: w * h * 4)
let ctx = CGContext(
  data: &px, width: w, height: h, bitsPerComponent: 8, bytesPerRow: w * 4,
  space: CGColorSpace(name: CGColorSpace.sRGB)!,
  bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
ctx.draw(img, in: CGRect(x: 0, y: 0, width: w, height: h))

func rgb(_ i: Int) -> (Double, Double, Double, Double) {
  let a = Double(px[i + 3])
  if a == 0 { return (0, 0, 0, 0) }
  return (Double(px[i]) * 255 / a, Double(px[i + 1]) * 255 / a, Double(px[i + 2]) * 255 / a, a)
}

// 一番多く使われている、はっきりした緑を「元の緑」とみなす
var hist: [Int: Int] = [:]
for i in stride(from: 0, to: px.count, by: 4) {
  let (r, g, b, a) = rgb(i)
  if a < 250 || g - max(r, b) <= 50 { continue }
  hist[((Int(r) / 4) << 16) | ((Int(g) / 4) << 8) | (Int(b) / 4), default: 0] += 1
}
guard let top = hist.max(by: { $0.value < $1.value })?.key else {
  print("no green found in \(args[1])")
  exit(1)
}
let G = (Double((top >> 16) & 0xff) * 4 + 2, Double((top >> 8) & 0xff) * 4 + 2, Double(top & 0xff) * 4 + 2)
let T = (Double((hex >> 16) & 0xff), Double((hex >> 8) & 0xff), Double(hex & 0xff))
let gSat = G.1 - max(G.0, G.2)

// 各ピクセルを「緑 s 割 + 灰色(黒〜白) 残り」とみなし、緑の分だけ新しい色に置き換える
for i in stride(from: 0, to: px.count, by: 4) {
  let (r, g, b, a) = rgb(i)
  if a == 0 { continue }
  let s = min(1, max(0, (g - max(r, b)) / gSat))
  if s <= 0 { continue }
  let rest = s < 0.999 ? ((r - s * G.0) + (g - s * G.1) + (b - s * G.2)) / (3 * (1 - s)) : 0
  func c(_ v: Double) -> UInt8 { UInt8(max(0, min(255, v)) * a / 255) }
  px[i] = c(s * T.0 + (1 - s) * rest)
  px[i + 1] = c(s * T.1 + (1 - s) * rest)
  px[i + 2] = c(s * T.2 + (1 - s) * rest)
}

let dst = CGImageDestinationCreateWithURL(
  URL(fileURLWithPath: args[2]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(dst, ctx.makeImage()!, nil)
CGImageDestinationFinalize(dst)
