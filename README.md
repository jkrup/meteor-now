# Meteor Now

`meteor-now` is a tool to let you instantly deploy your Meteor apps with [now](http://zeit.co/now). By using Dockerfile.

It wraps around the now command allowing you to pass in any environment variables as you normally would `now -e`

Just do `meteor-now -e ROOT_URL=http://example.com -e MONGO_URL=mongo://...` and instantly deploy your meteor app like you could back in the good 'ol days of `meteor deploy`

# Usage
Create an account at [https://zeit.co/login](https://zeit.co/login)

Install `meteor-now` package
```
yarn global add meteor-now
or
npm install -g meteor-now
```

In your Meteor app directory, run `meteor-now` passing in environment variables according to `now` [docs](https://zeit.co/blog/environment-variables-secrets)
```
meteor-now -e ROOT_URL=http://example.com -e MONGO_URL=mongo://...
```

You will receive a unique link to your deployed app

![unique-link](assets/unique-link.png "Unique Link Terminal Image")
