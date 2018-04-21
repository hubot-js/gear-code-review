-- Up
ALTER TABLE review_queue ADD COLUMN param TEXT;

-- Down
ALTER TABLE review_queue DROP COLUMN param;
