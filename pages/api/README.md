# TODO

### user/signup

Set headers

```json
{
  "X-API-KEY": "YOUR_API_KEY" // Admin key from LNBits HODL user
}
```

Creates a new user and wallet

https://39ad255340.d.voltageapp.io/docs#/usermanager/api_usermanager_users_create_usermanager_api_v1_users_post

```json
{
  "user_name": "string", // username
  "wallet_name": "string", // username
  "admin_id": "string", // From HODL.ar user
  "email": "", // Empty
  "password": "" // Random hash
}
```

Create LNURLp

https://39ad255340.d.voltageapp.io/docs#/lnurlp/api_link_create_or_update_lnurlp_api_v1_links_post

```json
{
  "description": "HODL.ar wallet",
  "min": 1,
  "max": 1000000,
  "currency": "satoshis",
  "comment_chars": 32
}
```

Return and save "lnurl" value
