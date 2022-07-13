## We now have two ways of modeling the same data
The simple method (no data, only static methods) has some advantages:

- Easier to write
- Fewer SQL queries (look at delete methods)
- Difficult to implement functionality that uses individual data

Nice for simple uses- pet projects.

The more complex method (instantiated objects with data and real methods)
- Easier to do things with data
- Easier to validate
- Reduces the need to pass ids around
  - prof1.delete() vs User.delete(prof1.id) 

