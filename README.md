# python-vacuum-cleaner-robot
Python Vacuum Cleaner Robot Algorithm and Demo 

Work In Process


## Map Definition

### Floor Defination
| Floor Type       | Code | Draw Out | Able to Cross | Clean Mode             | 
| ---------------- | ---- | -------- | ------------- | ---------------------- |
| Empty            | -2   | X        | X             | -                      |
| Obstacle         | -1   | O        | X             | -                      |
| Normal Floor     | 0    | O        | O             | Vacuum Cleaner(Weak)   | 
| Wet Floor        | 1    | O        | O             | Mop                    |
| Carpet           | 2    | O        | O             | Vacuum Cleaner(Strong) |
| Dirty Floor      | 3    | O        | O             | Vacuum Cleaner(Medium) |
| Floor with Trash | 4    | O        | O             | Broom                  |

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
