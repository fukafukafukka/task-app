# nodeベースで作成
FROM node:lts-alpine

# vue-cliインストール & npm最新化
RUN npm install -g npm @vue/cli

# 作業ディレクトリ
WORKDIR /app

# コンテナ内で起動する開発用サーバが使用するポート
EXPOSE 8080

# 開発用サーバ起動
CMD npm run serve

# マウントする。
ENV APP_ROOT=/Users/fukazawakeisuke/lesson/task-app/task-manage-app
VOLUME $APP_ROOT
