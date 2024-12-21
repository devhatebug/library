SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

START TRANSACTION;

SET time_zone = "+00:00";

CREATE TABLE `book` (
    `book_id` int(11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `author` varchar(255) NOT NULL,
    `publisher` varchar(255) NOT NULL,
    `year` int(11) NOT NULL,
    `genre` varchar(255) DEFAULT NULL,
    `price` decimal(10, 2) NOT NULL,
    `status` enum(
        'available',
        'borrowed',
        'not_available'
    ) NOT NULL DEFAULT 'available'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `book` (
        `book_id`,
        `title`,
        `author`,
        `publisher`,
        `year`,
        `genre`,
        `price`,
        `status`
    )
VALUES (
        2,
        '1984',
        'George Orwell',
        'Secker & Warburg',
        1949,
        'Dystopian',
        12.50,
        'available'
    ),
    (
        3,
        'To Kill a Mockingbird',
        'Harper Lee',
        'J.B. Lippincott & Co.',
        1960,
        'Drama',
        14.99,
        'available'
    ),
    (
        4,
        'The Great Gatsby',
        'F. Scott Fitzgerald',
        'Scribner',
        1925,
        'Fiction',
        10.99,
        'available'
    );

CREATE TABLE `borrow` (
    `borrow_id` int(11) NOT NULL,
    `user_id` int(11) DEFAULT NULL,
    `book_id` int(11) DEFAULT NULL,
    `createdAt` datetime DEFAULT current_timestamp(),
    `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `return_date` date DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE `news` (
    `id` int(11) NOT NULL,
    `title` varchar(255) NOT NULL,
    `content` text NOT NULL,
    `publishedAt` datetime NOT NULL,
    `createdAt` datetime NOT NULL,
    `updatedAt` datetime NOT NULL,
    `description` text DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `news` (
        `id`,
        `title`,
        `content`,
        `publishedAt`,
        `createdAt`,
        `updatedAt`,
        `description`
    )
VALUES (
        3,
        'Tech Giants Collaborate to Create the Next Big Thing',
        'In a groundbreaking collaboration, the biggest names in tech are coming together to create an innovation that could change the world. This partnership aims to merge AI, blockchain, and cloud computing into a single platform.',
        '2024-12-20 08:00:00',
        '2024-12-19 08:17:10',
        '2024-12-19 08:17:10',
        'Tech giants collaborate to create a groundbreaking platform combining AI, blockchain, and cloud computing.'
    ),
    (
        5,
        'How Renewable Energy is Shaping Our Future',
        'Renewable energy sources like solar and wind power are not only sustainable but also cost-effective. As the world moves toward more environmentally friendly solutions, the renewable energy sector is set to play a crucial role in the global economy.',
        '2024-12-22 10:00:00',
        '2024-12-19 08:17:24',
        '2024-12-19 08:17:24',
        'A look into the growing importance of renewable energy in shaping a sustainable future.'
    ),
    (
        6,
        'Virtual Reality: The New Frontier of Entertainment',
        'Virtual reality has taken entertainment to new heights. From immersive gaming experiences to virtual concerts and theaters, VR technology is rapidly changing how we experience media and entertainment.',
        '2024-12-23 14:15:00',
        '2024-12-19 08:17:31',
        '2024-12-19 08:17:31',
        'How virtual reality is transforming the entertainment industry with immersive experiences.'
    ),
    (
        7,
        '5G Technology: What It Means for the Future 123',
        'The rollout of 5G networks promises faster internet speeds, lower latency, and better connectivity. As 5G becomes more widespread, it will open the door for a variety of new technologies, including IoT and autonomous vehicles.',
        '2024-12-24 11:30:00',
        '2024-12-19 08:17:37',
        '2024-12-21 07:14:58',
        'Exploring the impact of 5G technology on future technologies like IoT and autonomous vehicles.'
    );

CREATE TABLE `review` (
    `review_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `book_id` int(11) NOT NULL,
    `rating` int(11) NOT NULL,
    `comment` text DEFAULT NULL,
    `createdAt` datetime NOT NULL DEFAULT current_timestamp(),
    `updatedAt` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    `username` varchar(255) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

CREATE TABLE `user` (
    `user_id` int(11) NOT NULL,
    `username` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `account_type` enum('Normal', 'VIP', 'Admin') NOT NULL,
    `borrow_history` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`borrow_history`)),
    `wishlist` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`wishlist`))
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_general_ci;

INSERT INTO
    `user` (
        `user_id`,
        `username`,
        `password`,
        `email`,
        `account_type`,
        `borrow_history`,
        `wishlist`
    )
VALUES (
        17,
        'admin',
        '$2a$10$LrxqSyeWTLU9MUzXsuTNiemDgp8gbz8JHD/l5dhYl.apHOkggaUg.',
        'admin@gmail.com',
        'Admin',
        '[]',
        '[]'
    ),
    (
        21,
        'uservip',
        '$2a$10$mb7xs4MV5bdHTXLH9q/kse/zm6B/pwaG5wgtdq5ghLSq0qzAFZJPG',
        'vip@vip.com',
        'VIP',
        '[]',
        '[]'
    );

ALTER TABLE `book` ADD PRIMARY KEY (`book_id`);

ALTER TABLE `borrow`
ADD PRIMARY KEY (`borrow_id`),
ADD KEY `user_id` (`user_id`),
ADD KEY `book_id` (`book_id`);

ALTER TABLE `news` ADD PRIMARY KEY (`id`);

ALTER TABLE `review`
ADD PRIMARY KEY (`review_id`),
ADD KEY `user_id` (`user_id`),
ADD KEY `book_id` (`book_id`);

ALTER TABLE `user` ADD PRIMARY KEY (`user_id`);

ALTER TABLE `book`
MODIFY `book_id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 12;

ALTER TABLE `borrow`
MODIFY `borrow_id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 44;

ALTER TABLE `news`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 10;

ALTER TABLE `review`
MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 15;

ALTER TABLE `user`
MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT,
AUTO_INCREMENT = 22;

ALTER TABLE `borrow`
ADD CONSTRAINT `borrow_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `borrow_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `review`
ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `book` (`book_id`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
