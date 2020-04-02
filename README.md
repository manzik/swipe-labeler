# swipe-labeler
Label your data easier for classification tasks by swiping on your touch-enabled device.
# Getting started
Clone the repo:
```bash
git clone https://github.com/manzik/swipe-labeler/
```
Enter the following command to start a server on port `3000` for labeling the images inside folder `swipe-labeler/sample_pet_images` with classes `cat` for left swipe and `dog` for right swipe, and saving the labeled results in the csv file `labels.csv`:
```bash
node swipe-labeler -d swipe-labeler/sample_pet_images/ -s labels.csv --label-left cat --label-right dog -p 3000
```
Hint: You can also use `--label-up` argument if you need to label 3 classes.
