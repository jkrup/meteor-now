# Meteor Now

`meteor-now` is a tool to let you instantly deploy your Meteor apps with [now](http://zeit.co/now). By using Dockerfile.

It wraps around the now command allowing you to pass in any environment variables as you normally would `now -e`

Just do `meteor-now -e ROOT_URL=http://example.com MONGO_URL=mongo://...` and instantly deploy your meteor app like you could back in the good 'ol days of `meteor deploy`
