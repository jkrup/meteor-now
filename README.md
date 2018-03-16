# Meteor Now [![CircleCI](https://circleci.com/gh/jkrup/meteor-now.svg?style=svg)](https://circleci.com/gh/jkrup/meteor-now) [![npm version](https://badge.fury.io/js/meteor-now.svg)](https://badge.fury.io/js/meteor-now)

`meteor-now` is a tool to let you instantly deploy your Meteor apps with one command using ZEIT's [▲now](http://zeit.co/now) service. Just run `meteor-now` and instantly deploy your Meteor app like you could back in the good 'ol days of `meteor deploy`.

<p align="center">
  <img src="https://github.com/jkrup/meteor-now/raw/master/assets/meteor-now-intro.gif">
</p>

## Demo
[https://meteor-test-msrbsvslpz.now.sh](https://meteor-test-msrbsvslpz.now.sh)

# Install
Install the `now` and `meteor-now` packages:
```
$ npm install -g now meteor-now
```

Create `now` account
```
$ now login
> Enter your email: <your email>
> Please follow the link sent to <your email> to log in.
> Verify that the provided security code in the email matches Pragmatic Manta Ray.

✔ Confirmed email address!

> Logged in successfully. Token saved in ~/.now.json
```

# Usage

## Deploying for Development / Testing

In your Meteor app directory, run `meteor-now`.

```
~/my-meteor-app/ $ meteor-now
✔ [METEOR-NOW] - building meteor app
✔ [METEOR-NOW] - preparing build
✔ [METEOR-NOW] - deploying build
✔ [METEOR-NOW] - meteor app deployed to https://meteor-test-msrbsvslpz.now.sh
```

## Deploying for Production

There are a few things you'll want to know before using `meteor-now` in production. And your deploy command will probably look more like the following:

```
meteor-now -e MONGO_URL=mongodb://<username>:<pass>@.... -e ROOT_URL=https://mydomain.com -e NODE_ENV=production`
```

If your app uses MongoDB at all you will want to specify a `-e MONGO_URL=` for persistent storage of data. [Mlab](http://mlab.com) has a great free sandbox tier, but also not recommended for production (you will probably want to pay at some point).

You should also have a paid account with [▲now](https://zeit.co/now) so that you can specify a custom domain name, and have more than 1GB of bandwidth/mo.

You will also likely want to specify a `-e ROOT_URL=` [http://stackoverflow.com/questions/24046186/meteor-what-is-the-purpose-of-root-url-and-to-what-should-it-be-defined](http://stackoverflow.com/questions/24046186/meteor-what-is-the-purpose-of-root-url-and-to-what-should-it-be-defined)

Finally you should have a `production.settings.json` in your project directory if you are using `METEOR_SETTINGS` (i.e. passing in `--settings`) and use `-e NODE_ENV=production` to tell `meteor-now` to use that.

# How
![METEOR-NOW](assets/zeit-meteor.png "METEOR-NOW")
`meteor-now` use ZEITs [▲now](https://zeit.co/now) service to deploy the Meteor app in a container. Please refer to their [documentation and support](https://github.com/zeit/) for hosting related details.

# Additional Info
## Full deploy with MongoDB
`meteor-now` lets you to deploy your Meteor app with a MongoDB included similar to how `meteor deploy` used to work. **This method is not intended for production deployments**. In order to achieve this, we bundle your Meteor app and MongoDB into a a single Dockerfile and we instruct your app to connect to the local MongoDB instance. The Dockerfile gets built in the cloud by `now` and once it's ready, the Meteor app will spin up and connect to the MongoDB instance running locally in that docker container.

Some things to keep in mind here is that since MongoDB is installed on the docker container itself, your app data is not persistent and has the chance of getting deleted if a new container is created. Because `now` automatically scales your deployment with load, new docker containers are bound to be created and your is likely going to get lost.

To not have this issue, spin up your own MongoDB instance and pass the `-e MONGO_URL=...` flag when you deploy.
## Using METEOR_SETTINGS
Currently there are two ways you can set the METEOR_SETTINGS environment variable in your deployments

- Using `now secrets`

```
$ now secrets add meteor-settings '{ "public": { "foo": "bar" }}'
$ meteor-now -e METEOR_SETTINGS=@meteor-settings -e MONGO_URL=...
```

- Using `development.settings.json` and `production.settings.json`
Following the convention of the `NODE_ENV` environment variable, `meteor-now` uses `NODE_ENV` to determine which file to look for.
It will either look for `development.settings.json` or `production.settings.json` in your root Meteor directory.

Note that `meteor-now` by default looks for `development.settings.json` unless otherwise specified by `-e NODE_ENV=production` or `-e METEOR_SETTINGS='{ "foo": "bar" }'`.

## Debug
In order to see detailed deployment logs as they happen, pass the `-d` when you deploy.

## Bundle Splitting
The `now` free tier has a limitation of 1mb per file. As a workaround, we split the final bundle into pieces prior to uploading. If you are on a paid plan, you can turn this off by passing the `--nosplit` flag like so `meteor-now --nosplit`.

## FAQ
### Can I use this in production?
Yes– if you are paying for ▲now and using an external database! ▲now supports dynamic autoscaling of apps (with sticky-sessions), you should read all the caveats related to `now` if you are not paying for a monthly plan– You only get 1GB of bandwidth per month, and also your source files are made (somewhat) public at your url /_src
Also read the caveats below if you did not specify a MONGO_URL

### What happens when I don't specify a MONGO_URL
When you don't specify a MONGO_URL we bundle a local version of MonogoDB with your application. What this basically means is that if your application ever gets shut down, or scales up to multiple instances you will lose all data that was inserted into your DB.

### How can I change my ROOT_URL
In order to set the ROOT_URL for your application, pass the -e flag along with the value for what you want the ROOT_URL to be. Example: `meteor-now -e ROOT_URL=www.mymeteorapp.com`

### How do I set a domain name
In order to use a custom domain name, you would need a Pro account with now.

Run `now domain add --external meteor-now.com`. You should get a response back with steps to verify your domain.

```
Verification required: Please add the following TXT record on the external DNS server: _now.meteor-now.com: ea39a62a58b3109f92024230826e37f0adc6abcd
```

In your domain DNS settings, add a TXT record with the above information.

Wait a few moments for the DNS records to propagate and rerun the same command above.
```
$ now domains add --external meteor-now.com
Success! Domain meteor-now.com verified [2s]
```

Now alias your deployment to the new domain
```
$ now alias https://meteor-now-site-izdolpdrvv.now.sh/ www.meteor-now.com
www.meteor-now.com is a custom domain.
Verifying the DNS settings for www.meteor-now.com (see https://zeit.world for help)
Verification OK!
Provisioning certificate for www.meteor-now.com
Success! Alias created: https://www.meteor-now.com now points to https://meteor-now-site-izdolpdrvv.now.sh [copied to clipboard]
```

Read [this blog post](https://zeit.co/blog/now-alias) for more information.

### Why are my XX resource not loading
Because now enforces SSL, you may experience some issues with 3rd party resources (such as google fonts) not being fetched by your clients due to mixed content warnings. To resolve, just make sure all your assets are being fetched with https:// protocol urls whenever available. If that's not possible, you may need to just download those assets and serve them locally through meteor's public/ directory.

### I deployed my free app but it's failing to connect to MongoDB
If you're deploying with an included MongoDB, we've observed that sometimes MongoDB takes a while to start. In this case, Meteor complains that it can't connect to MongoDB. Give it a few more minutes and your app should start. Make sure to refresh the page.

### I want to use a different docker image
The default docker images are `nodesource/jessie:0.10.43` for Meteor < 1.4 and `node:8.9.4` for >= 1.4.
If you want to use a different image, use the `--docker-image` flag.

### My app requires XX can I use my own Dockerfile?
We're currently support passing a `--deps 'depName1,depName2'` flag so that applications that rely on things like imagemagick are able to work. We are also looking into the ability to specify your own Dockerfile in the case that you require even more customization.

Stay tuned to updates on the [issue](https://github.com/jkrup/meteor-now/issues/6)

# Authors
<a href="https://www.github.com/jkrup"><img src="https://avatars2.githubusercontent.com/u/519731?v=3&s=460" alt="Justin Avatar" height="100" width="100"></a>|<a href="https://www.github.com/purplecones"><img src="https://avatars1.githubusercontent.com/u/136654?v=3&s=460" height="100" width="100" alt="Mirza Avatar"></a>
---|---
Justin Krup|Mirza Joldic
[@jkrup](https://www.github.com/jkrup)|[@purplecones](https://www.github.com/purplecones)
