# E-mail Setup

Our domain is managed and hosted by Cloudflare. We use their email redirection feature, which allows us
to forward emails sent to our domains to other email addresses. Unfortunately, Cloudflare does not support forwarding
to a group of emails, but they do support using something they call an [_Email Worker_][emailworker]. This is essentially a
serverless function, similar to AWS Lambda or Google Cloud Functions.

[emailworker]: https://developers.cloudflare.com/workers/

## Adding emails to the administrative account

Pulumiverse has an administrative email that is used to access different systems. To manage which emails we forward to
you can access the [workers under email routing settings][worker-settings].

You will need to [edit the source code of the worker][worker-codeeditor], which should look something like this:

```javascript
export default {
  async email(message, env, ctx) {
    const boardEmails = [
      "boardmember1@email.com",
      "boardmember1@email.com",
      "boardmember1@email.com"
    ];
    
    for(const email of boardEmails){
      await message.forward(email);
    }
  }
}
```

You can [access the code editor directly and edit the code directly][worker-codeeditor], including deploying when you are done.

[worker-settings]: https://dash.cloudflare.com/caa2f1975dab04704dbe24bc277804e8/pulumiverse.com/email/routing/workers
[worker-codeeditor]: https://dash.cloudflare.com/caa2f1975dab04704dbe24bc277804e8/pulumiverse.com/email/routing/workers/edit/send-to-govboard/production

**Important**: All the emails that are added to the `boardEmails` array need to be [added to _Destination address_][dest-addr].
This means you need to make sure to add all the email addresses to [Destination Addresses for our admin account][settings-dest-addr]

[settings-dest-addr]: https://dash.cloudflare.com/caa2f1975dab04704dbe24bc277804e8/pulumiverse.com/email/routing/destination-address
[dest-addr]: https://developers.cloudflare.com/email-routing/setup/email-routing-addresses/#destination-addresses
