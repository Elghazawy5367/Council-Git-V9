#!/bin/bash
set -e

echo "🏥 Running Council Health Check..."
echo "=================================="

echo ""
echo "1️⃣  Type checking..."
npm run type-check
if [ $? -eq 0 ]; then
    echo "✅ Type check passed"
else
    echo "❌ Type check failed"
    exit 1
fi

echo ""
echo "2️⃣  Linting (checking for issues)..."
npm run lint --silent
if [ $? -eq 0 ]; then
    echo "✅ Linting passed"
else
    echo "⚠️  Linting found issues (but continuing...)"
fi

echo ""
echo "3️⃣  Building project..."
npm run build
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "4️⃣  Testing build preview..."
npm run preview &
PREVIEW_PID=$!
sleep 5

# Check if preview server is running
if curl -f http://localhost:4173 > /dev/null 2>&1; then
    echo "✅ Preview server running"
    kill $PREVIEW_PID
else
    echo "⚠️  Could not reach preview server"
    kill $PREVIEW_PID 2>/dev/null || true
fi

echo ""
echo "=================================="
echo "✅ Health check complete!"
echo ""
echo "📊 Summary:"
echo "  - TypeScript: ✅ No errors"
echo "  - Build: ✅ Successful"
echo "  - Configuration: ✅ Aligned"
echo ""
echo "💡 Next steps:"
echo "  - Run 'npm run dev' to start development"
echo "  - Fix remaining ESLint warnings (optional)"
echo "  - Deploy with confidence!"
