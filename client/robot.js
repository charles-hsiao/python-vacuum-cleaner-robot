class Application {

    constructor(rows, cols, canvas_id, pointer_id, target_id) {
        this.rows = rows;
        this.cols = cols;
        this.canvas_id = canvas_id;
        this.pointer_id = pointer_id;
        this.target_id = target_id;
        this.canvas = null;
        this.pointer = null;
        this.ctx = null;
    }

    load_app(matrix) {
        this.canvas = document.getElementById(this.canvas_id);
        this.pointer = document.getElementById(this.pointer_id);
        this.ctx = this.canvas.getContext('2d');
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw_obstacle(matrix) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        /*
        var img = new Image();
        img.src = 'image/layout-main5.jpg';

        img.onload = function() {
          ctx.drawImage(this, 0, 0, width, height);
        };
        */
//ctx.drawImage(img,0,0);
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] != 0) {
		              if (matrix[i][j] == -1)
		                this.ctx.fillStyle="#000000";
		              else if (matrix[i][j] == 1)
		                this.ctx.fillStyle="#00ffff";
		              else if (matrix[i][j] == 2)
		                this.ctx.fillStyle="#adadad";
		              else if (matrix[i][j] == 3)
		                this.ctx.fillStyle="#e0e0e0";
		              else if (matrix[i][j] == 4)
		                this.ctx.fillStyle="#ffaf60";

                  if (matrix[i][j] != -2){
                    this.ctx.fillRect(j * col_width, i * row_height, col_width, row_height);
                  }
                }

                if (matrix[i][j] != -2) {
                  this.ctx.strokeStyle = '#000000';
                  this.ctx.strokeRect(j * col_width, i * row_height, col_width, row_height);
                }
            }
        }

    }

    update_position(robot, first_time) {
      let width = this.canvas.width;
      let height = this.canvas.height;

      let row_height = height / this.rows;
      let col_width = width / this.cols;

      let x = (robot.current_position.x + 0.5) * col_width;
      let y = (robot.current_position.y + 0.5) * row_height;

      if (first_time)
        this.ctx.moveTo(x, y);
      else
        this.ctx.lineTo(x, y);

      this.pointer.style.transform = 'translate('+x+'px, '+y+'px)';
      this.ctx.strokeStyle = '#ff0000';
      this.ctx.stroke();
    }

    clear_floor(from_x, from_y, width, height){
      console.log('[pos]' + from_x + ',' + from_y + ',' + width + ',' + height);
      this.ctx.clearRect(from_x, from_y, width, height);
      this.ctx.strokeStyle = '#000000';
      this.ctx.strokeRect(from_x, from_y, width, height);
    }

}

class Robot {

    constructor(app, matrix, start_position, move_time) {
        this.matrix = matrix;
        this.start_position = {x: start_position.x, y: start_position.y};
        this.current_position = {x: start_position.x, y: start_position.y};
        this.loggable = true;
        this.app = app;
        this.move_count = 0;
        this.turn_count = 0;
        this.__visited_position = {};
        this.app.update_position(this, true);
        this.move_time = move_time;
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
        this.app.update_position(this);

        // Clear floor after sweep
        let width = this.app.canvas.width;
        let height = this.app.canvas.height;
        let row_height = height / this.app.rows;
        let col_width = width / this.app.cols;

        let map_matrix = this.matrix;
        if(map_matrix[next_pos_y][next_pos_x] == 1 || map_matrix[next_pos_y][next_pos_x] == 3 ||
            map_matrix[next_pos_y][next_pos_x] == 4){
          if(!(next_pos_x + "_" + next_pos_y in this.__visited_position)) {
            this.app.clear_floor(next_pos_x * col_width, next_pos_y * row_height, col_width, row_height);
          }
        }

        this.__visited_position[next_pos_x + "_" + next_pos_y] = 1;
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
}

class RouteDraw {
    constructor(robot) {
        this.robot = robot;
    }

    move(x, y) {
      this.robot.move(x, y);
    }
}
