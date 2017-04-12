# 很小的一个Nodejs镜像
# https://hub.docker.com/r/mhart/alpine-node/
FROM mhart/alpine-node

# 作者信息
MAINTAINER zhang.baokun@etao.cn<zhang.baokun@etao.cn>

# 安装pm2守护进程
RUN npm install pm2 -g -verbose --registry=https://registry.npm.taobao.org

# 使用pm2 ecosystem 生成ecosystem.config.js文件并修改

WORKDIR /src

# 端口
EXPOSE 3000

# 添加本地文件
# COPY . /src
# RUN cd /src

# 开放容器内的目录
VOLUME ["/src"]

# 默认执行(可被运行时重写)
CMD ["pm2","start", "ecosystem.config.js","--no-daemon"]

# docker run
# docker run --name kanban -d -p 8002:3000 -v $(pwd):/src --link pg:pg --link redis:redis kanban
