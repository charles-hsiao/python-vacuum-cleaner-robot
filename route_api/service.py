# -*- coding: utf-8 -*-
import time
import map as Map
from robot import Robot
from dfs_sweeper import DFSSweeper


def handler(event, context):

    total_elapsed_dfs = 0
    total_steps_dfs = 0
    total_turns_dfs = 0

    m = eval(event['map_matrix'])
    map_matrix = Map.map_matrix_transfer(m)
    start_position = eval(event['start_position'])
    start_direction = event['start_direction']

    # run with dfs
    robot = Robot(map_matrix, start_position, start_direction)
    # robot.log()
    sweeper = DFSSweeper(robot)

    start = time.time()
    sweeper.sweep()
    elapsed = time.time() - start

    path_history = robot.path_history

    total_elapsed_dfs += elapsed
    total_steps_dfs += robot.move_count
    total_turns_dfs += robot.turn_count

    result = {
      "path_history": str(path_history),
      "steps_taken": robot.move_count,
      "turns_taken": robot.turn_count,
      "times_taken": round(elapsed * 1000, 6)
    }

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": result
    }


# Debug
'''
matrix = "[[0, -1, 0], [0, 0, 0], [0, 0, -1]]"
s_position = "{'x': 0, 'y': 0}"
s_direction = 0

event = dict()
event.update({
  'map_matrix': matrix,
  'start_position': s_position,
  'start_direction': s_direction
})
r = handler(event, None)
print(r['body'])
'''