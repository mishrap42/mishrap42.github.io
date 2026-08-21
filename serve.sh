#!/usr/bin/env bash
# Local preview for mishrap42.github.io
#
#   ./serve.sh            -> http://localhost:4000 with live reload
#   ./serve.sh --no-open  -> same, without opening a browser
#   ./serve.sh --build    -> one-off build into _site/, no server
#
# Uses the keg-only Homebrew Ruby 3.3 rather than macOS system Ruby 2.6,
# which is too old for the github-pages gem. Gems live in vendor/bundle
# (see .bundle/config), so nothing is installed system-wide.

set -euo pipefail
cd "$(dirname "$0")"

RUBY_PREFIX="/opt/homebrew/opt/ruby@3.3"
if [[ ! -x "$RUBY_PREFIX/bin/ruby" ]]; then
  echo "Ruby 3.3 not found. Install it with: brew install ruby@3.3" >&2
  exit 1
fi
export PATH="$RUBY_PREFIX/bin:$PATH"

# The old sass converter reads .scss as US-ASCII unless the locale says UTF-8,
# and _sass has non-ASCII characters in it.
export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"

if [[ ! -d vendor/bundle ]]; then
  echo "Installing gems into vendor/bundle (first run only)..."
  bundle config set --local path vendor/bundle
  bundle install
fi

if [[ "${1:-}" == "--build" ]]; then
  exec bundle exec jekyll build
fi

# --no-open is ours, not Jekyll's: serve without launching a browser.
# (Written as two exec lines rather than an array: macOS ships Bash 3.2,
# where expanding an empty array under `set -u` is an unbound-variable error.)
if [[ "${1:-}" == "--no-open" ]]; then
  shift
  exec bundle exec jekyll serve --livereload "$@"
fi

exec bundle exec jekyll serve --livereload --open-url "$@"
