/*

This week is mostly about Indexing


1.

The drivers (pyMongo, Node etc) used to write mongo scripts talk to the mongo server.
The mongoDB server talks to the database (disk) through a storage-engine.

The storage-engine has control of memory in your computer, and it can decide what to put in memory, what to take out of memory, and what to write to the disk.

Mongo has pluggable Storage engine, where you can choose what storage-engine you wanna use based on your needs:
	1. MMAPV1 (Default)
	2. WiredTiger (Acquired through aquisition)

What are some of the things the storage engine does'nt handle:

	1. Communication between mongodb servers
	2. API the db presents to the programmer.


2. 

3.

4. 

Index: Is an ordered list of things
If an index is made of three keys/feilds, then each possible three-key combination forms one cell of the index.
Indexing is not free: Indexes slows down the `write`s, but offres huge speed gains on reading data.
