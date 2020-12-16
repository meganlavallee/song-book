CREATE DATABASE songbook;
CREATE TABLE'song';(
    id int NOT NULL primary key AUTO_INCREMENT
    comment 'primary key'
    created_song DATETIME COMMENT 'created',
    updated_time DATETIME COMMENT 'updated',
    score varchar(360) comment 'scores'
) default charset utf8 comment 'running through';