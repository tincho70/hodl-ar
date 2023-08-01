# HODL.ar SDK

Your Nostr and Lightning Provider. Just set up environment and start

## Features

- NIP-05
- LUD-16

## Docker

Pull the image from Docker Hub (masize/hodl-ar) _(Optional)_

```bash
docker pull masize/hodl-ar
```

Replace the environment variables and run the container

```bash
docker run -it -p 3000:3000 \
-e MAIN_DOMAIN="hodl.ar" \
-e MONGODB_URI="mongodb+srv://YOUR_MONGODB_URI" \
-e LNBITS_ENDPOINT="https://wallet.lacrypta.ar" \
-e LNBITS_ADMIN_KEY="YOUR_LNBITS_ADMIN_KEY" \
-e LNBITS_ADMIN_USER="YOUR_LNBITS_ADMIN_USER" \
masize/hodl-ar:latest
```

## Local Development

```bash
nvm use
yarn dev
```

## Author

- Agustin Kassis ([@agustin_kassis](https://twitter.com/agustin_kassis))
