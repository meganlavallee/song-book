CREATE DATABASE songbook;
CREATE TABLE'song';(
    id int NOT NULL primary key AUTO_INCREMENT
    comment 'primary key'
    name VARCHAR(100)
    comment 'name',
    created_song DATETIME COMMENT 'created',
    updated_time DATETIME COMMENT 'updated',
    score INT(360) comment 'scores',
    [column] varchar (100) comment 'column'
) default charset utf8 comment 'running through';