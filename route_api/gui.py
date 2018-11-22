import tkinter as tk
from gui_display import GUI_DISPLAY

class GUI(object):
    def __init__(self, win):
        self.win = win
        #self.master = master
        self.title = 'Vacuum Cleaner Robot Demo'
        self.width = 1000
        self.height = 500
        self.width_map = 500
        self.height_map = 500
        self.rows = 5
        self.cols = 5
        # -1=Obstacle(Default); 0=Floor; 1=Wet Floor; 2=Carpet
        self.type_paint = -1
        #self.win = tk.Tk()
        self.path_count = 0
        self.tiles = [[None for _ in range(self.cols)] for _ in range(self.rows)]
        self.tiles_path = [[None for _ in range(self.cols)] for _ in range(self.rows)]
        self.matrix_map = [[0 for _ in range(self.cols)] for _ in range(self.rows)]
        self.canvas_map = tk.Canvas(self.win, width=self.width_map, height=self.height_map, background='white')
        self.btn_start = tk.Button(self.win, text='Start', width=15, height=3, command=self.click_start)
        self.btn_paint_obs = tk.Button(self.win, text='Paint-Obstacle', width=20, height=5,
                                       command=self.click_paint_obs)
        self.btn_paint_floor = tk.Button(self.win, text='Paint-Floor', width=20, height=5,
                                       command=self.click_paint_floor)
        self.btn_paint_wet = tk.Button(self.win, text='Paint-Wet', width=20, height=5,
                                       command=self.click_paint_wet)
        self.btn_paint_carpet = tk.Button(self.win, text='Paint-Carpet', width=20, height=5,
                                       command=self.click_paint_carpet)

    def draw(self):
        win = self.win
        title = self.title
        w = self.width
        h = self.height
        c = self.canvas_map
        btn_start = self.btn_start
        btn_paint_obs = self.btn_paint_obs
        btn_paint_floor = self.btn_paint_floor
        btn_paint_wet = self.btn_paint_wet
        btn_paint_carpet = self.btn_paint_carpet

        win.geometry(str(w) + 'x' + str(h))

        # Grid view set-up
        win.columnconfigure(0, weight=0)
        win.columnconfigure(1, weight=1)
        win.columnconfigure(2, weight=1)
        win.rowconfigure(0, weight=0)
        win.rowconfigure(1, weight=0)
        win.rowconfigure(2, weight=0)
        win.rowconfigure(3, weight=0)
        win.rowconfigure(4, weight=0)

        # Canvas Map
        c.grid(row=0, column=0, rowspan=5, sticky='W')
        c.bind("<Configure>", self.create_grid)
        c.bind("<Button-1>", self.click_map)

        # Buttons
        btn_paint_obs.grid(row=0, column=2)
        btn_paint_floor.grid(row=1, column=2)
        btn_paint_wet.grid(row=2, column=2)
        btn_paint_carpet.grid(row=3, column=2)
        btn_start.grid(row=4, column=1, columnspan=2)

        # Bring to Top
        #win.call('wm', 'attributes', '.', '-topmost', '1')

        win.title(title)
        #win.mainloop()

    def click_start(self):
        #print('test')

        gui_play = tk.Toplevel(self.win)
        w = GUI_DISPLAY(gui_play)
        w.draw()

    def click_paint_obs(self):
        self.type_paint = -1
        print("Switch to obstacle paint")

    def click_paint_floor(self):
        self.type_paint = 0
        print("Switch to floor paint")

    def click_paint_wet(self):
        self.type_paint = 1
        print("Switch to wet floor paint")

    def click_paint_carpet(self):
        self.type_paint = 2
        print("Switch to carpet paint")

    def click_map(self, event):
        tiles = self.tiles
        matrix_map = self.matrix_map
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

        color = 'white'
        if self.type_paint == -1:
            color = 'black'
        elif self.type_paint == 0:
            color = 'white'
        elif self.type_paint == 1:
            color = 'blue'
        elif self.type_paint == 2:
            color = 'gray'
        matrix_map[row][col] = self.type_paint

        # If the tile is not filled, create a rectangle
        if not tiles[row][col]:
            tiles[row][col] = c.create_rectangle(col * col_width, row * row_height, (col + 1) * col_width,
                                                 (row + 1) * row_height, fill=color)
            #matrix_map[row][col] = self.type_paint
        # If the tile is filled, delete the rectangle and clear the reference
        else:
            c.delete(tiles[row][col])
            tiles[row][col] = None
            matrix_map[row][col] = 0

        print(matrix_map)

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

