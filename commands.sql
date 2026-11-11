
-- Creating the table blog
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

-- Inserting data to the table blogs
INSERT INTO blogs (author, url, title, likes) VALUES
 ('John Doe', 'https://example.com/blog1', 'Learning PostgreSQL', 5),
 ('Jane Smith', 'https://example.com/blog2', 'Getting Started with Node.js', 10);


-- postgres=# CREATE TABLE blogs (
-- postgres(#     id SERIAL PRIMARY KEY,
-- postgres(#     author TEXT,
-- postgres(#     url TEXT NOT NULL,
-- postgres(#     title TEXT NOT NULL,
-- postgres(#     likes INTEGER DEFAULT 0
-- postgres(# );
-- CREATE TABLE
-- postgres=#
-- postgres=# INSERT INTO blogs (author, url, title, likes)
-- postgres-# VALUES
-- postgres-#     ('John Doe', 'https://example.com/blog1', 'Learning PostgreSQL', 5),
-- postgres-#     ('Jane Smith', 'https://example.com/blog2', 'Getting Started with Node.js', 10);
-- INSERT 0 2
-- postgres=# \d
--               List of relations
--  Schema |     Name     |   Type   |  Owner
-- --------+--------------+----------+----------
--  public | blogs        | table    | postgres
--  public | blogs_id_seq | sequence | postgres
--  public | notes        | table    | postgres
--  public | notes_id_seq | sequence | postgres
-- (4 rows)


-- postgres=#