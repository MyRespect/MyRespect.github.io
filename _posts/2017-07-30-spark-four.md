---
layout: post
title:  "Notes for Spark (4)"
categories: Data&nbspAnalysis
tags: MLlib
--- 

* content
{:toc}

In this post, I mainly make notes about Spark MLlib. This post is mainly based on the open tutorial from [here](http://dblab.xmu.edu.cn/blog/1709-2/).





### **ML Pipelines**

DataFrame：使用Spark SQL中的DataFrame作为数据集，它可以容纳各种数据类型。 较之 RDD，包含了 schema 信息，更类似传统数据库中的二维表格。它被 ML Pipeline 用来存储源数据。例如，DataFrame中的列可以是存储的文本，特征向量，真实标签和预测的标签等。

Transformer：翻译成转换器，是一种可以将一个DataFrame转换为另一个DataFrame的算法。比如一个模型就是一个 Transformer。它可以把 一个不包含预测标签的测试数据集 DataFrame 打上标签，转化成另一个包含预测标签的 DataFrame。技术上，Transformer实现了一个方法transform（），它通过附加一个或多个列将一个DataFrame转换为另一个DataFrame。

Estimator：翻译成估计器或评估器，它是学习算法或在训练数据上的训练方法的概念抽象。在 Pipeline 里通常是被用来操作 DataFrame 数据并生产一个 Transformer。从技术上讲，Estimator实现了一个方法fit（），它接受一个DataFrame并产生一个转换器。如一个随机森林算法就是一个 Estimator，它可以调用fit（），通过训练特征数据而得到一个随机森林模型。

Parameter：Parameter 被用来设置 Transformer 或者 Estimator 的参数。现在，所有转换器和估计器可共享用于指定参数的公共API。ParamMap是一组（参数，值）对。

PipeLine：翻译为工作流或者管道。工作流将多个工作流阶段（转换器和估计器）连接在一起，形成机器学习的工作流，并获得结果输出。

```
spark = SparkSession.builder.master("local").appName("Word Count").getOrCreate()

from pyspark.ml import Pipeline
from pyspark.ml.classification import LogisticRegression
from pyspark.ml.feature import HashingTF, Tokenizer

tokenizer = Tokenizer(inputCol="text", outputCol="words")
hashingTF = HashingTF(inputCol=tokenizer.getOutputCol(), outputCol="features")
lr = LogisticRegression(maxIter=10, regParam=0.001)

pipeline = Pipeline(stages=[tokenizer, hashingTF, lr])
model = pipeline.fit(training)
```

### **Gaussian Mixture Model**

Spark的ML库提供的高斯混合模型分为两个具体的类,用于抽象GMM的超参数并进行训练的GaussianMixture类(Estimator)和训练后的模型GaussionMixtureModel类(Transformer)
```
from pyspark.sql import Row
from pyspark.ml.clustering import GaussianMixture, GaussianMixtureModel
from pyspark.ml.linalg import Vectors

df = sc.textFile("file:///usr/local/spark/iris.txt").map(lambda line: line.split(',')).map(lambda p: Row(**f(p))).toDF()

gm = GaussianMixture().setK(3).setPredictionCol("Prediction").setProbabilityCol("Probability")
gmm = gm.fit(df)

result = gmm.transform(df)
result.show(150, False)

for i in range(3):
    print("Component "+str(i)+" : weight is "+str(gmm.weights[i])+"\n mu vector is "+str( gmm.gaussiansDF.select('mean').head())+" \n sigma matrix is "+ str(gmm.gaussiansDF.select('cov').head()))
```

### **Collaborative Filtering**

```
from pyspark.ml.evaluation import RegressionEvaluator
from pyspark.ml.recommendation import ALS
from pyspark.sql import Row

def f(x):
    rel = {}
    rel['userId'] = int(x[0])
        rel['movieId'] = int(x[1])
        rel['rating'] = float(x[2])
        rel['timestamp'] = float(x[3])
    return rel

ratings = sc.textFile("file:///usr/local/spark/data/mllib/als/sample_movielens_ratings.txt").map(lambda line: line.split('::')).map(lambda p: Row(**f(p))).toDF()

training, test = ratings.randomSplit([0.8,0.2])
alsExplicit  = ALS(maxIter=5, regParam=0.01, userCol="userId", itemCol="movieId", ratingCol="rating")
alsImplicit = ALS(maxIter=5, regParam=0.01, implicitPrefs=True,userCol="userId", itemCol="movieId", ratingCol="rating")

modelExplicit = alsExplicit.fit(training)
modelImplicit = alsImplicit.fit(training)

predictionsExplicit = modelExplicit.transform(test)
predictionsImplicit = modelImplicit.transform(test)

evaluator = RegressionEvaluator().setMetricName("rmse").setLabelCol("rating").setPredictionCol("prediction")
```
