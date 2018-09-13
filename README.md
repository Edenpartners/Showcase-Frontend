# E1 Showcase frontend


## Development setup (for GNU/Linux OS)

Core components:

* **ReactJS**
* **Bootstrap**
* **Reactstrap**
* **Ant design**
* **Eslint**

Create a directory for source code

```sh
mkdir e1-showcase-frontend
cd e1-showcase-frontend
git pull origin develop
```

Install Dependencies

```sh
# Install node
sudo apt-get install curl python-software-properties
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -

sudo apt-get install nodejs

# Install yarn
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list

sudo apt-get update && sudo apt-get install yarn

# Install packages
yarn install
```

## Configuration
```sh
cp config/config.local.js src/config.js
```

## Run development server

```sh
yarn start
```

## Build for production

```sh
yarn run build
```