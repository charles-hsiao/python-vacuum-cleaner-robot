from collections import defaultdict, deque


class Graph(object):
    def __init__(self):
        self.nodes = set()
        self.edges = defaultdict(list)
        self.distances = {}

    def add_node(self, value):
        self.nodes.add(value)

    def add_edge(self, from_node, to_node, distance):
        self.edges[from_node].append(to_node)
        self.edges[to_node].append(from_node)
        self.distances[(from_node, to_node)] = distance


def dijkstra(graph, initial):
    visited = {initial: 0}
    path = {}

    nodes = set(graph.nodes)

    while nodes:
        min_node = None
        for node in nodes:
            if node in visited:
                if min_node is None:
                    min_node = node
                elif visited[node] < visited[min_node]:
                    min_node = node
        if min_node is None:
            break

        nodes.remove(min_node)
        current_weight = visited[min_node]

        for edge in graph.edges[min_node]:
            try:
                weight = current_weight + graph.distances[(min_node, edge)]
            except:
                continue
            if edge not in visited or weight < visited[edge]:
                visited[edge] = weight
                path[edge] = min_node

    return visited, path


def shortest_path(graph, origin, destination):

    visited, paths = dijkstra(graph, origin)
    full_path = deque()
    _destination = paths[destination]

    while _destination != origin:
        full_path.appendleft(_destination)
        _destination = paths[_destination]

    full_path.appendleft(origin)
    full_path.append(destination)

    return visited[destination], list(full_path)


def find_adjacent_spot(current_x, current_y, map_matrix):
    min_x = 0
    min_y = 0
    max_x = len(map_matrix) - 1
    max_y = len(map_matrix[0]) - 1

    near_spots = []

    left_x = current_x - 1
    if left_x >= min_x:
        if map_matrix[left_x][current_y] == 0:
            near_spots.append([str(current_y)+'_'+str(left_x), 1])

    right_x = current_x + 1
    if right_x <= max_x:
        if map_matrix[right_x][current_y] == 0:
            near_spots.append([str(current_y)+'_'+str(right_x), 1])

    up_y = current_y - 1
    if up_y >= min_y:
        if map_matrix[current_x][up_y] == 0:
            near_spots.append([str(up_y)+'_'+str(current_x), 1])

    down_y = current_y + 1
    if down_y <= max_y:
        if map_matrix[current_x][down_y] == 0:
            near_spots.append([str(down_y)+'_'+str(current_x), 1])

    return near_spots

