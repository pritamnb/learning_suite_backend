# Learning Suite for SPARK Ada — backend

[![Run Unit Tests](https://github.com/pritamnb/learning_suite_backend/actions/workflows/test.yml/badge.svg)](https://github.com/pritamnb/learning_suite_backend/actions/workflows/test.yml)

Express + TypeScript API behind the [Learning Suite frontend](https://github.com/pritamnb/learning_suite_frontend).
It takes Ada and SPARK code from the browser, runs the GNAT toolchain on it in a scratch project, and returns
the compiler or prover output.

## API

| Method | Path | Input | What it does |
|---|---|---|---|
| `POST` | `/api/run-ada` | JSON `{ "code": "..." }` | Compiles the code with `gnatmake` and returns the output |
| `POST` | `/api/prove` | multipart: `specFile` (.ads), `bodyFile` (.adb), `verificationLevel` | Runs `gnatprove` in proof mode at the chosen level |
| `POST` | `/api/examine` | multipart: `specFile`, `bodyFile`, `verificationLevel` | Runs `gnatprove --mode=flow` (data and information flow analysis) |

## Design notes

- **Isolated scratch project.** Uploaded files go into a dedicated GNAT project (`src/spark_ada_project/main.gpr`),
  which is cleaned after every run, including the `bin/` and `obj/` folders.
- **No shell injection.** Prover commands are spawned with escaped arguments rather than built as shell strings.
- **Timeouts.** Each prover run is capped at 10 seconds so a runaway proof can't hold the server.
- **Layered structure:** routes → controllers → services, with upload, request-logging and error-handling
  middleware and Winston logging.

## Stack

Node.js, TypeScript, Express, Multer, Winston, Jest, GNAT / GNATprove, Docker.

## Getting started

You need Node.js and the GNAT toolchain with GNATprove on your `PATH`.

**GNAT on Linux**

```bash
# download GNAT Community from https://www.adacore.com/download, then:
gzip -dc gnat-community-<version>-<platform>-bin.tar.gz | tar xf -
cd gnat-community-<version>-<platform>-bin
sudo ./doinstall
export PATH=$PATH:/opt/gnat/bin
```

**GNAT on Windows:** run the installer from https://www.adacore.com/download, then add the GNAT `bin`
folder to `Path` (System Properties → Environment Variables).

**Run the API**

```bash
git clone https://github.com/pritamnb/learning_suite_backend.git
cd learning_suite_backend
npm install
npm run dev     # nodemon, http://localhost:8000
npm test        # Jest unit tests
```

## License

[MIT](LICENSE)
