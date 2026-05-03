CREATE TABLE IF NOT EXISTS chat_groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_group_members (
    group_id INTEGER REFERENCES chat_groups(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (group_id, user_id)
);

ALTER TABLE chat_messages
ALTER COLUMN receiver_id DROP NOT NULL,
ADD COLUMN group_id INTEGER REFERENCES chat_groups(id) ON DELETE CASCADE,
ADD COLUMN file_url TEXT,
ADD COLUMN file_name TEXT;
