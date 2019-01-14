class Application {

    constructor(rows, cols, canvas_id, pointer_id, target_id, img) {
        this.rows = rows;
        this.cols = cols;
        this.canvas_id = canvas_id;
        this.pointer_id = pointer_id;
        this.target_id = target_id;
        this.canvas = null;
        this.pointer = null;
        this.img = img;
        this.items = {};
        this.items_matrix = [];
        this.end_position_x = null;
        this.end_position_y = null;
    }

    load_app(matrix) {
        this.canvas = document.getElementById(this.canvas_id);
        this.pointer = document.getElementById(this.pointer_id);
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

    click_map(x, y, floor_type, robot){
      let width = this.canvas.width;
      let height = this.canvas.height;

      let row_height = height / this.rows;
      let col_width = width / this.cols;

      let selected_x = Math.floor(x/col_width);
      let selected_y = Math.floor(y/row_height);

      if(floor_type != -3){
        if(robot.matrix[selected_y][selected_x] == 4){
          this.items_matrix[selected_x][selected_y] = 0;
        }

        robot.matrix[selected_y][selected_x] = selected_floor;

        this.draw_floor(selected_x, selected_y, selected_floor, robot);
      }

      if(floor_type == 999){
        this.end_position_x = selected_x;
        this.end_position_y = selected_y;
      }

    }

    clear_all(robot){
      let new_map_matrix = [];
      for(let i=0; i<rows; i++){
        new_map_matrix[i] = [];
        for(let j=0; j<cols; j++){
          new_map_matrix[i][j] = 0;
          this.items_matrix[j][i] = 0;
          this.draw_floor(j, i, 0, robot)
        }
      }
      robot.matrix = new_map_matrix;
      document.getElementById('btn_shortest').style.display = 'inline';
    }

    draw_floor(pos_x, pos_y, floor_type, robot){

      var ctx = this.canvas.getContext('2d');

      let width = this.canvas.width;
      let height = this.canvas.height;

      let row_height = height / this.rows;
      let col_width = width / this.cols;

      // Clear
      ctx.clearRect(pos_x*col_width, pos_y*row_height, col_width, row_height);
      if(floor_type != -2){
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(pos_x*col_width, pos_y*row_height, col_width, row_height);
      }

      if (floor_type == -1 || floor_type == 2) {
        if (floor_type == -1)
          ctx.fillStyle="#000000";
        else if (floor_type == 2)
          ctx.fillStyle="#adadad";

        ctx.fillRect(pos_x*col_width, pos_y*row_height, col_width, row_height);
      }

      // Wet floor
      if (floor_type == 1){
        let img_base_url = 'image/';
        let water_img_list = [
          img_base_url+'water-coffee_1.png',
          img_base_url+'water-coffee_2.png',
          img_base_url+'water-spalsh_2.png',
          img_base_url+'water-spalsh_3.png'
        ];

        var img = new Image();
        img.src = water_img_list[Math.floor(Math.random() * water_img_list.length)]
        let water_size = 0;
        if (col_width >= row_height){
          let resize_rate = this.getRandomInt(1, 3);
          water_size = Math.floor( row_height/resize_rate );
        }
        else{
          let resize_rate = this.getRandomInt(1, 3);
          water_size = Math.floor( col_width/resize_rate );
        }

        if (water_size < 20){
           water_size = 20;
        }

        let dot_x = this.getRandomInt(pos_x*col_width, pos_x*col_width + col_width - water_size);
        let dot_y = this.getRandomInt(pos_y*row_height, pos_y*row_height + row_height - water_size);

        img.onload = function() {
          ctx.drawImage(this, dot_x, dot_y, water_size, water_size);
        };
      }

      // Dirty floor
      if (floor_type == 3){
        let dot_num = this.getRandomInt(10, 50);
        let dot_size = 1;

        for(let k=0; k < dot_num; k++){
          ctx.beginPath();
          let dot_x = this.getRandomInt(pos_x*col_width, pos_x*col_width + col_width);
          let dot_y = this.getRandomInt(pos_y*row_height, pos_y*row_height + row_height);
          ctx.arc(dot_x, dot_y, dot_size, 0, 2*Math.PI);
          ctx.stroke();
        }
        // Back to start position
        ctx.beginPath();
        (robot.start_position.x + 0.5) * col_width;
        ctx.moveTo((robot.start_position.x + 0.5)*col_width, (robot.start_position.y + 0.5) * row_height);
        //ctx.moveTo(Math.floor((robot.start_position.x*col_width + col_width)/2), Math.floor((robot.start_position.y*row_height + row_height)/2));
        ctx.stroke();
      }

      // Floor with trash
      if (floor_type == 4){
        let img_base_url = 'image/';
        let trash_img_list = [
          img_base_url+'trash-banana.jpg',
          img_base_url+'trash-paper_wad.png',
          img_base_url+'trash-can.jpg',
          img_base_url+'item-pen.png',
          img_base_url+'item-slipper.png',
          img_base_url+'item-toy_2.png',
          img_base_url+'item-toy_3.png',
          img_base_url+'item-toy_4.png',
          img_base_url+'item-toy_5.png'
        ];

        var img = new Image();
        img.src = trash_img_list[Math.floor(Math.random() * trash_img_list.length)];
        this.items_matrix[pos_y][pos_x] = img.src;

        let trash_size = 0;
        if (col_width >= row_height){
          let resize_rate = this.getRandomInt(3, 5);
          trash_size = Math.floor( row_height/resize_rate );
        }
        else{
          let resize_rate = this.getRandomInt(3, 5);
          trash_size = Math.floor( col_width/resize_rate );
        }

        if (trash_size < 20){
           trash_size = 20;
        }

        let dot_x = this.getRandomInt(pos_x*col_width, pos_x*col_width + col_width - trash_size);
        let dot_y = this.getRandomInt(pos_y*row_height, pos_y*row_height + row_height - trash_size);

        img.onload = function() {
          ctx.drawImage(this, dot_x, dot_y, trash_size, trash_size);
        };
      }

      // Shortest path
      if (floor_type == 999){

        var img = new Image();
        img.src = 'image/target.png';
        this.items_matrix[pos_y][pos_x] = img.src;

        let size = 0;
        let resize_rate = 2;
        if (col_width >= row_height){
          size = Math.floor( row_height/resize_rate );
        }
        else{
          size = Math.floor( col_width/resize_rate );
        }

        if (size < 20){
           size = 20;
        }

        //let dot_x = this.getRandomInt(pos_x*col_width, pos_x*col_width + col_width - size);
        //let dot_y = this.getRandomInt(pos_y*row_height, pos_y*row_height + row_height - size);

       let dot_x = Math.floor( (pos_x+0.25)*col_width );
       let dot_y = Math.floor( (pos_y+0.25)*row_height );

        img.onload = function() {
          ctx.drawImage(this, dot_x, dot_y, size, size);
        };
      }

    }

    draw_obstacle(matrix) {
        let width = this.canvas.width;
        let height = this.canvas.height;

        let row_height = height / this.rows;
        let col_width = width / this.cols;

        var ctx = this.canvas.getContext('2d');

        if(this.img != null){
          var img = new Image();
          img.src = 'image/' + this.img;

          img.onload = function() {
            ctx.drawImage(this, 0, 0, width, height);
          };
        }

        // Init items_matrix
        for(let i = 0; i < matrix.length; i++) {
          this.items_matrix[i] = [];
          for(let j = 0; j < matrix[i].length; j++) {
            this.items_matrix[i][j] = 0;
          }
        }

        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix[i].length; j++) {
                //let current_item = '';
                let floor_type = matrix[i][j];

                if (floor_type == -1 || floor_type == 2) {
		              if (floor_type == -1)
		                ctx.fillStyle="#000000";
		              else if (floor_type == 2)
		                ctx.fillStyle="#adadad";

                  ctx.fillRect(j * col_width, i * row_height, col_width, row_height);
                }

                // Wet floor
                if (floor_type == 1){
                  let img_base_url = 'image/';
                  let water_img_list = [
                    img_base_url+'water-coffee_1.png',
                    img_base_url+'water-coffee_2.png',
                    img_base_url+'water-spalsh_2.png',
                    img_base_url+'water-spalsh_3.png'
                  ];

                  var img = new Image();
                  img.src = water_img_list[Math.floor(Math.random() * water_img_list.length)]
                  let water_size = 0;
                  if (col_width >= row_height){
                    let resize_rate = this.getRandomInt(1, 3);
                    water_size = Math.floor( row_height/resize_rate );
                  }
                  else{
                    let resize_rate = this.getRandomInt(1, 3);
                    water_size = Math.floor( col_width/resize_rate );
                  }

                  if (water_size < 20){
                     water_size = 20;
                  }

                  let dot_x = this.getRandomInt(j*col_width, j*col_width + col_width - water_size);
                  let dot_y = this.getRandomInt(i*row_height, i*row_height + row_height - water_size);

                  img.onload = function() {
                    ctx.drawImage(this, dot_x, dot_y, water_size, water_size);
                  };
                }

                // Dirty floor
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
                  let img_base_url = 'image/';
                  let trash_img_list = [
                    img_base_url+'trash-banana.jpg',
                    img_base_url+'trash-paper_wad.png',
                    img_base_url+'trash-can.jpg',
                    img_base_url+'item-pen.png',
                    img_base_url+'item-slipper.png',
                    img_base_url+'item-toy_2.png',
                    img_base_url+'item-toy_3.png',
                    img_base_url+'item-toy_4.png',
                    img_base_url+'item-toy_5.png'
                  ];

                  var img = new Image();
                  img.src = trash_img_list[Math.floor(Math.random() * trash_img_list.length)];
                  /*
                  let current_count = 0;
                  if (img.src in this.items){
                      current_count = this.items[img.src];
                      this.items[img.src] = current_count + 1;
                  }
                  else{
                      this.items[img.src] = 1;
                  }
                  */
                  this.items_matrix[j][i] = img.src;

                  let trash_size = 0;
                  if (col_width >= row_height){
                    let resize_rate = this.getRandomInt(3, 5);
                    trash_size = Math.floor( row_height/resize_rate );
                  }
                  else{
                    let resize_rate = this.getRandomInt(3, 5);
                    trash_size = Math.floor( col_width/resize_rate );
                  }

                  if (trash_size < 20){
                     trash_size = 20;
                  }

                  let dot_x = this.getRandomInt(j*col_width, j*col_width + col_width - trash_size);
                  let dot_y = this.getRandomInt(i*row_height, i*row_height + row_height - trash_size);

                  img.onload = function() {
                    ctx.drawImage(this, dot_x, dot_y, trash_size, trash_size);
                  };
                }

                if (matrix[i][j] != -2) {
                  ctx.strokeStyle = '#000000';
                  ctx.strokeRect(j * col_width, i * row_height, col_width, row_height);
                }
            }
        }

        console.log(this.items_matrix);
    }

    drawPickedItems(robot){
      for(let i=0; i<this.items_matrix.length; i++){
        for(let j=0; j<this.items_matrix[i].length; j++){
          let img_src = this.items_matrix[i][j];
          let current_count = 0;
          if (img_src in this.items){
              current_count = this.items[img_src];
              this.items[img_src] = current_count + 1;
          }
          else{
              this.items[img_src] = 1;
          }
        }
      }

      console.log(this.items);
      console.log(robot.start_position);

      let start_x = robot.start_position.x;
      let start_y = robot.start_position.y;

      let width = this.canvas.width;
      let height = this.canvas.height;

      let row_height = height / this.rows;
      let col_width = width / this.cols;

      var ctx = this.canvas.getContext('2d');

      let item_count = 0;
      for (let key in this.items){
        if(key.includes("item")){
          item_count = item_count + this.items[key];
        }
      }
      console.log('[Item Count]' + item_count);

      let item_size = 30;
      let items_per_row = Math.floor(col_width/item_size);

      let counter = 0;
      for (let key in this.items){
        if(key.includes("item")){
          let volume = this.items[key];

          for(let i=0; i<volume; i++){
            let at_row = Math.floor(counter/items_per_row);
            let at_col = counter%items_per_row;

            let x = item_size * at_col + start_x * col_width;
            let y = item_size * at_row + start_y * row_height;

            var img = new Image();
            img.src = key;
            img.onload = function() {
              ctx.drawImage(this, x, y, item_size, item_size);
            };
            counter++;
            //console.log('[DRAW] ' + counter + '; ' + x + ',' + y);
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
