## Geektrust challenge #1 
### Meet The Family

`Geektrust` challenge on [meet the family](https://www.geektrust.in/coding-problem/backend/family)

### Rules or Assumptions
* Names are unique in the entire family, treating name as an id.
* Assuming no re-marriages are there
* Assuming no marriages with in the family
* Assuming while adding child the mother name and child name will be only firstname
* Assuming no third gender


### Class Structure

![class_diagram.png](https://github.com/sureshvarman/Geektrust-family-tree/blob/master/class_diagram.png?raw=true)

`IFamilyMember` - `Interface` to declare the functions to support multi/custom family member logic.
`FamilyMember` - `POJO class` to define properties and actions (functions) for and family member attribute and few more supporting functions.

`IFamilyTree` - `Interface` to declare the functions to support multi/custom family tree logic.
`FamilyTree` - `Concrete class` to define multiple members and supporting functions and also persist the data in entire cycle, acts as a `decorator`

`Irelation` - `Interface` to declare the function to support multiple relations in a family tree. There are multiple relations exists, which can be used to build relation in tree and query relations in tree.

`RelationShipFactory` - `Factory class` to provide an interface to access the corresponding relations and thier message, adding new relation needs only to touch the `Irelations` and its `RelationShipFactory`, This is not made as an abstract factory, since more relations might exists.

`IDB` - `Interface` to declare the functions to support multi/custom database logics
`DB` - `Concrete class` to store and retrieve data acts as a `proxy` for database 

`App` - `Concrete client class` to seperate the `FamilyTree` and the application requirement


### Seed Data Format

#### Member
```
<name>:<gender>
```

#### Member and spouse
```
<name>:<gender>-<name>:<gender>
```

#### Child
```
<tab><child#1>-<theirspouse> #left is child, right is his/her spouse
```
`

### Running Test
```
npm run test
```

#### Test output
```
  Problem
    ✓ Postive test cases (4 ms)
    ✓ Negative test cases

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.38 s
Ran all test suites.
```       

### Running Coverage
```
npm run coverage
```

#### Coverage output
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s 
-------------------|---------|----------|---------|---------|-------------------
All files          |    95.5 |    91.82 |   95.51 |   95.47 |                   
 src               |    97.7 |    94.17 |   98.08 |   97.67 |                   
  app.ts           |   98.88 |    97.44 |   92.31 |   98.88 | 404               
  db.ts            |     100 |      100 |     100 |     100 |                   
  family-member.ts |    91.3 |    77.78 |     100 |    90.7 | 26,30,127,139     
  family-tree.ts   |   95.24 |     87.5 |     100 |   95.24 | 98                
  family-utils.ts  |     100 |      100 |     100 |     100 |                   
  ...nse-parser.ts |     100 |      100 |     100 |     100 |                   
  seed-data.ts     |     100 |      100 |     100 |     100 |                   
 src/relations     |   91.37 |     87.5 |   91.89 |   91.37 |                   
  index.ts         |   91.37 |     87.5 |   91.89 |   91.37 | ...85,186,203-206 
-------------------|---------|----------|---------|---------|-------------------


### Running application

#### To Install node modules
```
npm install
```

#### to start the application
```
npm start <absolute_path_to_input_file> 

# e.g. test/inputs/test-positive.txt
```

#### Output

Output file will be available at the root of the project as "output.txt", also logs the output for testing


### Badges

#### Build
The code can be build for run and production usage.

#### Function / OO Modeling
The code is build using OOPs concepts and have used few design patterns.

#### Data Structures
The code is build using proper Data structure on the family member relation. the tree structure is been formed with the help of relationship builders.

#### Tests
The code is introduced with unit test, where each functions and units tested using two files as input data `test/inputs/test-positive.txt` and `test/inputs/test-negative.txt`

### Readable & Maintanable
The code is introduced with proper OOPs concepts and the code is very much readable, Less code, and code logics are handled using classes, have used `strategy` pattern for the relation builder and queries.

### Extensible
The code is extensible with, since the relations are handled using the `Irelation` interface, can be extended for further relations, both the `FamilyMember` and `FamilyMember` are open for extensible, and pretty much closed for modification.

### Logic
The code logics are very much handled using the interfaces rather if else conditions.
