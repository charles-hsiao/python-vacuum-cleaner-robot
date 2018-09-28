import tkinter as tk
from tkinter import *

class GUI(object):
    def __init__(self):
        self.title = 'Cleaner Robot Demo'
        self.width = 1000
        self.height = 500
        self.width_map = 500
        self.height_map = 500
        self.rows = 2
        self.cols = 2
        self.win = tk.Tk()
        self.tiles = [[0 for _ in range(self.cols)] for _ in range(self.rows)]
        self.canvas_map = tk.Canvas(self.win, width=self.width_map, height=self.height_map, background='white')
        self.btn_start = tk.Button(self.win, text='Start', width=10, height=3, command=self.click_start)

    def draw(self):
        win = self.win
        title = self.title
        w = self.width
        h = self.height
        c = self.canvas_map
        btn_start = self.btn_start

        win.geometry(str(w) + 'x' + str(h))

        btn_start.pack(side='right')

        c.pack(side='left')
        c.bind("<Configure>", self.create_grid)

        c.bind("<Button-1>", self.click_map)

        # Bring to Top
        win.call('wm', 'attributes', '.', '-topmost', '1')

        win.title(title)
        win.mainloop()

    def click_start(self):
        print(self.tiles)

    def click_map(self, event):
        tiles = self.tiles
        c = self.canvas_map
        cols = self.cols
        rows = self.rows
        w = self.width_map
        h = self.height_map

        # Get rectangle diameters
        col_width = w / cols
        row_height = h / rows
        # Calculate column and row number
        col = int(event.x / col_width)
        row = int(event.y / row_height)
        # If the tile is not filled, create a rectangle
        if not tiles[row][col]:
            tiles[row][col] = c.create_rectangle(col * col_width, row * row_height, (col + 1) * col_width,
                                                 (row + 1) * row_height, fill="black")
        # If the tile is filled, delete the rectangle and clear the reference
        else:
            c.delete(tiles[row][col])
            tiles[row][col] = 0

        print(self.tiles)

    def create_grid(self, event):
        c = self.canvas_map
        cols = self.cols
        rows = self.rows
        # Get current width of canvas
        w = self.canvas_map.winfo_width()
        h = self.canvas_map.winfo_height()  # Get current height of canvas

        c.delete('grid_line')  # Will only remove the grid_line

        # Creates all vertical lines at intevals of 100
        for i in range(0, h, int(c.winfo_height()/cols)):
            c.create_line([(i, 0), (i, h)], tag='grid_line')
            # Creates all horizontal lines at intevals of 100
            for i in range(0, w, int(c.winfo_width()/rows)):
                c.create_line([(0, i), (w, i)], tag='grid_line')

