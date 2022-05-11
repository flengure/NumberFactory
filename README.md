NumberFactory
=============

Starting out as a small javascript to convert a string representation of a number into words,
we are evolving into a general purpose utility that can pull some uncommon properties from numbers

It creates a javascript object that has certain methods that operate on the number.


to use, instantiate a new object like so

const o = new NumberFactory("676,38.353");

some of the expected output

| property        | output                                                                   |
| --------------- | ------------------------------------------------------------------------ |
| o.words         | sixty seven thousand six hundred and thirty eight point three five three |
| o.integerString | 67638 |
| o.decimalString | 353 |
| o.formatedString | 67,638.353 |
| o.integerPrecision | 5 |
| o.decimalPrecision | 3 |
| o.precision | 8 |
| o.wordList | zero,one,two,...twenty,thirty,forty,...,hundred,thousand,million,... |


vitrexx2002, consider adding more functionality
-----------------------------------------------
 
for example

o.isEven --> return true if the number is even, otherwise false

o.hex  --> convert the number to hexadecimal output

o.isPrime -> check if the number is a prime number


Ammend the html file to show off the functions of your script


I think you can use something called 'live server' in vscode.

or
but i just openied a command prompt in the folder that conatins index.html and ran

python3 -m http-server 8001

this starts a webserver using the current directory as its home and then the project can be accesed  by pointing my web browser to

http://localhost:8001



