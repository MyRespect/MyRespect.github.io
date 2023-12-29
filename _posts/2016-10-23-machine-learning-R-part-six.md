---
layout: post
title:  "Machine Learning with R (6)"
categories: AI 
tags: Metrics
--- 

* content
{:toc}  

Today I am going to introduce some methods of evaluation models. I will provide some performance measures that reasonably reflect a model's ability to predict or forecast unseen data. And we will see how to use R to apply those useful measures and methods to the predictive models.  




### **Evaluation**

Why is prediction accuracy not a good enough measure of performance? The main reason is the class imbalance problem, which arises when a large proportion of records in the data belong to the same class. Studying the internal predictive probabilities is very useful for evaluating the performance of a model. In R, you can use probability, posterior, etc. to get the actual predicted probability. The specific parameter usage method is introduced in the grammar in each model.

Confusion matrix, which can be created by the *CrossTable()* function in the *gmodels* package. In addition to accuracy, what are other common performance evaluation indicators? Let's look at some of the functions included in the classification and regression training package *caret*, where confusionMatrix() is another function that creates a confusion matrix.

1. Kappa statistics, the maximum value is 1, indicating the degree of agreement between the predicted value and the actual value. The Kappa() function is also included in the Visualizing Categorical Data (vcd) package; the kappa2() function in the Inter-Rater Realizability (irr) package can be directly used in the data frame The predicted value vector and the actual classification vector calculate the Kappa value. Note that the built-in kappa() function in R has nothing to do with the Kappa statistic presented here.

2. Sensitivity, specificity, precision, recall, F-value. It can be calculated by functions such as sensitivity(), specificity(), posPredValue() in the caret package. The calculation formula of sensitivity and recall is the same, TP/(TP+FN); specificity=TN/(TN+FP); precision=TP/(TP+FP).

For visualization of performance tradeoffs, the *ROCR* package can be used. Creating a visualization using ROCR requires two data vectors, the first containing the predicted class values and the second containing the estimated probabilities of the positive classes. The ROC (Receiver Operating Characteristic) curve is often used to examine the trade-off between finding true positives and avoiding false positives. How to draw it? for example:

```
pred <- prediction(predictions=sms_results$prob_spam, labels=sms_results$actual_type)
pref <- performance(pred, measure="tpr",x.measure="fpr")
plot(pref,main="ROC curve for SMS spam filter", col="blue",lwd=3)
pref.auc<-performance(pred, measure="auc")
```

**Unseen Data Validation**

1. The data set is divided into training set, validation set and test set. Using stratified random sampling avoids the problem of having too many or too few different classes.

2. K-fold cross-validation, the data is divided into k parts, the machine learning model uses 1 fold as evaluation each time, k-1 folds are used to train the model, repeat k times, and then take the average performance index of all folds. Cross-validation datasets can be created using createFolds() in the *cart*add-on package. for example:

```
folds<-createFolds(credit$default,k=10)
cv_results<-lapply(folds,function(x){
	credit_train<-credit[x,]
	credit_test<-credit[-x,]
	credit_model<-C5.0(default~., data=credit_train)
	credit_pred<-predict(credit_model, credit_test)
	credit_actual<-credit_test$default
	kappa<-kappa2(data.frame(credit_actual, credit_pred))$value
	return(kappa)
})
```
