USE booklib;
CREATE TABLE Book
(
	BookId INT AUTO_INCREMENT,
	AuthorId INT,
	Title varchar(500),
	FileName varchar(500),
	BookContent LONGBLOB,
	BookDescription varchar(10000),
	LastUpdate datetime,
    CONSTRAINT book_pk PRIMARY KEY(BookId)
);

CREATE TABLE author
(
	AuthorId INT  AUTO_INCREMENT,
	AuthorName varchar(500),
	LastUpdate datetime,
    CONSTRAINT author_pk PRIMARY KEY(AuthorId)
);

CREATE TABLE category
(
	CategoryId INT AUTO_INCREMENT,
	CategoryName varchar(500) NULL,
	CategoryDescription varchar(500) NULL,
	LastUpdate  datetime NULL,
    CONSTRAINT category_pk PRIMARY KEY(CategoryId)
);

USE booklib;

CREATE TABLE BookCategory
(
	BookCategoryId INT AUTO_INCREMENT,
	BookId INT NOT NULL,
	CategoryId INT NOT NULL,
    CONSTRAINT bookcategory_pk PRIMARY KEY(BookCategoryId)
);

ALTER TABLE book
ADD CONSTRAINT book_author_fk 
    FOREIGN KEY (AuthorId)  REFERENCES author (AuthorId);
	
ALTER TABLE bookcategory
ADD CONSTRAINT bookcategory_book_fk 
    FOREIGN KEY (BookId)  REFERENCES book (BookId);


ALTER TABLE bookcategory
ADD CONSTRAINT bookcategory_category_fk 
    FOREIGN KEY (CategoryId)  REFERENCES category (CategoryId);

Alter Table book ADD Index idx_book_authorid (authorId);

CREATE INDEX idx_bookcategory_category
ON bookcategory (CategoryId); 

CREATE INDEX idx_bookcategory_book
ON bookcategory (BookId); 

CREATE INDEX idx_book_title ON book (title);

use BookLib;
ALTER TABLE author MODIFY COLUMN LastUpdate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;


CREATE TABLE user
(
	UserId INT AUTO_INCREMENT,
	UserName varchar(500) NOT NULL,
	Password varchar(500) NOT NULL,
	IsAdmin  bit default 0,
    CONSTRAINT User_pk PRIMARY KEY(UserId)
);

CREATE TABLE readingstate
(
	ReadingStateId INT AUTO_INCREMENT,
	StateName varchar(500) NOT NULL,
    CONSTRAINT Readingstate_pk PRIMARY KEY(ReadingstateId)
);

CREATE TABLE bookreadingstate
(
	BookReadingStateId INT AUTO_INCREMENT,
	ReadingStateId INT,
	UserId INT,
	BookId INT,
    CONSTRAINT BookReadingstate_pk PRIMARY KEY(BookReadingstateId)
);
	
ALTER TABLE book ADD COLUMN UserId INT NULL;

ALTER TABLE book
ADD CONSTRAINT book_user_fk 
    FOREIGN KEY (UserId)  REFERENCES user (UserId);
	
ALTER TABLE bookreadingstate
ADD CONSTRAINT bookreadingstate_user_fk 
    FOREIGN KEY (UserId)  REFERENCES user (UserId);
	
ALTER TABLE bookreadingstate
ADD CONSTRAINT bookreadingstate_book_fk 
    FOREIGN KEY (bookId)  REFERENCES book (BookId);
	
ALTER TABLE bookreadingstate
ADD CONSTRAINT bookreadingstate_readingstate_fk 
    FOREIGN KEY (ReadingstateId)  REFERENCES Readingstate (ReadingstateId);
	
ALTER TABLE bookreadingstate ADD COLUMN page INT NULL;

CREATE TABLE bookreadingstatehistory
(
	BookReadingStateHistoryId INT AUTO_INCREMENT,
	BookReadingStateId INT,
	OldReadingStateId INT,
	NewReadingStateId INT,
	OldPage INT,
	NewPage INT,
    CONSTRAINT BookReadingstatehistory_pk PRIMARY KEY (BookReadingStateHistoryId)
);

ALTER TABLE bookreadingstatehistory
ADD CONSTRAINT bookreadingstatehistory_bookreadingstate_fk 
    FOREIGN KEY (BookReadingStateId)  REFERENCES bookreadingstate (BookReadingStateId);
	
ALTER TABLE user ADD COLUMN role varchar(100) NULL;

ALTER TABLE user ADD COLUMN token varchar(100) NULL;

INSERT INTO `user` (`UserName`,  `Password`,  `IsAdmin`,  `role`,  `token`)
VALUES ('Admin',  'Admin',  1,  'Admin',  '21BF0F30-7795-4BF2-99CC-13C505D38259');

INSERT INTO `user` (`UserName`,  `Password`,  `IsAdmin`,  `role`,  `token`)
VALUES ('User1',  'User1',  0,  'User',  '8B60F402-4A3E-4A53-8930-E605EF331BD7');



Alter Table bookreadingstatehistory ADD COLUMN ChangeDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;
	
ALTER TABLE book MODIFY COLUMN LastUpdate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE category MODIFY COLUMN LastUpdate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP;

INSERT INTO booklib.readingstate(StateName)
SELECT d.StateName 
FROM (
SELECT 'Prepare' AS StateName FROM DUAL
UNION
SELECT 'Ready' AS StateName FROM DUAL
UNION
SELECT 'Reading' AS StateName FROM DUAL
UNION
SELECT 'Completed' AS StateName FROM DUAL) AS d
LEFT OUTER JOIN booklib.readingstate rs
ON rs.StateName = d.StateName
WHERE rs.StateName IS NULL;


