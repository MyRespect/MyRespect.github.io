---
layout: post
title:  "Machine Learning with R (2)"
categories: AI
tags: KNN Naive&nbspBayes Decision&nbspTree
--- 

* content
{:toc}  

In this blog, I will introduce three main machine learning models and their implementation in R: K-Nearest Neighbors, Naive Bayes, and Decision tree. I am not going to go into those methods seriously now, but I hope I will have a better understanding of those methods after I watch Android Ng's online course and read Zhihua Zhou's book.




### **KNN**

The K-Nearest Neighbors (KNN) method does not rely on learning model parameters. Instead, it is based on examples, which is kind of lazy. KNN treats features as coordinates in a multi-dimensional feature space, and the similarity between instances is measured by Distance Functions such as Euclidean distance. We use K to specify the number of neighbors and then vote for classification. Thus, the choice of K is very important. A large K will reduce the impact of noisy data on the model but will bias the classifier, and vice versa. A common practice is to set K as the square root of the number of instances in the training dataset; Or we can choose the best K by testing on multiple testing sets. The function `p<-knn(train, test, class, k)` provides an implementation of KNN.

Typically we need to normalize the data such as min-max normalization, z-score standardization for numerical features; For nominal data, we need to transform them into a numerical format such as the "dumb variable encoding": 1 denotes one category and 0 denotes other categories.

### **Naive Bayes**

The Bayesian-based method uses the training data to calculate the probability of each category based on the value of features. The Naive Bayes is very naive because it assumes all the features of the dataset have the same importance and independence. The function naiveBayes() is as follows:

```
sms_classifier <- naiveBayes(sms_train, sms_raw_train$type, laplace = 0)
sms_test_pred <- predict(sms_classifier, sms_test)
CrossTable(sms_test_pred, sms_raw_test$type, prop.chisq=FALSE, prop.t=FALSE, dnn=c('predicted','actual'))
```

Laplace estimator essentially adds a small number to each count on the frequency table, ensuring the probability of each feature occurring is non-zero.   

The wordcloud: `wordcloud(spam$text, max.words=40, scale=c(3,0.5))`  

### **Decision Tree**

The decision tree is like a flowchart, starting from the root node that represents the entire dataset. Then, the model selects one feature that best predicts the target classes. The instances are divided into groups of different values according to the feature. For each branch, the model implements the "divide and conquer" idea to divide the branch iteratively by selecting the best candidate features until the stopping criterion is reached.

The C5.0 algorithm has become the industry standard for generating decision trees that are easy to interpret and deploy: `m <- C5.0(train, class, trials=1, costs=NULL)`.

### **Text Mining**

The text mining package "tm": The function "Corpus()" creates an R object to store the text `sms_corpus <- Corpus(VectorSource(sms_raw\$text))`.

    corpus_clean <- tm_map(sms_corpus,tolower)    
    corpus_clean <- tm_map(corpus_clean, removeNumbers)   
    corpus_clean <- tm_map(corpus_clean, removeWords,stopwords())  
    corpus_clean <- tm_map(corpus_clean, removePunctuation)  
    corpus_clean <- tm_map(corpus_clean, stripWhitespace)
   
To find the frequently-occurring words, we can use the "findFreqTerm()" function, which inputs a document-word matrix and returns a character vector. The character vector contains words that occur no less than the specified frequency. The function "DocumentTermMatrix()" inputs a corpus and creates a sparse matrix, where a row represents a document and columns represents words. Each cell stores a number representing the number of times the "column word" appears in the "row document".


Define a function to covert Numeric to Factor:
```
covert_counts <- function(x){
    x <- ifelse(x>0,1,0)
    x <- factor(x,levels=c(0,1),labels=c("No","Yes"))
    return (x)
}
```