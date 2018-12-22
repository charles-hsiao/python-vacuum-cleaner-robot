class Application {

    constructor(rows, cols, canvas_id, pointer_id, target_id) {
        this.rows = rows;
        this.cols = cols;
        this.canvas_id = canvas_id;
        this.pointer_id = pointer_id;
        this.target_id = target_id;
        this.canvas = null;
        this.pointer = null;
        //this.ctx = null;
    }

    load_app(matrix) {
        this.canvas = document.getElementById(this.canvas_id);
        this.pointer = document.getElementById(this.pointer_id);
        //this.ctx = this.canvas.getContext('2d');
        //this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    begin(robot) {
        var ctx = this.canvas.getContext('2d');
        ctx.beginPath();

        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        let x = (robot.start_position.x + 0.5) * col_width;
        let y = (robot.start_position.y + 0.5) * row_height;

        ctx.moveTo(x, y);
    }

    finish() {
      var ctx = this.canvas.getContext('2d');
      ctx.stroke();
    }

    draw_obstacle(matrix) {
       //this.ctx.beginPath();
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        var ctx = this.canvas.getContext('2d');
        /*
        var img = new Image();
        img.src = 'image/layout-main5.jpg';

        img.onload = function() {
          ctx.drawImage(this, 0, 0, width, height);
        };
        */
//ctx.drawImage(img,0,0);
        //this.ctx.beginPath();
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                let floor_type = matrix[i][j];

                if (floor_type == -1 || floor_type == 1 || floor_type == 2) {
		              if (floor_type == -1)
		                ctx.fillStyle="#000000";
		              else if (floor_type == 1)
		                ctx.fillStyle="#00ffff";
		              else if (floor_type == 2)
		                ctx.fillStyle="#adadad";

                  ctx.fillRect(j * col_width, i * row_height, col_width, row_height);
                }

                // Dirty Floor
                if (floor_type == 3){
                  let dot_num = this.getRandomInt(10, 50);
                  let dot_size = 1;

                  for(let k=0; k < dot_num; k++){
                    ctx.beginPath();
                    let dot_x = this.getRandomInt(j*col_width, j*col_width + col_width);
                    let dot_y = this.getRandomInt(i*row_height, i*row_height + row_height);
                    ctx.arc(dot_x, dot_y, dot_size, 0, 2*Math.PI);
                    ctx.stroke();
                  }
                }

                // Floor with trash
                if (floor_type == 4){

                  let dot_num = this.getRandomInt(2, 5);
                  let dot_size = this.getRandomInt(5, 8);

                  for(let k=0; k < dot_num; k++){
                    ctx.beginPath();
                    let dot_x = this.getRandomInt(j*col_width, j*col_width + col_width - dot_size*2);
                    let dot_y = this.getRandomInt(i*row_height, i*row_height + row_height - dot_size*2);
                    ctx.arc(dot_x, dot_y, dot_size, 0, 2*Math.PI);
                    ctx.stroke();
                  }
                }

                if (matrix[i][j] != -2) {
                  ctx.strokeStyle = '#000000';
                  ctx.strokeRect(j * col_width, i * row_height, col_width, row_height);
                }
            }
        }
    }

    getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
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

    clear_floor(from_x, from_y, width, height){
      var ctx = this.canvas.getContext('2d');
      //console.log('[pos]' + from_x + ',' + from_y + ',' + width + ',' + height);
      ctx.clearRect(from_x, from_y, width, height);
      //this.ctx.fillStyle="#ffffff";
      //this.ctx.fillRect(from_x, from_y, width, height);

      ctx.strokeStyle = '#000000';
      ctx.strokeRect(from_x, from_y, width, height);
    }

    clear_floor_start(start_x, start_y){
      var ctx = this.canvas.getContext('2d');
      let width = this.canvas.width;
      let height = this.canvas.height;
      let row_height = height / this.rows;
      let col_width = width / this.cols;

      //this.ctx.fillStyle="#ffffff";
      //this.ctx.fillRect(start_x, start_y, col_width, row_height);
      if(map_matrix[start_y][start_x] == 1 || map_matrix[start_y][start_x] == 3 ||
          map_matrix[start_y][start_x] == 4){
        ctx.clearRect(start_x, start_y, col_width, row_height);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(start_x, start_y, col_width, row_height);
      }
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
      //this.app.begin();
        this.move_count++;
        this.current_position.x = next_pos_x;
        this.current_position.y = next_pos_y;
        //this.app.update_position(this);

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

        this.app.update_position(this);
        //this.app.finish();
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
