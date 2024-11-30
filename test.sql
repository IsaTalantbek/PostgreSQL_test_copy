CREATE TABLE spending (
    id BIGSERIAL PRIMARY KEY,
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT now(),
    user_id BIGSERIAL NOT NULL,

    CONSTRAINT users_id_fk FOREIGN KEY (user_id) REFERENCES users (id));