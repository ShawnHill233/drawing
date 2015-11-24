        //保存上一个点
        var ppx, ppy;
        //保存当前点
        var cpx, cpy;
        //已绘点集合
        var point_array = [];
        //绘制点集合
        var draw_array = [];
        //连接范围半径
        var radius = 50;
        //线的颜色
        var line_color = 'black';
        $(document).ready(function() {
            var canvas = document.getElementById('tutorial');
            if (canvas.getContext) {
                var ctx = canvas.getContext('2d');
            }
//        //for cursor
            var cursor_canvas = document.getElementById('cursor');
            if (cursor_canvas.getContext) {
                var cursor_ctx = cursor_canvas.getContext('2d');
            }
            $(document).mousemove(function (e) {
                draw_array = [];    //清空可绘点

                drawCursorCircle(e.pageX, e.pageY);
            });
            $('#tutorial').on("mousedown", function (e) {
                //画点
                var cpx = e.pageX;
                var cpy = e.pageY;
                drawpoint(cpx, cpy);
                var ppx = cpx;
                var ppy = cpy;
                drawline(ppx, ppy, cpx, cpy);
                //画线
                $(this).on("mousemove", function (e) {
                    console.log("in tutorail");
                    var cpx = e.pageX;
                    var cpy = e.pageY;
                    point_array.push([cpx, cpy]);
                    drawline(ppx, ppy, cpx, cpy);
                    ppx = cpx;
                    ppy = cpy;
                });
                $(document).on("mouseup", function (e) { //bind to document to work with IE
                    $('#tutorial').off("mousemove");
                });
            });

            //================================
            //function define
            //画点
            var drawpoint = function (x, y) {
                ctx.strokeStyle = line_color;
                ctx.fillRect(x, y, 1, 1);
            };
            //画线（点是不连续的)
            var drawline = function (x1, y1, x2, y2) {
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
                //遍历已绘的点，将可取点存入array
                for (i = 0; i < point_array.length; i++) {
                    var x = point_array[i][0];
                    var y = point_array[i][1];
                    if (x < x2 + radius && x > x2 - radius) {
                        if (y < y2 + radius && y > y2 - radius) {
                            if ((x - x2) * (x - x2) + (y - y2) * (y - y2) < radius * radius) {
                                draw_array.push([x, y]);
                            }
                        }
                    }
                }
                // 取随机点
                draw_array = getRand(draw_array, 8);
                // 连接圆附近的随机点
                for (i = 0; i < draw_array.length; i++) {
                    var xx = draw_array[i][0];
                    var yy = draw_array[i][1];
                    ctx.moveTo(xx, yy);
                    ctx.lineTo(x2, y2);
                    ctx.lineWidth = 0.09;
                    ctx.stroke();
                }
            };
            //产生随机连接点
            var getRand = function (arr, len) {
                arr.sort(function () {
                    return Math.random() - 0.5;
                });
                return arr.slice(0, len);
            };
            //鼠标跟随的圆
            var drawCursorCircle = function (x, y) {
                cursor_ctx.clearRect(0, 0, canvas.width, canvas.height);
                //大圆
                cursor_ctx.beginPath();
                cursor_ctx.arc(x, y, radius, 0, 2 * Math.PI);
                cursor_ctx.lineWidth = 0.1;
                cursor_ctx.stroke();
                //中心的圆
                cursor_ctx.beginPath();
                cursor_ctx.moveTo(x,y);
                cursor_ctx.arc(x, y, 2, 0, 2 * Math.PI);
                cursor_ctx.lineWidth = 0.5;
                cursor_ctx.stroke();
            };

            //更换颜色
            $('#color-list li').on('click', function(){
                line_color = $(this).attr('id');
            });
        });