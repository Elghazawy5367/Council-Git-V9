#!/bin/bash
set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BRANCH_NAME="worktree-2026-01-07T11-32-41"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
COMMIT_MESSAGE="Checkpoint commit - ${TIMESTAMP}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Safe Git Commit & Push Script${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Verify we're on the correct branch
echo -e "${YELLOW}[1/8] Verifying branch...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Current branch: ${CURRENT_BRANCH}"

if [ "$CURRENT_BRANCH" != "$BRANCH_NAME" ]; then
    echo -e "${RED}ERROR: Not on expected branch ${BRANCH_NAME}${NC}"
    echo -e "${RED}Current branch is: ${CURRENT_BRANCH}${NC}"
    exit 1
fi
echo -e "${GREEN}✓ On correct branch${NC}"
echo ""

# Step 2: Show current git status
echo -e "${YELLOW}[2/8] Current git status:${NC}"
git status
echo ""

# Step 3: Check for uncommitted changes
echo -e "${YELLOW}[3/8] Checking for changes...${NC}"
if git diff-index --quiet HEAD --; then
    if [ -z "$(git ls-files --others --exclude-standard)" ]; then
        echo -e "${GREEN}No changes to commit${NC}"
        echo "Repository is clean!"
        exit 0
    fi
fi
echo -e "${GREEN}✓ Changes detected${NC}"
echo ""

# Step 4: Show what will be staged
echo -e "${YELLOW}[4/8] Files to be committed:${NC}"
echo -e "${BLUE}Modified files:${NC}"
git diff --name-status
echo ""
echo -e "${BLUE}Untracked files:${NC}"
git ls-files --others --exclude-standard
echo ""

# Step 5: Check commits ahead of origin (before staging)
echo -e "${YELLOW}[5/8] Checking commits ahead of origin...${NC}"
COMMITS_AHEAD=$(git rev-list --count origin/${BRANCH_NAME}..HEAD 2>/dev/null || echo "0")
if [ "$COMMITS_AHEAD" -gt 0 ]; then
    echo -e "${YELLOW}You have ${COMMITS_AHEAD} unpushed commit(s):${NC}"
    git log --oneline origin/${BRANCH_NAME}..HEAD
else
    echo -e "${GREEN}No unpushed commits${NC}"
fi
echo ""

# Step 6: Stage all changes
echo -e "${YELLOW}[6/8] Staging all changes...${NC}"
if git add -A; then
    echo -e "${GREEN}✓ All changes staged successfully${NC}"
    echo ""
    echo "Staged changes:"
    git status --short
else
    echo -e "${RED}ERROR: Failed to stage changes${NC}"
    exit 1
fi
echo ""

# Step 7: Create commit
echo -e "${YELLOW}[7/8] Creating commit...${NC}"
echo "Commit message: ${COMMIT_MESSAGE}"
if git commit -m "${COMMIT_MESSAGE}"; then
    echo -e "${GREEN}✓ Commit created successfully${NC}"
    COMMIT_HASH=$(git rev-parse --short HEAD)
    echo "Commit hash: ${COMMIT_HASH}"
else
    echo -e "${RED}ERROR: Failed to create commit${NC}"
    exit 1
fi
echo ""

# Step 8: Push to origin
echo -e "${YELLOW}[8/8] Pushing to origin/${BRANCH_NAME}...${NC}"
if git push origin ${BRANCH_NAME}; then
    echo -e "${GREEN}✓ Successfully pushed to origin/${BRANCH_NAME}${NC}"
else
    echo -e "${RED}ERROR: Failed to push to origin${NC}"
    echo -e "${YELLOW}Your changes are committed locally but not pushed.${NC}"
    echo -e "${YELLOW}You can manually retry with: git push origin ${BRANCH_NAME}${NC}"
    exit 1
fi
echo ""

# Success summary
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  SUCCESS!${NC}"
echo -e "${GREEN}========================================${NC}"
echo "Branch: ${BRANCH_NAME}"
echo "Commit: ${COMMIT_HASH} - ${COMMIT_MESSAGE}"
echo "Status: Committed and pushed to GitHub"
echo ""

# Final status check
echo -e "${YELLOW}Final repository status:${NC}"
git status
echo ""

# Show remote sync status
COMMITS_AHEAD_AFTER=$(git rev-list --count origin/${BRANCH_NAME}..HEAD 2>/dev/null || echo "0")
if [ "$COMMITS_AHEAD_AFTER" -eq 0 ]; then
    echo -e "${GREEN}✓ Branch is fully synced with origin${NC}"
else
    echo -e "${YELLOW}⚠ Still ${COMMITS_AHEAD_AFTER} commit(s) ahead of origin${NC}"
fi

echo ""
echo -e "${BLUE}All done! Your work is safely backed up to GitHub.${NC}"
