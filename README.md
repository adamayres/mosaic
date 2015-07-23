# mosaic

Local development uses node/express to serve the static web content. For deployment to production, the web assets are compiled into [/build](https://github.com/adamayres/mosaic/tree/master/build).

## Installation for local dev

1. Install [NodeJs](http://nodejs.org/download/)
2. Install git and setup github using these [instructions](https://help.github.com/articles/set-up-git)
3. Start a new terminal and run the following commands:

```bash
# Install gulp and bower globally
npm install -g gulp bower

# Clone the repo
git clone https://github.com/adamayres/mosaic.git

# Avoid using sudo with npm; take ownership!
sudo chown -R $USER /usr/local

# Install the npm and bower dependencies in sails-angular-gulp-seed
cd mosaic; npm install; bower install

# Run the app using the default command gulp
gulp
```

The running app will be accessible at: ([http://localhost:9000/](http://localhost:9000)).

## Gulp commands

#### `gulp`

This is the default task that will start the app.

#### `gulp build`

This will compile the assets into /build for production use.
