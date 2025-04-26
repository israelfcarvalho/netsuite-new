#!/bin/bash

# Function to print colored output
print_message() {
  echo -e "\033[1;32m$1\033[0m"
}

print_warning() {
  echo -e "\033[1;33m$1\033[0m"
}

print_error() {
  echo -e "\033[1;31m$1\033[0m"
}

# Get required version from package.json
REQUIRED_VERSION=$(node -p "require('./package.json').engines.pnpm")
CURRENT_VERSION=$(pnpm --version)

if [ "$CURRENT_VERSION" != "$REQUIRED_VERSION" ]; then
  print_error "❌ pnpm version mismatch!"
  print_warning "Current version: $CURRENT_VERSION"
  print_warning "Required version: $REQUIRED_VERSION"
  print_message "\nTo fix this, run:"
  print_message "1. corepack enable"
  print_message "2. corepack prepare pnpm@$REQUIRED_VERSION --activate"
  print_message "3. pnpm install"
  exit 1
else
  print_message "✓ pnpm version $CURRENT_VERSION matches required version $REQUIRED_VERSION"
fi 