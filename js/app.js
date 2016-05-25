
window.onload = function() {

    // A cross-browser requestAnimationFrame
    // See https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
    var requestAnimFrame = (function() {
        return window.requestAnimationFrame    ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            window.oRequestAnimationFrame      ||
            window.msRequestAnimationFrame     ||
            function(callback){
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    // Install logic
    // If the app has already been installed, we don't do anything.
    // Otherwise we'll show the button, and hide it when/if the user installs the app.
    var installButton = document.getElementById('install');
    var manifestPath = AppInstall.guessManifestPath();

    if(AppInstall.isInstallable()) {

      // checking for app installed is an asynchronous process
      AppInstall.isInstalled(manifestPath, function isInstalledCb(err, result) {

        if(!err && !result) {

          // No errors, and the app is not installed, so we can show the install button,
          // and set up the click handler as well.
          installButton.classList.remove('hidden');

          installButton.addEventListener('click', function() {

            AppInstall.install(manifestPath, function(err) {
              if(!err) {
                installButton.classList.add('hidden');
              } else {
                alert('The app cannot be installed: ' + err);
              }
            });

          }, false);

        }

      });

    }


    // Create the canvas
    var mainContainer = document.querySelector('main');
    var canvas = document.createElement("canvas");
    var infoContainer = document.querySelector('div.info');
    var ctx = canvas.getContext("2d");
    var initialCanvasWidth = canvas.width = 320;
    var initialCanvasHeight = canvas.height = 480;
    mainContainer.appendChild(canvas);

    infoContainer.addEventListener('click', function(ev) {
        infoContainer.classList.add('hidden');
    });
    // The player's state
    var player = {
        x: 0,
        y: 0,
        sizeX: 60,
        sizeY: 15
    };
    var linkImage = new Image();
    linkImage.src = "img/link.png";
    function sprite (options) {
        var that = {};

        that.context = options.context;
        that.width = options.width;
        that.height = options.height;
        that.image = options.image;

        return that;
    }
    var link = sprite({
        context: canvas.getContext("2d"),
        width: 160,
        height: 100,
        image: linkImage
    });
    var playerTopRight = player.x + player.sizeX;

    // Don't run the game when the tab isn't visible
    window.addEventListener('focus', function() {
        unpause();
    });

    window.addEventListener('blur', function() {
        pause();
    });

    window.addEventListener('resize', resize);

    //Initially resize the game canvas.
    resize();
    // Let's play this game!
    reset();
    var then = Date.now();
    var running = true;
    main();


    // Functions ---


    // Reset game to original state
    function reset() {
        player.x = (canvas.width-player.sizeX)/2;
        player.y = 10;
    }

    // Pause and unpause
    function pause() {
        running = false;
    }

    function unpause() {
        running = true;
        then = Date.now();
        main();
    }

    // Update game objects.
    // We'll use GameInput to detect which keys are down.
    // If you look at the bottom of index.html, we load GameInput
    // from js/input.js right before app.js
    function update(dt) {
        // Speed in pixels per second
        var playerSpeed = 300;

        // if(GameInput.isDown('DOWN')) {
        //     // dt is the number of seconds passed, so multiplying by
        //     // the speed gives you the number of pixels to move
        //     if ( player.y+player.sizeY <= canvas.height ) {
        //         player.y += playerSpeed * dt;
        //     }
        // }

        // if(GameInput.isDown('UP')) {
        //     if ( player.y >= canvas.height-canvas.height ) {
        //         player.y -= playerSpeed * dt;
        //     }
        // }

        if(GameInput.isDown('LEFT')) {
            if ( player.x >= canvas.width-canvas.width ) {
                player.x -= playerSpeed * dt;
            }
        }

        if(GameInput.isDown('RIGHT')) {
            if ( player.x + player.sizeX <= canvas.width ) {
                player.x += playerSpeed * dt;
            }
        }

        // You can pass any letter to `isDown`, in addition to DOWN,
        // UP, LEFT, RIGHT, and SPACE:
        // if(GameInput.isDown('a')) { ... }
    }


    // Draw Things
    var playerRightSide = player.x + player.width;
        if ( playerRightSide >= 200 )
    function drawPlayer() {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Player
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.fillRect(player.x, player.y, player.sizeX, player.sizeY);
        ctx.closePath();
        playerTopRight += dx;


    }
    var ballX = canvas.width/2;
    // var ballX = canvas.width;
    var ballY = canvas.height;
    var dx = Math.floor(Math.random() * (5 - -5 + 1)) + -5;
    var dy = -2;
    var ballRadius = 5;

    function drawBall() {
        // Ball
        ctx.beginPath();
        ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2, false);
            if (ballY + dy > canvas.height + ballRadius) {
                dy = -dy;
            }
            if (ballY + dy < 0) {
                dy = -dy;
                console.log('Game Over')
            }
            if ( ballY - ballRadius <= player.y+player.sizeY ) {
                if ( ballY - ballRadius >= player.y+player.sizeY/2) {
                    if ( ballX + ballRadius >= player.x ) {
                        if ( ballX - ballRadius <= player.x + player.sizeX ) {
                            console.log("1")
                            dy = -dy+1;
                        }
                    }
                }
            }
            if ( ballY + ballRadius >= player.y ) {
                if ( ballY + ballRadius <= player.y+player.sizeY/2)
                    if ( ballX + ballRadius >= player.x ) {
                        if ( ballX -ballRadius <= player.x + player.sizeX ) {
                            console.log("CHeck")
                            dy = -dy;
                    }
                }
            }
            if ( ballX + ballRadius >= player.x ) {
                if ( ballX - ballRadius <= player.x + player.sizeX ) {
                    if ( ballY >= player.y ) {
                        if ( ballY <= player.y + player.sizeY ) {
                            dx = -dx;
                            console.log("test 3")
                        }
                    }
                }
            }
            if (ballX + dx > canvas.width || ballX + dx < 0) {
                dx =  -dx;
            }

        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
        ballX += dx;
        ballY += dy;
    }
    // function drawLine () {
    //     ctx.beginPath();
    //     ctx.moveTo(0,0);
    //     ctx.lineTo(canvas.width,480);
    //     ctx.lineTo(60, 80);
    //     ctx.closePath();
    //     ctx.stroke();
    //     ctx.strokeStyle = 'blue';
    //     ctx.fillStyle = 'orange';
    //     ctx.fill();
    // }

    // The main game loop
    function main() {
        if(!running) {
            return;
        }

        var now = Date.now();
        var dt = (now - then) / 1000.0;

        update(dt);
        drawPlayer();
        drawBall();
        // drawLine();

        then = now;
        requestAnimFrame(main);
    }

    // based on: https://hacks.mozilla.org/2013/05/optimizing-your-javascript-game-for-firefox-os/
    function resize() {
        var browser = [
            window.innerWidth,
            window.innerHeight
        ];
        // Minimum scale
        var scale = Math.min(
            browser[0] / initialCanvasWidth,
            browser[1] / initialCanvasHeight);
        // Scaled content size
        var size = [
            initialCanvasWidth * scale,
            initialCanvasHeight * scale
        ];
        // Offset from top/left
        var offset = [
            (browser[0] - size[0]) / 2,
            (browser[1] - size[1]) / 2
        ];

        // Apply CSS transform
        var rule = "translate(" + offset[0] + "px, " + offset[1] + "px) scale(" + scale + ")";
        mainContainer.style.transform = rule;
        mainContainer.style.webkitTransform = rule;
    }

};
