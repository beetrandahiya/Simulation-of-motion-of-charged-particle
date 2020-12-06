    function project() {
        document.getElementById('renderport').style.padding = "10px";
        document.getElementById('ftr').style.position = 'relative';



        // module aliases
        var Engine = Matter.Engine,
            Events = Matter.Events,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Body = Matter.Body,
            Composite = Matter.Composite,
            Composites = Matter.Composites,
            Constraint = Matter.Constraint,
            MouseConstraint = Matter.MouseConstraint,
            Mouse = Matter.Mouse,
            World = Matter.World,
            Bodies = Matter.Bodies,
            Vector = Matter.Vector;

        // create an engine
        var engine = Engine.create();

        // create a renderer
        var render = Render.create({
            element: document.getElementById('renderport'),
            engine: engine,
            options: {
                width: 1200,
                height: 500,
                //showVelocity: true,
                //showCollisions: true,
                wireframes: false,

                background: '#0f0f13'
            }
        });



        //calculating horizontal and vertical velocity

        /* var angle = $("#angl").val();
            angle=angle*(Math.PI)/180;

            var v= $("#vel").val();
            vx=v*(Math.cos(angle)); 
            vy=-v*(Math.sin(angle));

            var coeffrst =$('#rst').val();

        */



        //calculating values for simulation
        var mass = $("#mass").val(); //mass
        var efld = $("#efld").val(); //electric field
        var chrg = $("#chrg").val(); //charge
        var vel = $("#vel").val(); //velocity

        Forceapplied = chrg * efld; // using formula     F=qE  






        //calculatig time for reading
     /*   var rtime = $("#tmi").val();
        rdtime = rtime * 10;
        rtime = rtime * 1000;
        */

        // create two bodies and a ground
        // var boxA = Bodies.rectangle(200, 600, 40, 40);
        //var ball1=Bodies.circle(50,440,30,{isStatic:true});
        var ball = Bodies.circle(20, 250, 5, {
            friction: 0,
            frictionAir: 0,
            inverseInertia: 0
        });
        var wall1 = Bodies.rectangle(600, 0, 1200, 20, {isStatic:true,restitution:0,
            render: {
                fillStyle: 'white',
                strokeStyle: 'white',
                lineWidth: 3
            }
        });
        var wall2 = Bodies.rectangle(600, 500, 1200, 20, {isStatic:true, restitution:0,
            render: {
                fillStyle: 'white',
                strokeStyle: 'white',
                lineWidth: 3
            }
        });


        engine.world.gravity.y = 0;
        Matter.Body.setMass(ball, mass);
        Matter.Body.setVelocity(ball, {
            x: vel,
            y: 0
        });


        velocityarr = []
        // add all of the bodies to the world
        World.add(engine.world, [ball, wall1, wall2]);
        Matter.Events.on(engine, 'beforeUpdate', function (event) {
            Body.applyForce(ball, {
                x: ball.position.x,
                y: ball.position.y
            }, {
                x: 0,
                y: Forceapplied
            });

        });




/*
        // To start the loop
        var mainLoopId = setInterval(function () {
            vx = ball.velocity.x;
            vy = ball.velocity.y;
            v = (vx) * (vx) + (vy) * (vy);
            v = Math.sqrt(v);
            v = v.toFixed(4);
            velocityarr.push(v);
            //  document.getElementById("velocityrealval").innerHTML=velocityarr;

        }, 100);

        // To stop the loop
        setTimeout(function () {
            clearInterval(mainLoopId);
        }, rtime);
        */
        /* 
        document.getElementById("velocityrealval").innerHTML=velocityarr;
        document.getElementById("velocityrealval1").innerHTML=timei;

        

        //add graph using chart.js 
        var timei = []
        for (let i = 0; i < rdtime; i++) {
            let ii = i * 0.1
            ii = ii.toFixed(2)
            timei.push(ii)

        }


        setTimeout(function () {

            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
                // The type of chart we want to create
                type: 'line',

                // The data for our dataset
                data: {
                    labels: timei,
                    datasets: [{
                        label: 'Velocity of the Ball',
                        backgroundColor: 'rgba(255, 99, 132,0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        data: velocityarr
                    }]
                },

                // Configuration options go here
                options: {}

            });
        }, rtime)








*/


        //add trail



        var trail = [];

        Events.on(render, 'afterRender', function () {
            trail.unshift({
                position: Vector.clone(ball.position),
                speed: ball.speed
            });

            Render.startViewTransform(render);
            render.context.globalAlpha = 0.7;

            for (var i = 0; i < trail.length; i += 1) {
                var point = trail[i].position,
                    speed = trail[i].speed;

                var hue = 250 + Math.round((1 - Math.min(1, speed / 10)) * 170);
                render.context.fillStyle = 'hsl(' + hue + ', 100%, 55%)';
                render.context.fillRect(point.x, point.y, 2, 2);
            }

            render.context.globalAlpha = 1;
            Render.endViewTransform(render);

            if (trail.length > 2000) {
                trail.pop();
            }
        });


        // add mouse control
        var mouse = Mouse.create(render.canvas),
            mouseConstraint = MouseConstraint.create(engine, {
                mouse: mouse,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });

        World.add(engine.world, mouseConstraint);

        render.mouse = mouse;




        // run the engine
        Engine.run(engine);

        // run the renderer
        Render.run(render);

    }