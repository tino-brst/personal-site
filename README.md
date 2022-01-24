## Getting Started

First, let's get our [PlanetScale](https://planetscale.com) database running:

```bash
# Sign in to PlanetScale
pscale auth login

# Make the 'preview' database locally available on port 3309.
# Looking at the env variables, you can see that that's where we expect it to be
pscale connect personal-site preview --port 3309
```

And finally, on a new terminal, start the development server:

```bash
npm run dev
```
