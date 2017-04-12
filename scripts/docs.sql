create table wxuser(
    id serial,
	openid text,
	nickname text,
	sex text,
	province text,
	city text,
	country text,
	headimgurl text,
	unionid text,
	created timestamp default current_timestamp,
	role text,
	realname text,
	permission text
)

create table docs(
    id serial,
    author text,
    title text,
    content text,
    hits integer default 0,
    created timestamp default current_timestamp,
    lastupdated timestamp default current_timestamp
)
create table task(
    parentid integer default 0,
    type integer default 0,
    status integer default 0,
    estimate integer default 4,
    importance integer default 0
)inherits(docs)
