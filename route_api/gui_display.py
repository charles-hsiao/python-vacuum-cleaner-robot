import tkinter as tk
import time

class GUI_DISPLAY(object):
    def __init__(self, win):
        self.title = 'Vacuum Cleaner Robot Demo'
        self.width = 500
        self.height = 500
        self.width_map = 500
        self.height_map = 500
        self.rows = 3
        self.cols = 3
        # -1=Obstacle(Default); 0=Floor; 1=Wet Floor; 2=Carpet
        self.type_paint = -1
        self.win = win
        self.path_count = 0
        self.tiles = [[None for _ in range(self.cols)] for _ in range(self.rows)]
        self.tiles_path = [[None for _ in range(self.cols)] for _ in range(self.rows)]
        self.matrix_map = [[0 for _ in range(self.cols)] for _ in range(self.rows)]
        self.canvas_map = tk.Canvas(self.win, width=self.width_map, height=self.height_map, background='white')


    def draw(self):
        win = self.win
        title = self.title
        w = self.width
        h = self.height
        c = self.canvas_map

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
        #c.bind("<Button-1>", self.click_map)

        # Bring to Top
        #win.call('wm', 'attributes', '.', '-topmost', '1')

        win.title(title)
        self.click_start()
        win.mainloop()

    def draw_path(self, canvas, col, row, col_width, row_height):
        #print('1')
        #self.picture_display.config(image=img_object)
        # shows the image filename, but could be expanded
        # to show an associated description of the image
        #self.title(img_name)
        #canvas.after(1000, self.draw_path(canvas, col, row, col_width, row_height))

        canvas.create_rectangle(col * col_width, row * row_height, (col + 1) * col_width,
                                   (row + 1) * row_height, fill='red')
        #canvas.after(500, self.draw_rect(canvas, col, row, col_width, row_height))

    def draw_rect(self, canvas, col, row, col_width, row_height):
        print('hello')
        canvas.create_rectangle(col * col_width, row * row_height, (col + 1) * col_width,
                               (row + 1) * row_height, fill='red')

    def task(self):
        print("hello")
        self.win.after(2000, self.task)  # reschedule event in 2 seconds

    def click_start(self):
        #matrix_map = self.matrix_map
        #print(matrix_map)

        tiles_path = self.tiles_path
        path_history = [
            [0, 1], [0, 2], [1, 2], [2, 2], [2, 1], [2, 0], [2, 1],
            [1, 1], [2, 1], [2, 2], [1, 2], [0, 2], [0, 1], [0, 0]
        ]
        c = self.canvas_map
        cols = self.cols
        rows = self.rows
        w = self.width_map
        h = self.height_map

        # Get rectangle diameters
        col_width = w / cols
        row_height = h / rows

        self.path_count = len(path_history)

        for item in path_history:
            col = item[0]
            row = item[1]
            self.draw_path(c, col, row, row_height, col_width)
            #time.sleep(1)
        #self.draw_path(c, 0, 1, row_height, col_width)
        #self.win.after(500, self.draw_rect(c, 0, 1, col_width, row_height))
        #self.win.after(1000, self.draw_rect(c, 0, 2, col_width, row_height))
        #self.task()

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

