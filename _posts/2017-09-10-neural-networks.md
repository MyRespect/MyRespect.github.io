---
layout: post
title:  "Notes for Deep Learning"
categories: AI
tags: DNN CTC
--- 

* content
{:toc}

In this post, I mainly make notes about some special deep neural networks (DNNs) and a guide to an efficient way to build DNN architectures, hyperparameter selection, and tuning.




### **Convolution**

Every pixel of the output layer is computed by F\*F part of the input layer Inner product the F\*F filter, and then applied by the activation function, for example, if there are 10 filters which are 3\*3\*3, then we have (27+1)\*10=280 parameters.

### **Residual**

* identity block, when input dimension is equal to output dimension

* convolution block, when input and output dimension does not match.
The main difference between the above two blocks is there is a conv2D layer in the shortcut path.

### **Alchemy**

1. Hyperas which enables us to take advantage of GPU acceleration enabling you you train models at least 10x faster and is also an easy way to approach hyper-parameter tuning. Or you can use GridSearchCV, which does not make use of GPU.

2. Sparse categorical cross-entropy is used when output is NOT one-hot encoded(1,2,3 etc.) and categorical cross-entropy when output is one-hot encoded( [1,0,0] or [0,1,0] ). 

3. It can be inferred from the graph that the data set is balanced as we have nearly the same amount of data points in every class. This check is necessary for choosing Accuracy as a metric. Another alternative could be F1 score.

4. Gradient exploding or vanishing: learning_rate, batch_norm, RELU, LSTM, residual network,  train per layer and then fine-tuning, gradient clipping, the number of layers.

5. Saddle points and local optima: learning rate, optimizer: Adam or RMSProp.

6. No convergence: adaptive learning rate optimizers like Adam or use decay in our optimizers.

7. Make sure you make the best out of your simple architecture and slowly increase complexity and components if required.

8. If the number of layers is high, it might introduce problems like over-fitting and vanishing, and exploding gradient problems. The lower number may cause high bias. Also, the number of hidden units per layer depends on the data size.

9. Sigmoid and tanh are only used for shallow networks, RELU is pretty good for deep networks.

10. The problem with SGD is that the frequent updates and fluctuations ultimately complicate the convergence to the exact minimum and will keep overshooting due to the frequent fluctuations. Mini Batch Gradient Descent can reduce the variance in the parameter updates, which can ultimately lead us to much better and more stable convergence. We can use these good optimizers: Momentum, Adagrad, RMSProp, and Adam.

11.	Learning rate, for SGD, 0.1 generally works well, for Adam-0.001/0.01 is good. You can try in powers of 10 from 0.001 to 1. You can use the decay parameter to reduce your learning with the number of iterations. Generally, it is better to use adaptive learning rate algorithms like Adam than to use a decaying learning rate.

12.	Initialization, batch size, number of epochs, dropout, L1/L2 regularization.

13.	Use the train to learn various patterns in data, validation to learn values for the hyperparameters, and test to see if the model generalizes well.

14.	Kernel/Filter size: Smaller filters collect as much local information as possible, and bigger filters represent more global, high-level, and representative information. If you think that differentiated objects are some small and local features you should use small filters. In general, we use filters with odd sizes.

15.	Padding is generally used to add columns and rows of zeroes to keep the spatial sizes constant after convolution, doing this might improve performance as it retains the information as the borders.

16.	The more the number of channels, the more the number of filters used, the more are features learned, and the more the chances to over-fit and vice-versa.

17.	Batch normalization: generally in deep neural network architectures, the normalized input after passing through various adjustments in intermediate layers becomes too big or too small, which causes a problem of internal co-variate shift which impacts learning. The batch normalization layer should be placed in the architecture after passing it through the layer containing the activation function and before the dropout layer(if any). An exception is for the sigmoid activation function wherein you need to place the batch normalization layer before the activation to ensure that the values lie in the linear region of the sigmoid.

18.	Keep the feature space wide and shallow in the initial stages of the network, and then make it narrower and deeper towards the end.

19.	Always start by using smaller filters to collect as much local information as possible, and then gradually increase the filter width to reduce the generated feature space width to represent more global, high-level, and representative information. The number of filters is increased to increase the depth of the feature space thus helping in learning more levels of global abstract structures. One more utility of making the feature space deeper and narrower is to shrink the feature space for input to the dense networks.

### **CTC**

Connectionist temporal classification (CTC) is a method of calculating the loss value, which is mainly used for the training of serialized data without alignment. In real-world sequence learning tasks, it is necessary to predict the label of the sequence from noise and unformatted data. For example, in speech recognition, a sound signal is converted into words or sub-word units. RNN requires pre-segmented training data, and converts the model into a label sequence through post-processing. The application is limited. How to directly predict the label on the unsegmented sequence? A better combination is LSTM+CTC. Because the output of the network can be seen as: for a given input, all possible corresponding labels can be regarded as a probability distribution on the sequence. Given this distribution, the objective function can directly maximize the probability of the correct label.

RNN supports the output representation required by the CTC model, converts the network output into a conditional probability distribution on the label sequence, and then for a given input, the network classifies the most likely label by selecting the output. These outputs define the probability of all possible ways of the alignment of the label sequence to the input sequence. The total probability of any label sequence can be regarded as the cumulative sum of the probabilities corresponding to its different alignment forms.
