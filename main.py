#from map import *
from gui import GUI
import random
import time
import tkinter as tk
from robot import Robot
from dfs_sweeper import DFSSweeper


def random_matrix(no_rows, no_cols, no_obs):
    arr = []
    for i in range(no_rows * no_cols):
        if i < no_obs:
            arr.append(1)
        else:
            arr.append(0)

    random.shuffle(arr)

    start_position = {'x': 0, 'y': 0}
    rand_pos = random.randint(0, no_rows * no_cols - no_obs - 1)

    matrix = []
    count = 0
    for i in range(no_rows):
        row = []
        for j in range(no_cols):
            row.append(arr[i * no_cols + j])
            if arr[j] == 0:
                if count == rand_pos:
                    start_position = {'x': j, 'y': i}
                count += 1
        matrix.append(row)
    return matrix, start_position


def main():

    total_elapsed_dfs = 0
    total_steps_dfs = 0
    total_turns_dfs = 0

    #matrix, start_position = random_matrix(3, 3, 1)
    matrix = [[0, 1, 0], [0, 0, 0], [0, 0, 0]]
    start_position = {'x': 0, 'y': 0}
    print("Start from:")
    print(start_position)
    print("Map matrix:")
    print(matrix)

    #start_direction = random.randint(0, 3)
    start_direction = 0

    # run with dfs
    robot = Robot(matrix, start_position, start_direction)
    # robot.log()
    sweeper = DFSSweeper(robot)
    sweeper.loggable = False
    robot.loggable = False

    start = time.time()
    sweeper.sweep()
    elapsed = time.time() - start

    path_history = robot.path_history
    print("Path history:")
    print(path_history)

    total_elapsed_dfs += elapsed
    total_steps_dfs += robot.move_count
    total_turns_dfs += robot.turn_count

    print('steps taken by dfs: %d, turns taken: %d, time taken: %.2fms'
          % (robot.move_count, robot.turn_count, elapsed * 1000))

    #root = tk.Tk()
    #gui = GUI(root)
    #gui.draw()
    #root.mainloop()


if __name__ == '__main__':
    main()
