# Quick Start: Mirror Repository Script

## 🎯 What This Does

Creates a **complete mirror** of the Council-Git-V9 repository to Council-Git-V9A, including:
- ✅ All commits and history
- ✅ All branches (local and remote)
- ✅ All tags
- ✅ All Git refs and metadata

## 🚀 Quick Start

### Option 1: Use Default Repositories (Recommended)

```bash
cd scripts
./mirror-repository.sh
```

This automatically mirrors:
- **From**: `https://github.com/Elghazawy5367/Council-Git-V9`
- **To**: `https://github.com/Elghazawy5367/Council-Git-V9A`

### Option 2: Custom Repositories

```bash
./mirror-repository.sh SOURCE_URL DESTINATION_URL
```

**Example:**
```bash
./mirror-repository.sh \
  https://github.com/myorg/source-repo \
  https://github.com/myorg/destination-repo
```

## 📋 Prerequisites

1. **Git installed**
   ```bash
   git --version  # Should show 2.0 or higher
   ```

2. **Authentication configured**
   - For HTTPS: Git credentials or Personal Access Token
   - For SSH: SSH keys configured with GitHub

3. **Repository access**
   - Read access to source repository
   - Write access to destination repository (should be empty)

## 🔐 Authentication Setup

### Using HTTPS with Personal Access Token

```bash
# Create token at: https://github.com/settings/tokens
# Then use it in the URL:
./mirror-repository.sh \
  https://username:TOKEN@github.com/user/source \
  https://username:TOKEN@github.com/user/destination
```

### Using SSH (Recommended)

```bash
# Test SSH connection
ssh -T git@github.com

# Use SSH URLs
./mirror-repository.sh \
  git@github.com:Elghazawy5367/Council-Git-V9.git \
  git@github.com:Elghazawy5367/Council-Git-V9A.git
```

## ⚡ What Happens

The script executes these steps:

1. **Validates** Git installation
2. **Clones** source with `git clone --mirror`
3. **Updates** remote URL to destination
4. **Pushes** complete mirror with `git push --mirror`
5. **Cleans up** temporary files automatically

## ✅ Verification

After the script completes, verify the mirror:

```bash
# Clone the destination
git clone https://github.com/Elghazawy5367/Council-Git-V9A verify
cd verify

# Check branches (should match source)
git branch -a

# Check tags (should match source)
git tag

# Check commit count (should match source)
git rev-list --all --count
```

## 🎨 Example Output

```
==========================================
  Repository Mirror Script
==========================================

[INFO] Source Repository: https://github.com/Elghazawy5367/Council-Git-V9
[INFO] Destination Repository: https://github.com/Elghazawy5367/Council-Git-V9A

[INFO] Step 1/4: Validating Git installation...
[SUCCESS] Git is installed: git version 2.43.0

[INFO] Step 2/4: Cloning source repository with --mirror flag...
[SUCCESS] Repository cloned successfully

[INFO] Step 3/4: Updating remote URL to destination repository...
[SUCCESS] Remote URL updated

[INFO] Step 4/4: Pushing mirror to destination repository...
[SUCCESS] Mirror push completed successfully!

==========================================
  Mirror Complete!
==========================================
```

## ❌ Common Errors

### "Permission denied"
**Solution**: Check authentication (see Authentication Setup above)

### "Repository not found"
**Solution**: Verify repository URLs and access permissions

### "Destination not empty"
**Solution**: Destination repo must be empty. Create a new empty repo.

## 📚 Full Documentation

For complete documentation, see:
- [scripts/README-MIRROR.md](README-MIRROR.md) - Full documentation
- [Main README](../README.md) - Project overview

## 🆘 Need Help?

1. Check [README-MIRROR.md](README-MIRROR.md) for detailed troubleshooting
2. Verify Git installation: `git --version`
3. Test authentication: `ssh -T git@github.com` or check credentials
4. Review error messages - they include specific guidance

## ⏱️ Expected Duration

- **Small repos** (&lt;100MB): ~30 seconds
- **Medium repos** (100MB-1GB): 1-5 minutes
- **Large repos** (&gt;1GB): 5-30 minutes

Time depends on:
- Repository size
- Number of refs/branches/tags
- Network speed
- Git LFS objects (if present)

---

**Quick Links:**
- 📖 [Full Documentation](README-MIRROR.md)
- 🔧 [Script Source](mirror-repository.sh)
- 🏠 [Project Home](../README.md)
