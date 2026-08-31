---
layout: post
title:  "Machine Learning with R (1)"
categories: AI
tags: ML R
--- 

* content
{:toc}

In the following series of blogs, I will make some notes about the book "Machine Learning with R" written by Brett Lantz. In this blog, I will start with the introduction of R and Data Management.




### **WorkFlow in ML**

* Machine learning algorithms are virtually a prerequisite for data mining but the opposite is not true.

* Trying to model the noise in data is the basis of the overfitting problem.  

* Collecting data -> Exploring and preparing the data -> Trainga model on the data -> Evaluating model performance -> Improving model performance.  


### **Data Structure in R**

* Vector, all elements contained in a vector must be of the same type; 'NA' means missing value; 'NULL' means no value; other types include integer, numeric, character, and logical; 
	`subject_name <- c("Jason","Tom","Bob");`

* Lists, similar to vectors, can be understood as structures that allow the collection of different types of values; lists are created using the list() function; 

* Data frame, which combines the characteristics of vectors and lists, columns represent attributes, and rows represent instances, using the data.frame() function;

* Factor, an attribute that represents a feature with a category value is called a nominal attribute. In R, the factor() function is applied to represent this attribute data; levels specify all the categories that the data may obtain;

* Matrix, which can only contain a single type of data;
	`m <- matrix(c('a','b','c','d'), nrow=2);`

### **Some Functions in R**

I just noted some main key functions in R for exploring the statistical features of Data, and the most important things are learning to read the manual and using Google.  
 
1. The function `str()` provides a method to display the structure of the data frame;

2. The function `summary()` provides statistics such as min, 1st Qu, Median, Mean, 3rd Qu, and Max;    

3. The function `range()` returns the max and min values, `diff()` means difference, `IQR` get the interquartile range; `quantile()` finds any quantile; and `seq()` produces the vector of the same interval size elements; 
