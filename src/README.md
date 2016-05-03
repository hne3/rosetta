These notes are from Haley! This program finds a semaphore and changes a picture of a traffic light at the bottom according to its value.

Semaphores should be processed using opt_cpp_backend by running vg_to_opt_trace.py on a file with semaphores included.

Here is how to use this frontend:
1. Install all dependencies
2. Run npm start
3. Go to localhost:8080/rosetta.html
4. Check out the stoplight at the bottom! It will reflect the value of your semaphore (1 is green, 0 is red, uninitialized/other is yellow.)

Future improvements:
-Align stoplight with actual semaphore object (under "objects")
-Support for multiple stoplights