#!/bin/bash
#
# Repository Mirror Script
# Mirrors a GitHub repository to a new destination using git clone --mirror
#
# Usage:
#   ./mirror-repository.sh [source-url] [destination-url]
#
# Example:
#   ./mirror-repository.sh \
#     https://github.com/Elghazawy5367/Council-Git-V9 \
#     https://github.com/Elghazawy5367/Council-Git-V9A
#
# Requirements:
#   - Git installed and configured
#   - Authentication set up for both source and destination repositories
#   - Write access to the destination repository

set -e  # Exit on error
set -u  # Exit on undefined variable

# ANSI color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
SOURCE_REPO="${1:-https://github.com/Elghazawy5367/Council-Git-V9}"
DEST_REPO="${2:-https://github.com/Elghazawy5367/Council-Git-V9A}"
MIRROR_DIR="temp-mirror-$(date +%s)"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to cleanup on exit
cleanup() {
    if [ -d "$MIRROR_DIR" ]; then
        print_info "Cleaning up temporary mirror directory..."
        rm -rf "$MIRROR_DIR"
        print_success "Cleanup complete"
    fi
}

# Set trap to cleanup on exit
trap cleanup EXIT

# Print script header
echo ""
echo "=========================================="
echo "  Repository Mirror Script"
echo "=========================================="
echo ""
print_info "Source Repository: $SOURCE_REPO"
print_info "Destination Repository: $DEST_REPO"
echo ""

# Step 1: Validate git is installed
print_info "Step 1/4: Validating Git installation..."
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git and try again."
    exit 1
fi
print_success "Git is installed: $(git --version)"
echo ""

# Step 2: Clone repository with --mirror flag
print_info "Step 2/4: Cloning source repository with --mirror flag..."
print_info "This creates a bare repository with all refs, tags, branches, and commit history"
echo ""

if git clone --mirror "$SOURCE_REPO" "$MIRROR_DIR"; then
    print_success "Repository cloned successfully"
else
    print_error "Failed to clone repository. Please check:"
    print_error "  - Repository URL is correct"
    print_error "  - You have read access to the source repository"
    print_error "  - Network connection is stable"
    exit 1
fi
echo ""

# Step 3: Update remote URL to destination repository
print_info "Step 3/4: Updating remote URL to point to destination repository..."
cd "$MIRROR_DIR"

if git remote set-url origin "$DEST_REPO"; then
    print_success "Remote URL updated to: $DEST_REPO"
    
    # Verify the remote URL was set correctly
    CURRENT_REMOTE=$(git remote get-url origin)
    print_info "Verified remote URL: $CURRENT_REMOTE"
else
    print_error "Failed to update remote URL"
    exit 1
fi
echo ""

# Step 4: Push mirror to destination repository
print_info "Step 4/4: Pushing mirror to destination repository..."
print_info "This will push ALL refs, tags, branches, and commit history"
print_warning "The destination repository will be identical to the source"
echo ""

if git push --mirror; then
    print_success "Mirror push completed successfully!"
else
    print_error "Failed to push mirror. Please check:"
    print_error "  - Destination repository exists and is empty"
    print_error "  - You have write access to the destination repository"
    print_error "  - Your Git credentials are properly configured"
    exit 1
fi
echo ""

# Final summary
echo "=========================================="
echo "  Mirror Complete!"
echo "=========================================="
echo ""
print_success "Repository successfully mirrored from:"
print_info "  Source:      $SOURCE_REPO"
print_info "  Destination: $DEST_REPO"
echo ""
print_info "The destination repository now contains:"
print_info "  ✓ All commits and commit history"
print_info "  ✓ All branches (including remote branches)"
print_info "  ✓ All tags"
print_info "  ✓ All refs and metadata"
print_info "  ✓ Complete Git history and objects"
echo ""
print_success "You can now clone the destination repository normally:"
print_info "  git clone $DEST_REPO"
echo ""
