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
PASS  test/main.test.ts
  Problem
    ✓ Postive test cases (6 ms)
    ✓ Negative test cases

Test Suites: 1 passed, 1 total
Tests:       2 passed, 2 total
Snapshots:   0 total
Time:        3.478 s
Ran all test suites.
```       

### Running Coverage
```
npm run coverage
```

#### Coverage output
File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s                                                                     
---------------------------|---------|----------|---------|---------|---------------------------------------------------------------------------------------
All files                  |   89.39 |    83.45 |   92.21 |   90.06 |                                                                                       
 geektrust-family-tree     |   79.71 |       90 |   84.21 |   84.62 |                                                                                       
  app.ts                   |   79.71 |       90 |   84.21 |   84.62 | 127,166-177                                                                           
 geektrust-family-tree/src |    91.7 |    82.35 |   94.83 |   91.34 |                                                                                       
  db.ts                    |   88.89 |      100 |      80 |   88.89 | 17                                                                                    
  family-utils.ts          |     100 |      100 |     100 |     100 |                                                                                       
  family.ts                |   88.78 |    75.29 |   95.12 |   88.56 | ...17,131,143,188,198,234,238,261,361,367,383,389,423,445,467,489,511-512,522,555,574 
  seed-data.ts             |     100 |      100 |     100 |     100 |     


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