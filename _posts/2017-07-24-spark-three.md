---
layout: post
title:  "Notes for Spark (3)"
categories: Data&nbspAnalysis
tags: Dstream
--- 

* content
{:toc}

In this post, I mainly make notes about Spark Streaming. This post is based on the open tutorial from [here](http://dblab.xmu.edu.cn/blog/1709-2/).





### **DStream**

DStream是Spark Streaming的编程模型，DStream的操作包括输入、转换和输出。

编写Spark Streaming程序的基本步骤是：

1. 通过创建输入DStream来定义输入源;

2. 通过对DStream应用转换操作和输出操作来定义流计算;

3. streamingContext.start()来开始接收数据和处理流程;

4. 通过streamingContext.awaitTermination()方法来等待处理结束（手动结束或因为错误而结束）;

5. 以通过streamingContext.stop()来手动结束流计算进程。

```
from pyspark import SparkContext, SparkConf
from pyspark.streaming import StreamingContext
conf = SparkConf()
conf.setAppName('TestDStream')
conf.setMaster('local[2]')
sc = SparkContext(conf = conf)
ssc = StreamingContext(sc, 1) #1表示每隔1秒钟就自动执行一次流计算，这个秒数可以自由设定
```

### **Queue**

在调试Spark Streaming应用程序的时候，我们可以使用streamingContext.queueStream(queueOfRDD)创建基于RDD队列的DStream．
```
import time
 
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
 
if __name__ == "__main__":
 
    sc = SparkContext(appName="PythonStreamingQueueStream")
    ssc = StreamingContext(sc, 1)
 
    # Create the queue through which RDDs can be pushed to
    # a QueueInputDStream
    rddQueue = []
    for i in range(5):
        rddQueue += [ssc.sparkContext.parallelize([j for j in range(1, 1001)], 10)]
 
    # Create the QueueInputDStream and use it do some processing
    inputStream = ssc.queueStream(rddQueue)
    mappedStream = inputStream.map(lambda x: (x % 10, 1))
    reducedStream = mappedStream.reduceByKey(lambda a, b: a + b)
    reducedStream.pprint()
 
    ssc.start()
    time.sleep(6)
    ssc.stop(stopSparkContext=True, stopGraceFully=True)
```

### **Kafka**

Kafka和Flume都是非常流行的日志采集系统，可以作为DStream(RDD队列流)的高级数据源。
```
from __future__ import print_function
 
import sys
 
from pyspark import SparkContext
from pyspark.streaming import StreamingContext
from pyspark.streaming.kafka import KafkaUtils
 
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: kafka_wordcount.py <zk> <topic>", file=sys.stderr)
        exit(-1)
 
    sc = SparkContext(appName="PythonStreamingKafkaWordCount")
    ssc = StreamingContext(sc, 1)
 
    zkQuorum, topic = sys.argv[1:]
    kvs = KafkaUtils.createStream(ssc, zkQuorum, "spark-streaming-consumer", {topic: 1})
    lines = kvs.map(lambda x: x[1])
    counts = lines.flatMap(lambda line: line.split(" ")) \
        .map(lambda word: (word, 1)) \
        .reduceByKey(lambda a, b: a+b)
    counts.pprint()
 
    ssc.start()
    ssc.awaitTermination()

python3 ./KafkaWordCount.py localhost:2181 wordsendertest
```

### **Operation**

DStream转换操作包括无状态转换和有状态转换。
无状态转换：每个批次的处理不依赖于之前批次的数据
```
* map(func) ：对源DStream的每个元素，采用func函数进行转换，得到一个新的DStream；
* flatMap(func)： 与map相似，但是每个输入项可用被映射为0个或者多个输出项；
* filter(func)： 返回一个新的DStream，仅包含源DStream中满足函数func的项；
* repartition(numPartitions)： 通过创建更多或者更少的分区改变DStream的并行程度；
* union(otherStream)： 返回一个新的DStream，包含源DStream和其他DStream的元素；
* count()：统计源DStream中每个RDD的元素数量；
* reduce(func)：利用函数func聚集源DStream中每个RDD的元素，返回一个包含单元素RDDs的新DStream；
* countByValue()：应用于元素类型为K的DStream上，返回一个（K，V）键值对类型的新DStream，每个键的值是在原DStream的每个RDD中的出现次数；
* reduceByKey(func, [numTasks])：当在一个由(K,V)键值对组成的DStream上执行该操作时，返回一个新的由(K,V)键值对组成的DStream，每一个key的值均由给定的recuce函数（func）聚集起来；
* join(otherStream, [numTasks])：当应用于两个DStream（一个包含（K,V）键值对,一个包含(K,W)键值对），返回一个包含(K, (V, W))键值对的新DStream；
* cogroup(otherStream, [numTasks])：当应用于两个DStream（一个包含（K,V）键值对,一个包含(K,W)键值对），返回一个包含(K, Seq[V], Seq[W])的元组；
* transform(func)：通过对源DStream的每个RDD应用RDD-to-RDD函数，创建一个新的DStream。支持在新的DStream中做任何RDD操作。
```

有状态转换：当前批次的处理需要使用之前批次的数据或者中间结果。有状态转换包括基于滑动窗口的转换和追踪状态变化的转换(updateStateByKey)。
```
* window(windowLength, slideInterval) 基于源DStream产生的窗口化的批数据，计算得到一个新的DStream；
* countByWindow(windowLength, slideInterval) 返回流中元素的一个滑动窗口数；
* reduceByWindow(func, windowLength, slideInterval) 返回一个单元素流。利用函数func聚集滑动时间间隔的流的元素创建这个单元素流。函数func必须满足结合律，从而可以支持并行计算；
* reduceByKeyAndWindow(func, windowLength, slideInterval, [numTasks]) 应用到一个(K,V)键值对组成的DStream上时，会返回一个由(K,V)键值对组成的新的DStream。每一个key的值均由给定的reduce函数(func函数)进行聚合计算。注意：在默认情况下，这个算子利用了Spark默认的并发任务数去分组。可以通过numTasks参数的设置来指定不同的任务数；
* reduceByKeyAndWindow(func, invFunc, windowLength, slideInterval, [numTasks]) 更加高效的reduceByKeyAndWindow，每个窗口的reduce值，是基于先前窗口的reduce值进行增量计算得到的；它会对进入滑动窗口的新数据进行reduce操作，并对离开窗口的老数据进行“逆向reduce”操作。但是，只能用于“可逆reduce函数”，即那些reduce函数都有一个对应的“逆向reduce函数”（以InvFunc参数传入）；
* countByValueAndWindow(windowLength, slideInterval, [numTasks]) 当应用到一个(K,V)键值对组成的DStream上，返回一个由(K,V)键值对组成的新的DStream。每个key的值都是它们在滑动窗口中出现的频率
```