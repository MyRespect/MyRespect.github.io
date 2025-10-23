---
layout: post
title:  "Machine Learning with R (5)"
categories: AI 
tags: Association K-Means
--- 

* content
{:toc}  

This post will cover association rules and k-means clustering for identifying associations among items in transactional data. I will introduce the start-to-finish steps needed for using association rules to perform a market basket analysis on real-world data.   




### **Apriori Algorithm**

Association rules, as unsupervised learning, are one type of solution to solve the Big Data problem. It can extract knowledge from large databases without any prior knowledge about patterns. The association rules and transactional data are as follows:

{peanut butter, jelly} --> {bread}

**Apriori property**: All subsets of a frequent itemset are also frequent.

**support and confidence**: If a rule has both high support and high confidence, it is called a strong rule. Support refers to the frequency of itemsets appearing in the data, and support(A, B) is the same as P(A, B); confidence indicates that the occurrence of items or itemsets X in transactions leads to the occurrence of items or itemsets Y The ratio, confidence(A->B) is the same as P(B\|A).

**Lift**: Assuming that a class of goods has been purchased, lift is used to measure the general purchase rate of a class of goods relative to it. lift(x->y)=confidence(x->y)/support(x).

There are two main steps in creating a rule. (i) All itemsets that meet the minimum support threshold are identified; (ii) Rules are created based on these items that meet the minimum confidence threshold.

**Sparse matrix**: Each row of the sparse matrix represents a transaction, and each column represent each item that may appear in the shopper's shopping basket. A sparse matrix does not actually store a complete matrix in memory, but only stores the cells occupied by a product. In this way, the memory efficiency of this structure is higher than that of a matrix or data frame of comparable size.

The following introduces several functions in the association rule in R package:

* The read.transactions() function can generate a sparse matrix for transactional data;
* The inspect() function can be used to view transaction data and verify association rules;
* The itemFrequency() function checks the product frequency ratio;
* The itemFrequencyPlot() function visualizes the support of the product;
* The image() visualizes transaction data by drawing a sparse matrix;
* The sample() function can randomly sample the data;
* The sort() can be used to reorder the list of rules;
* The subset() function provides a way to find a subset of transactions or rules, where the keyword items matches items that appear anywhere in the rule:

```
berryrules <- subset(groceryrules, items %in% "berries")
```

```
myrules <- apriori(data=mydata, parameter=list(support=0.1,confidence=0.8,minlen=1))
#minlen:the least number of rules
```

### **K-Means Cluster**

The principle of clustering is that the samples in a group are very similar to each other but completely different from the samples outside the group. 

If you start with unlabeled data, then you can first use clustering to create categorical labels, then, you can apply a supervised learning algorithm, such as decision trees, to find important predictors of classes, this is called semi-supervised learning.

The k-means algorithm involves assigning each of the n cases to one of the k classes, where k is a predefined number. The algorithm uses a heuristic process that finds a locally optimal solution, starting with an initial guess at the class assignment, and then slightly revising the assignment to see if the change improves homogeneity within the class. K-means takes the eigenvalues as the coordinates of multi-bit feature space, first select k points in the feature space as the class centers, and these centers are the catalysts that make the remaining cases fall into the feature space and calculate the distance, such as Euclidean distance.

The model can be trained using the *kmeans()* function in the *stats* package and the *aggregate()* function can calculate statistics for subgroups of the data.

1. Use distance to assign and update classes, and transfer the initial class center to a new location, which becomes the centroid;
2. Select an appropriate number of clusters, and the elbow method is used to measure how the homogeneity within the class changes for different k values.

### **Missing Values** 

* A simple way is to exclude records with missing values;
* For variables like gender, another approach is to include missing values as a separate category. Perform virtual coding to convert nominal variables such as gender into numerical variables that can be used for distance calculation.
* For variables like age, we use imputation to fill in missing values based on a guess at the likely true value, typically based on the mean of the corresponding values.