flSaba
======
**simple http server with directory listing**

## Quick Start
First, you need to install flsaba globally.

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
Now point your Browser to &lt;ip&gt;:&lt;port&gt; (in this case: localhost:3000) and you will see your directories content.

####*Help*
```sh
$ flsaba -h

  Usage: flsaba [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -p, --port <n>       port to listen on (default: 3000)
    -d, --dir [value]    directory to serve files from (default: current working directory)
    -s, --style [value]  path to CSS file
    -f, --forcedl        set to force download of file
    -b, --background     start flsaba as a background process

```

Project Name
----
file (without vowels) = *fl*  
サーバー (to Rōmaji) = *Sābā* (english: Server)

--------------------------

### [License (MIT)](LICENSE)
