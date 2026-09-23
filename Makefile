ARCHES := x86 arm
# overrides to s9pk.mk must precede the include statement
include node_modules/@start9labs/start-sdk/s9pk.mk

# `make universal` builds btctx.s9pk with both architectures (what the release
# workflow publishes); `make` builds one s9pk per architecture. Packing needs a
# packaging workspace above this directory: `start-cli s9pk init-workspace ..`
# (see UPDATING.md).
