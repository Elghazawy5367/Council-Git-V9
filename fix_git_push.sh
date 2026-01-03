#!/bin/bash

echo "=== GIT PUSH FIX SCRIPT ==="
echo "Timestamp: $(date)"
echo ""

echo "1. CURRENT LOCAL STATUS:"
echo "========================"
git log --oneline -5
echo ""

echo "2. REMOTE STATUS:"
echo "================="
git fetch origin
git log --oneline origin/main -5
echo ""

echo "3. BRANCH DIFFERENCES:"
echo "======================"
echo "What remote has that we don't:"
git log --oneline HEAD..origin/main
echo ""
echo "What we have that remote doesn't:"
git log --oneline origin/main..HEAD
echo ""

echo "4. CHOOSING STRATEGY:"
echo "====================="
echo "We have 2 options:"
echo "A) Merge (preserve both histories)"
echo "B) Rebase (clean history, our commits on top)"
echo ""
echo "Since we just restructured, let's REBASE to keep clean history."
echo ""

echo "5. EXECUTING REBASE:"
echo "===================="
git rebase origin/main
REBASE_EXIT=$?

if [ $REBASE_EXIT -eq 0 ]; then
    echo "✅ Rebase successful!"
    echo ""
    echo "6. PUSHING CHANGES:"
    echo "==================="
    git push origin main
else
    echo "❌ Rebase failed with conflicts."
    echo ""
    echo "6. RESOLVING WITH MERGE INSTEAD:"
    echo "================================"
    git rebase --abort
    git merge origin/main --no-edit
    echo "Merge completed."
    echo ""
    echo "7. PUSHING MERGE:"
    echo "================="
    git push origin main
fi

echo ""
echo "✅ DONE!"
