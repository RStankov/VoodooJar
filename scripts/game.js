define(function(require, exports, module) {

    var _ = require('lodash');
    var debug = require('debug')('jar:game');
    var Settings = require('settings');
    var Creeps = require('creeps');
    var KeysManager = require('KeysManager');

    var Cow = require('Cow');
    var Mouse = require('Mouse');
    var jellyBeans;
    var HeroInputs = require('HeroInputs');
    var KeyMap = require('KeyMap');
    var UIManager = require('UIManager');

    var Game = function Game() {
        var width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

        var height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;

        globals.windowWidth = width;
        globals.windowHeight = height;

        var game = new Phaser.Game(width, height, Phaser.AUTO, '', {
            create: create,
            preload: preload,
            update: update,
            render: render
        });

        var cow;
        var mouse;
        var ui;
        var totem;

        var cursors;

        var fpsText;
        var renderable;
        //var inputsText;

        function create() {
            renderable = game.add.group();

            game.time.advancedTiming = true;
            game.physics.startSystem(Phaser.Physics.ARCADE);

            game.stage.backgroundColor = '#AAAAAA';

            cow = new Cow(game, new HeroInputs(game, KeyMap.cow));
            mouse = new Mouse(game, new HeroInputs(game, KeyMap.mouse));

            cow.on('action:b', function() {
                debug('>> COW:B');
            });

            mouse.on('action:a', function() {
                cow.switchColor();
            });

            mouse.on('action:b', function() {
                debug('switch mouse & cow!');
                var mousePos = { x: mouse.sprite.x, y: mouse.sprite.y };
                var cowPos = { x: cow.sprite.x, y: cow.sprite.y };

                //debug(mousePos);
                //debug(cowPos);

                mouse.sprite.x = cowPos.x;
                mouse.sprite.y = cowPos.y;

                cow.sprite.x = mousePos.x;
                cow.sprite.y = mousePos.y;

                var mouseInputs = mouse.inputs;
                var cowInputs = cow.inputs;

                mouse.setInputs(cowInputs);
                cow.setInputs(mouseInputs);
            });


            game.cow = cow;
            game.mouse = mouse;

            var creepsGroup = Creeps.init(game);
            renderable.add(cow.sprite);
            renderable.add(mouse.sprite);
            renderable.add(creepsGroup);
            totem = game.add.sprite(globals.windowWidth / 2 - 134 / 2, globals.windowHeight - 326, 'totem');
            totem.animations.add('regular', [0, 1, 2, 3, 4, 5, 6], 12, true);
            totem.animations.play('regular');

            //var cow2 = game.add.sprite(Settings.COW.startX, Settings.COW.startY, 'hero-test');
            //cow2.animations.add('swim', Phaser.Animation.generateFrameNames('Cow Standing instance', 0, 32, '', 4), 30, true);
            //cow2.animations.play('swim');
            //cow2.animations.add('left', [3, 4, 5], 10, true);
            //cow2.animations.add('right', [6, 7, 8], 10, true);

            fpsText = game.add.text(16, 16, 'FPS: 0', {
                fontSize: '16px',
                fill: '#abc'
            });

            jellyBeans = game.add.group();
            jellyBeans.enableBody = true;

            ui = new UIManager(game);

            //inputsText = game.add.text(1, 36);
        }

        function preload() {
            game.load.spritesheet('hero-cow', 'assets/cow.png', Settings.COW.width, Settings.COW.height);
            game.load.spritesheet('hero-mouse', 'assets/mouse.png', 100, 138);
            game.load.spritesheet('creep', 'assets/creep.png', 126, 150);
            game.load.image('jellyBean', 'assets/dummy_jellyBean.png');

            game.load.spritesheet('totem', 'assets/totem.png', 134, 326);

            game.load.image('stamina-bar-bgr', 'assets/stamina-bar-bgr.png');
            game.load.image('stamina-bar-over', 'assets/stamina-bar-over.png');

            game.load.image('cow-hit', 'assets/cow-hit.png');
        }

        function update() {
            var timeSinceLastUpdate = game.time.elapsed;
            Creeps.update(timeSinceLastUpdate);

            renderable.sort('y', Phaser.Group.SORT_ASCENDING);

            fpsText.text = 'FPS: ' + game.time.fps;

            game.physics.arcade.collide(cow.sprite, Creeps.group, function(cow, creep) {
                //creep.attack();
                creep.die(function(coordinates) {
                    jellyBeans.create(coordinates.x, coordinates.y, 'jellyBean');
                });
            });

            game.physics.arcade.overlap(mouse.sprite, jellyBeans, collectJellyBean, null, this);
            // collission debugging
            //Creeps.group.forEachAlive(function(creep) {
            //    game.debug.body(creep);
            //});
            //game.debug.body(mouse.sprite);
            //game.debug.body(cow.sprite);
            //inputsText.text = 'inputs: ' + _.keys(KeysManager.getPressedKeys());
        }

        function collectJellyBean(mouse, jellyBean) {
            jellyBean.kill();
            //mouse.increaseStamina();
            // mouse add power
        };

        function render() {
        }

        return game;
    };


    return Game;
});