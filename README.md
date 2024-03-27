# PLATEAU Technical Report: 3D都市モデル活用のための技術資料 - WebGISに関する技術調査レポート

3D都市モデルの可視化や解析等の活用を誰もが簡単に行えるようにするためには、ウェブ上で利用可能な地図を用いることが有用である。ウェブ上で利用可能な地理空間情報システムは一般にWebGISと呼ばれる。

WebGISは一般的には「地図エンジン」と呼ばれるライブラリを用いて構築を行う。以後、ウェブ上で利用可能な地理空間システムのことを「WebGIS」、WebGISを構築するライブラリのことを「地図エンジン」と呼称するものとする。

現状、CesiumJSと呼ばれる地図エンジンを用いた3D都市モデルの可視化環境としてPLATEAU VIEWが開発されている。これは、CityGML形式で標準化されている3D都市モデルの形状及び属性情報をそのまま再現できるレンダリングフォーマットとして3DTiles形式が採用され、その描画には地図エンジンとしてCesiumエンジンが最適な選択肢とされていることによる。他方、3Dモデルを使用可能な地図エンジンとしてはCesiumJS以外にも様々なライブラリやソフトウェアが存在しているが、3D都市モデルとの親和性については明らかではない。

そこで、本調査では、3D都市モデルを利用可能な地図エンジンを広く調査・比較し、可視化、解析、他のGISデータとの組み合わせなどの観点から3D都市モデルとの親和性を整理する。これらの整理を通じ、3D都市モデルのデータとしての価値を最大限に引き出すことが可能な既存の地図エンジンを体系化することを本調査の目的とする。

本レポジトリで、調査の際に作成したデモのコードを公開する。


## STEP 2 - 3D都市モデルの表示性能検証

`step2/` フォルダ以下に、各デモのコードが置かれている。

それぞれのディレクトリにおいて、以下のコマンドを実行することでデモの実行ができる。

```sh
$ npm install
$ npm run dev
```

### deck.gl

- `step2/deck.gl/`
- http://localhost:3000/mapengine-survey/step2/deckgl

### MapLibre GL JS

- `step2/maplibre/`
- http://127.0.0.1:5173/

### Mapbox GL JS (v2)

- `step2/mapbox-v2/`
- http://127.0.0.1:5173/
- 利用のためにトークンが必要: `.env.example` ファイルを参考に `.env` ファイルを作成のこと

### Mapbox GL JS (v3)

- `step2/mapbox-v3/`
- http://127.0.0.1:5173/
- 利用のためにトークンが必要: `.env.example` ファイルを参考に `.env` ファイルを作成のこと

###  - iTowns

- `step2/itowns/`
- http://127.0.0.1:5173/mapengine-survey/step2/itowns

### ArcGIS Maps SDK for JavaScript

- `step2/arcgis/`
- http://127.0.0.1:5173/
- 利用のためにAPIキーが必要: `.env.example` ファイルを参考に `.env` ファイルを作成のこと


## STEP 3 - 表現方法の調査

`step3/` フォルダ以下に、各デモのコードが置かれている。

それぞれのディレクトリにおいて、以下のコマンドを実行することでデモの実行ができる。

```sh
$ npm install
$ npm run dev
```

### deck.gl: TerrainExtension - 距離に応じた建物色変化

- `step3/deckgl-terrain/`
- http://127.0.0.1:5173/mapengine-survey/step3/deckgl-terrain/

### deck.gl: LineLayer - 経路表示

- `step3/deckgl-linelayer/`
- http://127.0.0.1:5173/mapengine-survey/step3/deckgl-linelayer/

### deck.gl: TripsLayer - 移動体の走行軌跡

- `step3/deckgl-tripslayer/`
- http://127.0.0.1:5173/mapengine-survey/step3/deckgl-tripslayer/

### deck.gl: ArcLayer - 拠点間の移動状況

- `step3/deckgl-arclayer/`
- http://127.0.0.1:5173/mapengine-survey/step3/deckgl-arclayer/

### deck.gl HeatmapLayer: ヒートマップ

- `step3/deckgl-heatmaplayer/`
- http://127.0.0.1:5173/mapengine-survey/step3/deckgl-heatmaplayer/

### MapLibre GL JS - ヒートマップ

- `step3/maplibre-heatmap/`
- http://127.0.0.1:5173/

### MapLibre GL JS - クラスター

- `step3/maplibre-cluster/`
- http://127.0.0.1:5173/
