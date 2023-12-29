---
layout: post
title:  "TensorFlow Notes"
categories: System
tags: TensorFlow
--- 

* content
{:toc}

TensorFlow is an open source software library for high performance numerical computation, and it is developed into TF2.0. Here I add some new notes about tensorflow new features, for more details, you can refer to the official [website](https://www.tensorflow.org/).




### **Main Changes**

1. In TF2.0, the eager execution dynamic graph is used by default in TF2.0, and the calculation will be executed directly. If we need to build a static computation graph, we only need to add the @tf.function decorator to the python function. An important change in TF2 is to remove tf.Session(). The more complex the computation graph is, the more execution efficiency and acceleration effect of using static graphs.

2. The tool that converts python code into graph representation code is called autoGraph. If a function is decorated with @tf.function, then autoGraph will be called automatically, thus converting the python function into a static executable graph representation.

3. When the function decorated with @tf.function is called for the first time, the function is executed and tracked, eager will be disabled in this function, so each tf.API will only define one to generate tf.Tensor output node.

4. When using tf.function, you need to check if the function is feasible in a static graph when converting a dynamic graph into a static graph. In a dynamic graph, tf.variable is an ordinary python variable. It will be destroyed beyond its scope. In the static graph, tf.valuable is a persistent node in the calculation graph, which is not affected by the scope of python. We can use tf.variable as a parameter of the function Pass in, call tf.variable as a class attribute.

```
(1) Every tf.Session.run call should be replaced by a Python function.
    The feed_dict and tf.placeholders become function arguments.
    The fetches become the function's return value.
(2) Use tf.Variable instead of tf.get_variable.
(3) Prefer tf.keras.Model.fit over building your own training loops.
(4) Use tf.data datasets for data input.
```
```
import tensorflow_datasets as tfds
datasets, info = tfds.load(name='mnist', with_info=True, as_supervised=True)
mnist_train, mnist_test = datasets['train'], datasets['test']
def scale(image, label):
    image = tf.cast(image, tf.float32)
    image /= 255
    return image, label
train_data = mnist_train.map(scale).shuffle(BUFFER_SIZE).batch(BATCH_SIZE).take(5)
test_data = mnist_test.map(scale).batch(BATCH_SIZE).take(5)
```

### **Using GPU**

We can specify the running device by tf.device(). For example, "/cpu:0" is the cpu of your machine, "/device:GPU:0":The first GPU of your machine, "/device:GPU:1":The second GPU of your machine.
```
# specify in code, or you can set when you run the python file
import os
os.environ["CUDA_VISIBLE_DEVICES"] = "2"

# allocate gpu according to its need
config = tf.ConfigProto()
config.gpu_options.allow_growth = True

# specifiy GPU memory fraction
config.gpu_options.per_process_gpu_memory_fraction = 0.4

# TF2.0
gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    for gpu in gpus:
      tf.config.experimental.set_memory_growth(gpu, True)

gpus = tf.config.experimental.list_physical_devices('GPU')
if gpus:
    tf.config.experimental.set_visible_devices(gpus[0], 'GPU')
```

### **Training step**

If you need more flexibility and control, you can have it by implementing your own training loop. There are three steps:

1. Iterate over a Python generator or tf.data.Dataset to get batches of examples.

2. Use tf.GradientTape to collect gradients.

3. Use a tf.keras.optimizer to apply weight updates to the model's variables.

Calling minimize() takes care of both computing the gradients and applying them to the variables. If you want to process the gradients before applying them you can instead use the optimizer in three steps:

1. Compute the gradients with tape.gradient().

2. Process the gradients as you wish.

3. Apply the processed gradients with apply_gradients().

```
model = tf.keras.Sequential([
    tf.keras.layers.Conv2D(32, 3, activation='relu',
                           kernel_regularizer=tf.keras.regularizers.l2(0.02),
                           input_shape=(28, 28, 1)),
    tf.keras.layers.MaxPooling2D(),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dropout(0.1),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.BatchNormalization(),
    tf.keras.layers.Dense(10, activation='softmax')
])

optimizer = tf.keras.optimizers.Adam(0.001)
loss_fn = tf.keras.losses.SparseCategoricalCrossentropy()

# Create the metrics
loss_metric = tf.keras.metrics.Mean(name='train_loss')
accuracy_metric = tf.keras.metrics.SparseCategoricalAccuracy(name='train_accuracy')

@tf.function
def train_step(inputs, labels):
    with tf.GradientTape() as tape:
      predictions = model(inputs, training=True)
      regularization_loss = tf.math.add_n(model.losses)
      pred_loss = loss_fn(labels, predictions)
      total_loss = pred_loss + regularization_loss

    gradients = tape.gradient(total_loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))
    # Update the metrics
    loss_metric.update_state(total_loss)
    accuracy_metric.update_state(labels, predictions)


for epoch in range(NUM_EPOCHS):
    # Reset the metrics
    loss_metric.reset_states()
    accuracy_metric.reset_states()

    for inputs, labels in train_data:
      train_step(inputs, labels)
    # Get the metric results
    mean_loss = loss_metric.result()
    mean_accuracy = accuracy_metric.result()

    print('Epoch: ', epoch)
    print('  loss:     {:.3f}'.format(mean_loss))
    print('  accuracy: {:.3f}'.format(mean_accuracy))
```

### **Custom Layer**

```
class MyDenseLayer(tf.keras.layers.Layer):
    def __init__(self, num_outputs):
      super(MyDenseLayer, self).__init__()
      self.num_outputs = num_outputs
    
    def build(self, input_shape):
      self.kernel = self.add_variable("kernel", shape=[int(input_shape[-1]), self.num_outputs])
    
    def call(self, input):
      return tf.matmul(input, self.kernel)
  
layer = MyDenseLayer(10)
print(layer(tf.zeros([10, 5])))
print(layer.trainable_variables)
```

### **Custom Model**

```
class MNISTModel(Model):
    def __init__(self):
        super(MNISTModel, self).__init__()
        self.conv1 = Conv2D(32, 3, activation='relu')
        self.flatten = Flatten()
        self.d1 = Dense(128, activation='relu')
        self.d2 = Dense(10, activation='softmax')

    def call(self, x):
        x = self.conv1(x)
        x = self.flatten(x)
        x = self.d1(x)
        return self.d2(x)
```

### **Basics for 1.0**

It is still possible to run 1.X code, unmodified (except for contrib), in TensorFlow 2.0:

```
import tensorflow.compat.v1 as tf
tf.disable_v2_behavior()

The tf.layers module is used to contain layer-functions that relied on tf.variable_scope to define and reuse variables.
If you were using regularizers of initializers from tf.contrib, these have more argument changes than others.
# replace tf.contrib.layers.
tf.keras.layers.Conv2D(32, 3, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(0.04), input_shape=(28, 28, 1))
```

```
import tensorflow as tf

x=tf.placeholder(tf.float32, shape=...)
y=tf.variable(0, name='x', dtype=tf.float32)
z=tf.constant(2.0, shape=..., dtype=...)
w=tf.get_variable('w', [1,2,3], initializer=tf.contrib.layers.xavier_initializer(seed=0))

tf.nn.conv2d(input, filter, strides, padding, use_cudnn_on_gpu=True, data_format='NHWC', dilations=[1, 1, 1, 1], name=None)

tf.nn.max_pool(value, ksize=[1,f,f,1], strides=[1,s,s,1], padding, data_format='NHWC', name=None) #ksize: kernel size, a window of size(f,f), stride of size(s,s)

tf.contrib.layers.flatten(inputs, outputs_collections=None, scope=None) # input is a tensor of size[batch_size,...], return a flattened tensor with shape [batch_size, k].

tf.contrib.layers.fully_connected(
    inputs,
    num_outputs,
    activation_fn=tf.nn.relu,
    normalizer_fn=None,
    normalizer_params=None,
    weights_initializer=initializers.xavier_initializer(),
    weights_regularizer=None,
    biases_initializer=tf.zeros_initializer(),
    biases_regularizer=None,
    reuse=None,
    variables_collections=None,
    outputs_collections=None,
    trainable=True,
    scope=None
) # fully_connected creates a variable called weights, representing a fully connected weight matrix, which is multiplied by the inputs to produce a Tensor of hidden units, returns the tensor variable representing the result of the series of operations. The input is a tensor of at least rank 2 and static value for the last dimension; i.e. [batch_size, depth], [None, None, None, channels]


tf.nn.softmax_cross_entropy_with_logits(_sentinel=None, labels=None, logits=None, dim=-1, name=None)

tf.math.reduce_mean(input_tensor, axis=None, keepdims=None, name=None, reduction_indices=None, keep_dims=None) #Reduces input_tensor along the dimensions given in axis, if keepdims is true, the reduced dimensions are retained with length 1.

tf.reshape(x, [-1, 28, 28, 1])
tf.split(x,n,0) #ｘ is the Tensor to split, n is the number of splits, 0 is the dimension along which to split.

tf.nn.depthwise_conv2d(input, filter, strides, padding, rate=None, name=None, data_format=None) # Must have strides = [1, stride, stride, 1], Given a 4D input tensor and a filter tensor of shape [filter_height, filter_width, in_channels, channel_multiplier], containing in_channels convolutional filters of depth 1, depthwise_conv2d applies a different filter to each input channel (expanding from 1 channel to channel_multiplier channels for each), then concatenates the results together. The output has in_channels * channel_multiplier channels.
```
### **Optimization**

* Gradient Descent: taking gradient step with respect to all m examples on each step

* Stochastic GD: using only 1 training examples before updating the gradients

* Minibatch GD: using a small part of examples

* Momentum: taking into account the past gradients to smooth out the update, and storing the direction of the previous gadients.This will be the exponentially weighted average of gradient on previous steps.

* Adam: combing ideas from RMSProp and Momentum.

### **Save Model**

checkpoints is a binary file，which mapping variables into corresponding tensors．

```
saver=tf.train.Saver(...variables...)
sess = tf.Session()
for step in xrange(1000000):
    sess.run(..training_op..)
    if step % 1000 == 0:
        # Append the step number to the checkpoint name:
        saver.save(sess, 'my-model', global_step=step)   #  ==> filename: 'my-model-[step]'
```

tf.app.flags get parameters from the coommand line:
```
flags = tf.app.flags
FLAGS = flags.FLAGS
flags.DEFINE_float('learning_rate', 0.01, 'Initial learning rate.')
```
From [stackoverflow](https://stackoverflow.com/questions/33932901/whats-the-purpose-of-tf-app-flags-in-tensorflow), note that this module is currently packaged as a convenience for writing demo apps, and is not technically part of the public API, so it may change in future. We recommend that you implement your own flag parsing using argparse or whatever library you prefer.

### **Load Model**

```
# freeze model

pickle.dump(predictions, open("predictions.p", "wb"))
pickle.dump(history, open("history.p", "wb"))
tf.train.write_graph(sess.graph_def, '.', 'har.pbtxt')
saver.save(sess, save_path="./har.ckpt")
sess.close()

from tensorflow.python.tools import freeze_graph

MODEL_NAME = 'har'

input_graph_path = MODEL_NAME + '.pbtxt'
checkpoint_path = MODEL_NAME + '.ckpt'
restore_op_name = "save/restore_all"
filename_tensor_name = "save/Const:0"
output_frozen_graph_name = 'frozen_' + MODEL_NAME + '.pb'

freeze_graph.freeze_graph(input_graph_path, input_saver="",
                          input_binary=False, input_checkpoint=checkpoint_path,
                          output_node_names="y_", restore_op_name="save/restore_all",
                          filename_tensor_name="save/Const:0",
                          output_graph=output_frozen_graph_name, clear_devices=True, initializer_nodes="")

#Load Model

with tf.Graph().as_default():
    output_graph_def = tf.GraphDef()

    with open(pb_file_path, "rb") as f:
        output_graph_def.ParseFromString(f.read())
        _ = tf.import_graph_def(output_graph_def, name="")

    with tf.Session() as sess:
        init = tf.global_variables_initializer()
        sess.run(init)
        input_x = tf.get_default_graph().get_tensor_by_name("input:0")
        out_softmax = sess.graph.get_tensor_by_name("prob:0")
        out_result = sess.run(out_softmax, feed_dict={input_x: reshaped_segments})
```