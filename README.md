# Swipe Labeler
Easier and more accessible dataset labeling for classification tasks by swiping on touch-enabled devices.  
It also enables you to label the dateset on your machine remotely using your phone.

<p align="center"><img align="center" src="demo/demo.gif"/></p>  

# Getting started
You can start by installing the package:
```command
~$ npm install -g swipe-labeler
```
For the purpose of using the sample images provided, you can also clone the repository:
```command
~$ git clone https://github.com/manzik/swipe-labeler/
```
Enter the following command to start a server on port `3000` for labeling the images inside folder `swipe-labeler/sample_pet_images` with classes `cat` for left swipe and `dog` for right swipe, and saving the labeled results in the csv file `labels.csv`:
```command
~$ swipe-labeler -d swipe-labeler/sample_pet_images/ -s labels.csv --label-left cat --label-right dog -p 3000
Labels file doesn't exist, creating the labels file.
The server is running. You can navigate to http://<public_ip>:3000 on your touch-enabled device or http://localhost:3000 on your machine to access the labeler.
```

You can see a full list of options available by entering `swipe-labeler -h`:
```command
~$ swipe-labeler -h
Usage: swipe-labeler [options]

Options:
  -d, --data <folderpath>     folder path for data to label
  -s, --save <filepath>       file path to save the resulting labels csv file
  -p, --port <port>           Port number (default: "8080")
  -ll, --label-left <label>   name for left swipe label
  -lr, --label-right <label>  name for right swipe label
  -lu, --label-up [label]     name for up swipe label
  -hc, --hide-class-numbers   hide the number of labled and remaining items in client's browser (default: false)
  -h, --help                  display help for command
```
**\*** By using the same --save (-s) argument when starting the server next time, you can resume the labeling process.  

Navigate to the machine's address on the specified port to access the labeler.  
Every time you label an image, a line for the input label and the corresponding file gets appended to the `labels.csv` file on the go, and it will look like this in the end:

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
