# @mantou/nes

## pull deps

```bash
git submodule update
```

## compile to wasm

[install](https://rustwasm.github.io/wasm-pack/installer/) wasm-pack.

```bash
# development
cargo watch -s "wasm-pack build --out-dir ../nes-pkg --target web --scope mantou --profiling"
# or
cargo watch -s "wasm-pack build --out-dir ../nes-pkg --target web --scope mantou --debug"
# build
wasm-pack build --out-dir ../nes-pkg --target web --scope mantou
```

## publish to npm

use `yarn publish:nes` at root directory
