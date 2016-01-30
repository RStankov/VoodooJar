require.config({
    baseUrl: 'scripts',
    paths: {
        'lodash'         : 'libs/lodash.min',
        'phaser'         : 'libs/phaser.min',
        'easystar'       : 'libs/easystar',
        'seek'           : 'seek',
        'map'            : 'map',
        'demo'           : 'seekers/demo',
    },
    config: {},
    deps: ['phaser'],
    callback: function() {
        require(['demo'], function(game) {
          game();
        });
    }
});
