# Hyena Motion — iPhone試作アプリ 0.1

22歳のハイエナ獣人をiPhoneで表示・操作するReact Native / Expoプロジェクトです。

## 現在実装した機能
- キャラクター画像の表示
- 指でドラッグして位置を変更
- ゆっくり上下に揺れる簡易アニメーションのON/OFF
- 拡大・縮小・リセット
- モード選択ボタン（画像の表情はまだ切り替わりません）

## iPhoneだけで試す流れ
1. GitHubのCodespaces等のクラウド開発環境へこのフォルダをアップロード。
2. ターミナルで `npm install` を実行。
3. `npx expo start --tunnel` を実行。
4. iPhoneにExpo Goをインストールして、表示されたExpoの開発URLを開く。

※ Expo Goは試験実行用。独立したiOSアプリのインストールには、EAS BuildやAppleの署名・配布設定が別途必要です。
※ Codespacesのポート接続方法やExpo Go対応SDKはサービス・バージョンにより変わります。

## 今後の作業
- ハイエナの正面向き・レイヤー分けしたLive2Dモデル用素材を用意する
- Cubism形式（.moc3、テクスチャ、model3.json、motions等）のモデルを制作する
- iOSネイティブのLive2Dランタイムを組み込む
- ARKit顔追跡（対応端末のみ）を追加する
- クラウドMacでビルドし、署名後に実機へ配布する

これは**完成Live2Dアプリではなく動作を試すプロトタイプ**です。
