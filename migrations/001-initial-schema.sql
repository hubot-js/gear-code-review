-- Up
CREATE TABLE review_queue (user TEXT, type TEXT, date TEXT);
CREATE TABLE reviewer_ranking (user TEXT, type TEXT, date TEXT);
CREATE TABLE channel (channel_name TEXT);
INSERT INTO channel values (null);

-- Down
DROP TABLE review_queue;
DROP TABLE reviewer_ranking;
DROP TABLE channel;
