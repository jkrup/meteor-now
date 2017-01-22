![METEOR-NOW](assets/zeit.meteor.png "ZEIT + METEOR")

# Meteor Now [![npm version](https://badge.fury.io/js/meteor-now.svg)](https://badge.fury.io/js/meteor-now)

`meteor-now` is a tool to let you instantly deploy your Meteor apps with [now](http://zeit.co/now) with one command.

Just do `meteor-now -e ROOT_URL=... -e MONGO_URL=...` and instantly deploy your meteor app like you could back in the good 'ol days of `meteor deploy`.

## Demo
https://testmet-zioriusvcj.now.sh/

# Usage
## Install
Install the `now` and `meteor-now` packages:
```
$ npm install -g now meteor-now
```

## Configure `now` account
```
$ now --login
> Enter your email: <your email>
> Please follow the link sent to <your email> to log in.
> Verify that the provided security code in the email matches Pragmatic Manta Ray.

✔ Confirmed email address!

> Logged in successfully. Token saved in ~/.now.json
```

## Deployment
In your Meteor app directory, run `meteor-now` passing in environment variables according to `now` [docs](https://zeit.co/blog/environment-variables-secrets).
```
$ meteor-now -e ROOT_URL=... -e MONGO_URL=...
```

You will receive a unique link to your deployed app

![unique-link](assets/unique-link.png "Unique Link Terminal Image")

# Additional Info
## Using METEOR_SETTINGS
Currently there are two ways you can set the METEOR_SETTINGS environment variable in your deployments

- Using `now secrets`
```
$ now secrets add meteor-settings '{ "public": { "foo": "bar" }}'
$ meteor-now -e METEOR_SETTINGS=@meteor-settings -e ROOT_URL=... -e MONGO_URL=...
```

- Using `development.settings.json` and `production.settings.json`
Following the convention of the `NODE_ENV` environment varaibe, `meteor-now` uses `NODE_ENV` to determine which file to look for.
It will either look for `development.settings.json` or `production.settings.json` in your root Meteor directory.

Note that `meteor-now` will look for `development.settings.json` by default unless `NODE_ENV` is set to production or METEOR_SETTINGS was passed in as a result of the first option above.

# Authors
Justin Krup [@mazlix](https://github.com/mazlix)
Mirza Joldic [@purplecones](https://github.com/purplecones)
