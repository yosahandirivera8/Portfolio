var numGuests, numTables, divide, result;
var numGuests = prompt("How many guests do you have?")
var numTables = prompt("How many tables do you want?")
  
var divide = Math.floor(numGuests/numTables);
var result = numGuests % numTables
alert( " Your " + numGuests + " guests will be seated as follows: " + (numTables-1) + " tables of " + divide + " guests and one table of " + ( divide + result ) ) ;


