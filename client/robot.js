class Application {

    constructor(rows, cols, obstacles, canvas_id, pointer_id, target_id) {
        this.rows = rows;
        this.cols = cols;
        this.obstacles = obstacles;
        this.canvas_id = canvas_id;
        this.pointer_id = pointer_id;
        this.target_id = target_id;
        this.canvas = null;
        this.pointer = null;
    }

    load_app() {
        this.canvas = document.getElementById(this.canvas_id);
        this.pointer = document.getElementById(this.pointer_id);
        var ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw_grid(ctx);
    }

    draw_obstacle(matrix) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        var ctx = this.canvas.getContext('2d');

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] != 0) {
					if (matrix[i][j] == -2)
						ctx.fillStyle="#000000";
					else if (matrix[i][j] == -1)
						ctx.fillStyle="#000000";
					else if (matrix[i][j] == 1)
						ctx.fillStyle="#00ffff";
					else if (matrix[i][j] == 2)
						ctx.fillStyle="#adadad";
					else if (matrix[i][j] == 3)
						ctx.fillStyle="#e0e0e0";
					else if (matrix[i][j] == 4)
						ctx.fillStyle="#ffaf60";
                    ctx.fillRect(j * col_width, i * row_height, col_width, row_height);
                }
            }
        }
    }

    begin() {
        var ctx = this.canvas.getContext('2d');
        ctx.beginPath();
    }

    finish() {
        var ctx = this.canvas.getContext('2d');
        ctx.stroke();
    }

    update_position(robot, first_time) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        let x = (robot.current_position.x + 0.5) * col_width;
        let y = (robot.current_position.y + 0.5) * row_height;

        var ctx = this.canvas.getContext('2d');
        if (first_time)
            ctx.moveTo(x, y);
        else
            ctx.lineTo(x, y);

        this.pointer.style.transform = 'translate('+x+'px, '+y+'px)';
        ctx.strokeStyle = '#ff0000';
        ctx.stroke();
    }

    update_target(current) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        let x = (current.x + 0.5) * col_width;
        let y = (current.y + 0.5) * row_height;

        document.getElementById(this.target_id).style.left = x+'px';
        document.getElementById(this.target_id).style.top = y+'px';
    }

    draw_grid(ctx) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;
        ctx.strokeStyle = '#000000';

        for(let i = 1; i < this.rows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * row_height);
            ctx.lineTo(width, i * row_height);
            ctx.stroke();
        }

        for(let i = 1; i < this.cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * col_width, 0);
            ctx.lineTo(i * col_width, height);
            ctx.stroke();
        }
    }
}

class Robot {

    constructor(matrix, start_position, start_direction, app) {
        this.matrix = matrix;
        this.start_position = {x: start_position.x, y: start_position.y};
        this.current_position = {x: start_position.x, y: start_position.y};
        this.start_direction = start_direction;
        this.current_direction = start_direction;
        this.loggable = true;
        this.app = app;
        this.move_count = 0;
        this.turn_count = 0;
        this.__visited_position = {};
        this.app.update_position(this, true);
        this.move_time = 1000;
    }

    turn_left() {
        this.current_direction = (this.current_direction + 1) % 4;
        this.turn_count++;
        return this;
    }

    turn_right() {
        this.current_direction = (this.current_direction + 3) % 4;
        this.turn_count++;
        return this;
    }

    move(next_pos_x, next_pos_y) {
        this.move_count++;
        this.current_position.x = next_pos_x;
        this.current_position.y = next_pos_y;
        this.__visited_position[next_pos_x + "_" + next_pos_y] = 1;
        if (this.loggable)
            this.log();
        this.app.update_position(this);
        /*
        return new Promise(resolve => {
            setTimeout(function() {
                resolve();
            }, this.move_time);
        });
        */
    }

    __can_move(next_pos_x, next_pos_y) {
        if (next_pos_x < 0 || next_pos_y < 0)
            return false;
        if (next_pos_y >= this.matrix.length)
            return false;
        if (next_pos_x >= this.matrix[0].length)
            return false;
        return this.matrix[next_pos_y][next_pos_x] == 0;
    }

    log() {
        for(let i in this.matrix) {
            let text = "";
            for(let j in this.matrix[i]) {
                if (i == this.current_position.y && j == this.current_position.x) {
                    if (this.current_direction == 0)
                        text += '>';
                    else if (this.current_direction == 1)
                        text += '^';
                    else if (this.current_direction == 2)
                        text += '<';
                    else
                        text += 'v';
                } else if (this.__visited_position[j + "_" + i] == 1) {
                    text += '*';
                } else if (this.matrix[i][j] == 0) {
                    text += '.';
                } else {
                    text += '|';
                }
            }
            console.log(text);
        }
    }
}

class RouteDraw {
    constructor(robot) {
        this.current_direction = 0;
        this.current_position = {x: 0, y: 0};
        this.observed_map = {0: {0: 1}};
        this.robot = robot;
        this.loggable = true;
        this.spiral = false;
    }

    move(x, y) {
      this.robot.move(x, y);
    }
}
