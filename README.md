# Swipe Labeler
Faster and easier dataset labeling for classification tasks by swiping on touch devices.  
<p align="center"><img align="center" src="demo/demo.gif"/></p>  

# Getting started
You can start by cloning the repository:
```bash
~$ git clone https://github.com/manzik/swipe-labeler/
```
Enter the following command to start a server on port `3000` for labeling the images inside folder `swipe-labeler/sample_pet_images` with classes `cat` for left swipe and `dog` for right swipe, and saving the labeled results in the csv file `labels.csv`:
```shell
~$ node swipe-labeler -d swipe-labeler/sample_pet_images/ -s labels.csv --label-left cat --label-right dog -p 3000
Labels file doesn't exist, creating the labels file.
The server is running. You can navigate to http://<public_ip>:3000 on your touch-enabled device or http://localhost:3000 on your machine to access the labeler.
```
**\*** You can also use `--label-up` argument if you need to label 3 classes.  
**\*** By using the same --save (-s) argument next time, you can resume the labeling process.
Navigate to the machine's address on the specified port to access the labeler.  
Once done, the `labels.csv` file will look like this:

| file          | label         |
| --------------|:-------------:|
| pet_01.jpg    | cat           |
| pet_02.jpg    | dog           |
| pet_03.jpg    | cat           |
| pet_04.jpg    | dog           |
| pet_05.jpg    | dog           |
| ...           | ...           |


#   
- The frontend swiping implementation is from [here](https://www.outsystems.com/blog/posts/gestures_glamour_swipeable_stacked_cards/).
- The sample images have been collected from the Unsplash website.
