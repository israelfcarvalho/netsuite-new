#!/bin/bash

# Function to print colored output
print_message() {
  echo -e "\033[1;32m$1\033[0m"
}

# Function to print error output
print_error() {
  echo -e "\033[1;31m$1\033[0m"
}

# Function to verify cleanup
verify_cleanup() {
  local pattern=$1
  local type=$2
  local count=$(find . -name "$pattern" -type "$type" | wc -l)
  
  if [ "$count" -eq 0 ]; then
    print_message "✓ Cleanup verified: No $pattern found"
    return 0
  else
    print_error "✗ Cleanup failed: Found $count $pattern remaining"
    return 1
  fi
}

# Clean up .next directories
print_message "Cleaning .next directories..."
find . -name ".next" -type d -exec rm -rf {} +
if ! verify_cleanup ".next" "d"; then
  print_error "Failed to clean .next directories. Please check permissions."
  exit 1
fi

# Clean up .turbo directories
print_message "Cleaning .turbo directories..."
find . -name ".turbo" -type d -exec rm -rf {} +
if ! verify_cleanup ".turbo" "d"; then
  print_error "Failed to clean .turbo directories. Please check permissions."
  exit 1
fi

# Clean up node_modules directories
print_message "Cleaning node_modules directories..."
find . -name "node_modules" -type d -exec rm -rf {} +
if ! verify_cleanup "node_modules" "d"; then
  print_error "Failed to clean node_modules directories. Please check permissions."
  exit 1
fi

# Clean up pnpm-lock.yaml files
print_message "Cleaning pnpm-lock.yaml files..."
find . -name "pnpm-lock.yaml" -type f -delete
if ! verify_cleanup "pnpm-lock.yaml" "f"; then
  print_error "Failed to clean pnpm-lock.yaml files. Please check permissions."
  exit 1
fi

print_message "✓ All cleanup tasks completed successfully!"

 