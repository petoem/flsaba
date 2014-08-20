flSaba
======
**Simple Node.js File-server for folder sharing**

####flSaba is like Apache with Directory listing but fast & simple.

## Quick Start
First you need to install flSaba Globally.

```sh
$ npm install -g flsaba
```

Basic usage
-----------

####*Global*

cd into the directory to serve files from and do:

```sh
$ flsaba
```
Now point your Browser to &lt;ip&gt;:&lt;port&gt; (in this case: localhost:3000) and you will see your Directorys content.

####*Help*
```sh
$ flsaba -h

  Usage: flsaba [options]

  Options:

    -h, --help         output usage information
    -V, --version      output the version number
    -p, --port <n>     Port to listen on (default: 3000)
    -d, --dir [value]  Directory to serve files from (default: current working Directory)
```

Project Name
----
file (without vowels) = *fl*
サーバー (to Rōmaji) = *Sābā* (english: Server)

--------------------------

### [License (MIT)](LICENSE)
