

# Transfer map to algorithm-understanding matrix
# Algorithm-understanding: 0=Able to pass; 1=Obstacle
def map_matrix_transfer(matrix):
    map_matrix = []
    for row in matrix:
        new_row = []
        for column in row:
            if column < 0:
                new_column = 1
            else:
                new_column = 0
            new_row.append(new_column)
        map_matrix.append(new_row)
    return map_matrix


# m = [[0, -1, 0], [0, 0, 0], [0, 0, -1]]
# map_matrix = map_matrix_transfer(m)
# print(map_matrix)


# Floor Definition
# | Floor Type       | Code | Able to Cross | Clean Mode(Code)   | Clean Strength  |
# | ---------------- | ---- | ------------- | ------------------ | --------------- |
# | Empty            | -2   | X             | - (0)              | 0               |
# | Obstacle         | -1   | X             | - (0)              | 0               |
# | Normal Floor     | 0    | O             | Vacuum Cleaner (1) | 1               |
# | Wet Floor        | 1    | O             | Mop (2)            | 0               |
# | Carpet           | 2    | O             | Vacuum Cleaner (1) | 3               |
# | Dirty Floor      | 3    | O             | Vacuum Cleaner (1) | 2               |
# | Floor with Trash | 4    | O             | Broom (3)          | 0               |

# Clean Mode: 0=None; 1=Vacuum Cleaner; 2=Mop; 3=Broom
# Clean Strength(Only on Vacuum Cleaner mode): 0=None; 1=Weak; 2=Medium; 3=Strong


def path_append_attributes(matrix, path):
    cleared_path = {}
    new_path = []
    for spot in path:
        x = spot[0]
        y = spot[1]
        floor_type = matrix[y][x]
        key = str(x) + '_' + str(y)
        is_exist = False

        if key in cleared_path:
            is_exist = True

        if floor_type == 0:  # Normal Floor
            clean_mode = 1
            strength = 1
        elif floor_type == 1:  # Wet Floor
            if is_exist:
                clean_mode = 1
                strength = 1
            else:
                clean_mode = 2
                strength = 0
        elif floor_type == 2:  # Carpet
            clean_mode = 1
            strength = 3
        elif floor_type == 3:  # Dirty Floor
            if is_exist:
                clean_mode = 1
                strength = 1
            else:
                clean_mode = 1
                strength = 2
        elif floor_type == 4:  # Floor with Trash
            if is_exist:
                clean_mode = 1
                strength = 1
            else:
                clean_mode = 3
                strength = 0
        elif floor_type == -1:  # Empty (should not happen)
            clean_mode = 0
            strength = 0
        elif floor_type == -2:  # Obstacle (should not happen)
            clean_mode = 0
            strength = 0
        else:  # (should not happen)
            clean_mode = 0
            strength = 0

        new_spot = [x, y, clean_mode, strength]
        new_path.append(new_spot)

        cleared_path[key] = 1

    return new_path


# matrix = [[4, -2, 0], [0, 1, 2], [3, 0, -1]]
# path_history = [[0, 1], [0, 2], [1, 2], [1, 1], [2, 1], [2, 0], [2, 1], [1, 1], [1, 2], [0, 2], [0, 1], [0, 0]]
# path_with_attributes = path_append_attributes(matrix, path_history)
# print(path_with_attributes)
