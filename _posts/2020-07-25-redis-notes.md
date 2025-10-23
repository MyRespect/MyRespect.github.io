---
layout: post
title:  "Redis Notes"
categories: System
tags: Redis
--- 

* content
{:toc}

Redis is an in-memory data structure store, used as a database, cache, and message broker. It supports data structures such as strings, hashes, lists, sets, sorted sets with range queries, bitmaps, hyperloglogs, geospatial indexes with radius queries, and streams.




Redis supports data persistence. It can save data in memory to disk and load it again for use when restarting. Redis not only supports simple key-value type data, but also provides string, list, set, and zset. , storage of data structures such as hash; Redis supports data backup, that is, data backup in master-slave mode; all operations of Redis are atomic, either executed successfully or not executed at all if failed.

### **Scenarios**

(1) Cache data, for data that needs to be queried frequently and changes infrequently (hot data);

(2) Used as a message queue, equivalent to a message subscription system;

(3) As a counter, count click rate, like rate, etc., because redis is atomic and can avoid concurrency problems;

Why is Redis so fast? Pure memory operation (can be manually persisted to the hard disk), single thread (avoiding frequent context switching operations in multi-threads), the data structure and operation are relatively simple, redis has established its own VM mechanism in the underlying model, because of general system calls For system functions, a certain amount of time will be wasted to move and request, so use a multi-channel I/O multiplexing model and a non-blocking model.

### **Installation**

```
sudo apt-get update
sudo apt-get install redis-server

redis-server --maxclients 100000 #start redis, set maximum connections

redis-cli # Connect to local redis service 
redis-cli -h host -p port -a password # Execute commands on the remote redis service
```

String is the most basic type of redis. One key corresponds to one value. It is binary safe and can contain any data, such as pictures or serialized objects. Redis hash is a set of key-value (key=>value) pairs. Hash is particularly suitable for storing objects. For example, it can be used to store user IDs, avatar points, etc. in forum systems. If you want to modify the information, you only need to retrieve it through the key. Value is deserialized to modify the value of one of the items, and then serialized and stored in Redis. Redis list is sorted in insertion order. You can add an element to the head (left) or tail (right) of the list. Set is an unordered collection of string type, implemented through a hash table. Addition, deletion, and search complexity are all O(1).

```
SET string_name "runoob"
GET string_name

HMSET myhash key_field1 "Hello" key_field2 "World"
HGET myhash key_field1

lpush list_runoob redis
lrange list_runoob 0 10

sadd set_runoob redis
smembers set_runoob

zadd key score member 
```

**Redis HyperLogLog**

Data set {1, 3, 5, 7, 5, 7, 8}, then the cardinality set of this data set is {1, 3, 5,7, 8}, and the cardinality (non-repeating elements) is 5. Cardinality estimation is to quickly calculate the cardinality within the acceptable error range. Redis HyperLogLog is an algorithm used for cardinality statistics. When the number or volume of input elements is very large, the space required to calculate the cardinality is always fixed and very small.


### **Advanced**

Redis publish and subscribe (pub/sub) is a message communication model: the sender (pub) sends messages and the subscriber (sub) receives messages:
```
SUBSCRIBE redisChat
PUBLISH redisChat "Learn redis by runoob.com"
```
Redis transactions can execute multiple commands at one time. Batch operations are put into the queue cache before sending the EXEC command. After receiving the EXEC command, transaction execution is entered. If any command in the transaction fails to execute, the remaining commands are still executed. During transaction execution, command requests submitted by other clients will not be inserted into the transaction execution command sequence.
```
MULTI # start transaction
SET book-name "Mastering C++ in 21 days"　# command to queue
SADD tag "C++" "Programming" "Mastering Series"　# command to queue
EXEC　# execute transaction
```

The Redis SAVE command is used to create a backup of the current database; BGSAVE, this command is executed in the background; if you need to restore data, just move the backup file (dump.rdb) to the redis installation directory and start the service.

```
CONFIG GET dir # get file directory
```

#### **Deletion**

The default is to detect once every 100ms. If an expired key is encountered, it will be deleted. Random detection is used here. In order to prevent the fish from slipping through the net, when we read and write an expired key, the lazy deletion strategy of redis will be triggered. Directly Expired keys will be deleted.

#### **Breakdown**

Caching is a layer of protection added to relieve the pressure on the database. When the data we need cannot be queried from the cache, we must query the database. If hackers use it to frequently access data that does not exist in the cache, the cache will lose its meaning. , causing database connection exception;

Solution:

1. Set up scheduled tasks in the background and actively update cached data;

2. Hierarchical cache, for example, setting up two cache protection layers. The first-level cache has a short expiration time, and the second-level cache has a long expiration time. When a request comes, priority is given to searching from the first-level cache. If the corresponding data is not found in the first-level cache, Then the thread is locked, and this thread gets the data from the database, updates the level 1 and level 2 caches, and other threads get it directly from the level 2 cache.

3. Provide an interception mechanism that internally maintains a series of legal key values. When the requested key is illegal, it will be returned directly.

#### **Cons**

Since Redis is an in-memory database, the amount of data stored in a single machine is limited, and unnecessary data needs to be deleted in time. After modifying the redis data, the data persisted to the hard disk needs to be re-added to the memory, which takes a long time. redis cannot run normally.


### **Python with Redis**
```
import redis
r = redis.Redis(host='192.168.0.110', port=6379,db=0)

pool = redis.ConnectionPool(host='192.168.0.110', port=6379)
r = redis.Redis(connection_pool=pool)

pipe = r.pipeline(transaction=True) # use pipline to specify multiple commands in one request

r.set('name', 'zhangsan')
r.mset(name1='zhangsan', name2='lisi')

r.hset("dic_name","a1","aa")　# name, key, value
r.hget("dic_name","a1")

r.lpush(name,values)
r.rpush(name,values)
r.lpop(name)

r.sadd(name,values)

r.zadd("zset_name", "a1", 6, "a2", 2,"a3",5)

class RedisHelper(object):
    def __init__(self):
        self.__conn = redis.Redis(host='192.168.0.110',port=6379)
        self.channel = 'monitor'

    def publish(self,msg):
        self.__conn.publish(self.channel,msg)
        return True

    def subscribe(self):
        pub = self.__conn.pubsub()
        pub.subscribe(self.channel)
        pub.parse_response()
        return pub

from RedisHelper import RedisHelper

obj = RedisHelper()
obj.publish('hello')

obj = RedisHelper()
redis_sub = obj.subscribe()

while True:
    msg= redis_sub.parse_response()
    print (msg)
```