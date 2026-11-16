---
layout: post
title:  "Machine Learning with R (3)"
categories: AI
tags: Regression
--- 

* content
{:toc}  

As time goes by, I go to the part about regression. In the meanwhile, I am watching Andrew Ng's Machine Learning online course, which also covers regression. I read the book like facing a black box but very useful. Andrew's video tells me why, and I can look into the methods more deeply.




### **Regression**

We can use the regression method to predict numerical data, focusing on the relationship between dependent variables and independent variables. Traditional regression methods include linear regression, logistic regression, and Poisson regression. 

Linear regression assumes that the distribution of the dependent variable is normal distribution, which is not true in real life. It can be used for (i) estimating the effect of a method (ii) hypothesis testing to show whether the null hypothesis is more likely to be true or not. (iii) estimating the strength and consistency of the relationship to assess whether the result is due to chance.

In multiple linear regression, we can use a matrix to calculate the coefficient vector:
```
# creating a simple multiple regression function
reg <- function(y, x) {
  x <- as.matrix(x)
  x <- cbind(Intercept = 1, x)
  solve(t(x) %*% x) %*% t(x) %*% y
}
```

#### **Exploring Data** 

We use cor() to create the coefficient matrix, so as to explore the relationship between features.

We use pairs() to create the scatter matrix to visualize the relationship between features, and we use can the advanced version pairs.panels() to achieve this.
```
# exploring relationships among features: correlation matrix
cor(insurance[c("age", "bmi", "children", "charges")])

# visualing relationships among features: scatterplot matrix
pairs(insurance[c("age", "bmi", "children", "charges")])
```
#### **Build the model**

We can use the lm() function to fit the data with linear regression function:

`
model <- lm(distress_ct ~ temperature + pressure + launch_id, data = launch)
`

#### **Evaluation**

We can use the summary() function to analyze the predicted regression model.

`summary(model)`
 
1. Adding a nonlinear relationship and increasing the exponent of independent variables. 
2. If the influence of a feature is not cumulative, but only when the value of the feature reaches a given threshold, then convert the numeric variable into a binary indicator.
3. If some features interact with each other and have a comprehensive effect on the dependent variable, then add the effect of the interaction.
4. Put it all together to build an improved regression model.

```
insurance$age2 <- insurance$age^2

# add an indicator for BMI >= 30
insurance$bmi30 <- ifelse(insurance$bmi >= 30, 1, 0)

# create final model
ins_model2 <- lm(charges ~ age + age2 + children + bmi + sex + bmi30*smoker + region, data = insurance)
```

### **Regression Tree**

The regression tree does not use the linear regression method, instead, it uses the average of the instances that reaches the leaf nodes. Similar to the decision tree used for classification, the regression tree uses a similar way to do the segmentation. A common segmentation method is to subtract the weighted standard deviation of the segmented tree from the original value. The greater the reduction, the greater the consistency of the segmented tree. We can use the mean absolute error the evaluate the model performance:

```
# function to calculate the mean absolute error
MAE <- function(actual, predicted) {
  mean(abs(actual - predicted))  
}
```
It is using RWeka() to build a model tree, which is to build a decision tree with a linear regression model at the leaves. It can hierarchy out the simple models, so each subtree will fit several portions of the training dataset, and the overall model tree will fit the full training dataset. It can be used for classification problems by transforming the classification problem into a problem of function approximation.

```
library(RWeka)
m.m5p <- M5P(quality ~ ., data = wine_train)

# display the tree
m.m5p

# get a summary of the model's performance
summary(m.m5p)

# generate predictions for the model
p.m5p <- predict(m.m5p, wine_test)

# summary statistics about the predictions
summary(p.m5p)

# correlation between the predicted and true values
cor(p.m5p, wine_test$quality)

# mean absolute error of predicted and true values
# (uses a custom function defined above)
MAE(wine_test$quality, p.m5p)
```