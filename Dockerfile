# # nodeベースで作成
# FROM node:lts-alpine

# # vue-cliインストール & npm最新化
# RUN npm install -g npm @vue/cli

# # 作業ディレクトリ
# WORKDIR /app

# # コンテナ内で起動する開発用サーバが使用するポート
# EXPOSE 8080

# # 開発用サーバ起動
# CMD npm run serve

# # マウントする。
# # ENV APP_ROOT=/Users/fukazawakeisuke/lesson/task-app/task-manage-app
# # VOLUME $APP_ROOT

# 上記はローカル環境で動かす用
FROM node:lts-alpine

# 静的コンテンツを配信するシンプルな http サーバをインストールする
RUN npm install -g http-server

# カレントワーキングディレクトリとして 'app' フォルダを指定する
WORKDIR /app

# `package.json` と `package-lock.json` （あれば）を両方コピーする
COPY package*.json ./

# プロジェクトの依存ライブラリをインストールする
RUN npm install

# カレントワーキングディレクトリ(つまり 'app' フォルダ)にプロジェクトのファイルやフォルダをコピーする
COPY . .

# 本番向けに圧縮しながらアプリケーションをビルドする
RUN npm run build

EXPOSE 8081
CMD [ "http-server", "dist" ]