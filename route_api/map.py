

# Transfer map to algorithm-understanding matrix
# Algorithm-understanding: 0=Able to pass; 1=Obstacle
def map_matrix_transfer(matrix):
    print(matrix)
    map_matrix = []
    #x = 0
    #y = 0
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