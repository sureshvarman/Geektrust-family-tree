## Meet The Family

### Rules or Assumptions
* Names are unique in the entire family, treating name as an id.
* Assuming no re-marriages are there
* Assuming no marriages with in the family
* Assuming while adding child the mother name and child name will be only single firstname


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