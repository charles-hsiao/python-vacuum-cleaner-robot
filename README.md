# python-vacuum-cleaner-robot
Python Vacuum Cleaner Robot Algorithm and Demo 

Work In Process


## Map Definition

### Matrix
```
Two-dimensional array, 1st-dimensional as Row, 2nd-dimensional as Column
```

### Floor Definition
| Floor Type       | Code | Draw Out | Able to Cross | Clean Mode (Code)           | Clean Strength (Value) 
| ---------------- | ---- | -------- | ------------- | --------------------------- | --------------------
| Empty            | -2   | X        | X             | - (0)                       | None (0) 
| Obstacle         | -1   | O        | X             | - (0)                       | None (0)
| Normal Floor     | 0    | O        | O             | Vacuum Cleaner - Weak (1)   | Weak (1)
| Wet Floor        | 1    | O        | O             | Mop (2)                     | None (0)
| Carpet           | 2    | O        | O             | Vacuum Cleaner - Strong (1) | Strong (3)
| Dirty Floor      | 3    | O        | O             | Vacuum Cleaner - Medium(1)  | Medium (2)
| Floor with Trash | 4    | O        | O             | Broom (3)                   | None (0)

### Example
#### Example 1:
```
map_matrix = [[0, -1, 0], [0, 0, 0], [0, 0, -1]]
```
<img src="https://github.com/charles-hsiao/python-vacuum-cleaner-robot/blob/master/doc/map/example_1.png" width="300">

#### Example 2:
```
map_matrix = [[1, 0, -1], [0, 0, 2], [0, 0, 2]]
```
<img src="https://github.com/charles-hsiao/python-vacuum-cleaner-robot/blob/master/doc/map/example_2.png" width="300">

#### Example 3:
```
map_matrix = [[2, 2, 2, 2, 2], [0, -1, -1, -1, -1], [0, 0, 0, 0, 0], [0, 0, 0, 1, 1], [0, 0, 0, 1, 1]]
```
<img src="https://github.com/charles-hsiao/python-vacuum-cleaner-robot/blob/master/doc/map/example_3.png" width="300">
