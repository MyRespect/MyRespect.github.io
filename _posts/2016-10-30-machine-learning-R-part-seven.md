---
layout: post
title:  "Machine Learning with R (7)"
categories: AI
tags: Bagging Boosting
--- 

* content
{:toc}  

In this blog, I will introduce a set of techniques for improving the predictive performance of ML models, such as how to fine-tune the performance by searching for the optimal set of training conditions. Moreover, I will record some useful techniques for certain types of work. 




### **Model Search** 

We can use the *caret* package for automatic parameter searching. It provides a train() function as a standard interface for training [classification and regression tasks](https://caret.r-forge.r-project.org/modelList.html). We need to consider the following points: 

1. Which machine learning model to use?
2. Which model parameters can be adjusted, and what is the range of adjustment?
3. What evaluation criteria are used to find the best candidates?

**Build a simple model**

```
library(caret)
set.seed(300)
m<-train(default~.,data=credit,method="C5.0")
p<-predict(m,credit，type="prob")
```
Here, the *train()* function models all the data using the parameters from the best model, stored in the m$finalModel object. In most cases, we don't need to directly manipulate the finalModel object, but use the *predict()* function to make predictions through the m object. In this way, any data preprocessing method that the train() function applies to the data will be applied to the predicted data, and the predict() function provides a standard interface to get the predicted category value and probability.

The *set.seed()* function is used to initialize the random number generator of R. By setting the seed parameter, the random number can follow a preset sequence, which can make the simulation method run repeatedly with the same results. It would be useful if you share the code and try to get the same result as before.

**Find the best parameters**

We use the *trainControl()* function to create a series of configuration options that can be viewed in detail with the *?trainControl* command. Then we create tables for optimizing parameters. The *expand.grid()* function creates a data frame from all combinations of values.

```
ctrl<-trainControl(method="cv",number=10,selectionFunction="oneSE")
grid <- expand.grid(.model="tree",.trials=c(1,5,10,15,20,25,30,35),.winnow="FALSE")
m<-train(default~.,data=credit,method="C5.0",metric="Kappa",trControl=ctrl,tuneGrid=grid)
```
In this way, we have customized our train() model. We use the *selectionFunction* parameter to select the best model among each candidate model. Here we use the oneSE function, which means that the best performance is selected within the standard deviation.

### **Meta-Learning**

Meta-Learning is learning to learn, that's the learning algorithm that learns from other learning algorithms. Simply speaking, we can regard meta-learning as how to best combine other learning algorithms in the field of ensemble learning. Combining multiple models to form a stronger group. It can be simple algorithms that improve performance by automating iterative design strategies. It can also be complex algorithms that borrow from evolutionary biology for self-modifying and adaptive learning.

**Ensemble learning** is based on combining multiple weak learners to create a strong learner.

(i) Input training data to build multiple models, and the data distribution function determines whether each model receives complete training data or a part of samples (you can change the training data or algorithm)

(ii) After the model is created it can produce a series of predictions, and the inconsistency in the predictions can be reconciled with the composition function. Some ensembles can even use another model to learn a combination function from combinations of various predictions, a process we call stacking.

Self-help aggregation is one type of ensemble learning method. Bagging uses a bootstrap sampling method on the original data to generate many training data sets. These data sets use a single machine learning algorithm to generate multiple models, and then use voting (classification problems) or averaging (numeric prediction) to combine the predicted values. Bagging favors unstable learners (models that vary widely with small changes in the data), because it ensures that ensemble learning has good diversity even when the variance between datasets for bootstrapping is small. For this reason, bagging is often used in conjunction with decision trees, which tend to undergo large changes with small changes in the data.

```
library(ipred)
mybag<-bagging(default~.,data=credit,nbagg=25)
credit_pred<-predict(mybag,credit)

library(caret)
set.seed(300)
ctrl<-trainControl(method="cv",number=10)
train(default~.,data=credit,method="treebag",trControl=ctrl)
```

We can also configure the bagging process by using the bag() function of the caret package. We need to specify a model function for fitting, a function for prediction, and a function for aggregating votes. Let's take an example, and then we use the same format to create our own function, we can use bagging to implement arbitrary machine learning algorithms.

```
str(svmBag)
svmBag$fit
bagctrl<-bagControl(fit=svmBag$fit,predict=svmBag$pred, aggregate=svmBag$aggregate)
svmbag<-train(default~.,data=credit,"bag",trControl=ctrl,bagControl=bagctrl)
```

Another method based on ensemble learning is **boosting**, which is called adaptive boosting. The algorithm generates a weak classifier to iteratively learn a large proportion of samples that are difficult to classify in the training set, and gives greater weight to samples that are often misclassified. Because it increases the performance of the weak learners to obtain the performance of the strong learners, the performance can be improved by simply adding more weak learners. The resampled data set in boosting is specially constructed to generate complementary models, and all votes are also not equally important and are weighted according to performance. **Random forests** focus on ensemble learning of decision trees, which can handle very large amounts of data, and the so-called "curse of dimensionality" in big data often makes other models fail.

```
m<-randomForest(train,class,ntree=500,mtry=sqrt(p))
p<-predict(m,test,type="response")
```
*train* is the data frame containing the training dataset, *class* is a factor vector representing the category of each row in the training set, *ntree* specifies the number of trees, and *mtry* represents the number of randomly selected features in each split.

### **R Packages**

Finally, we introduce some R packages for machine learning, and we can query the usage methods of related packages when we need to use them:

* Use [RCurl add package](http://ww.omegahat.org/RCurl) to scrape data from the Internet;
* Use [XML add-on package](http://www.omegahat.org/RSXML) to read and write data in XML format;
* Use the rjson add package to read and write JSON
* Use the xlsx add-on package to read and write Excel spreadsheets
* Add package with data.table to make data frame operations faster
* Build disk-based dataframes with the ff add package
* Add package with bigmemory to use large matrices
* Use the [foreach add-on package](http://www.revolutionanalytics.com/) to handle parallelism
* Parallel cloud computing with MapReduce and Hadoop add-ons
* An option for parallel processing is to use a computer **graphics processing unit (GPU)** to enhance the speed of mathematical calculations. 