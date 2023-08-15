CREATE DATABASE IF NOT EXISTS laboratory;

USE laboratory;

CREATE TABLE user (
  user_id INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(40) NOT NULL,
  password INT DEFAULT NULL,
  PRIMARY KEY (id)
);

DESCRIBE user;

INSERT INTO user VALUES
(1, 'John', 12345678),
(2, 'Jane', 4215126126126),
(3, 'Jack', NULL);
