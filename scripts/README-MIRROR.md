# Repository Mirror Script

## Overview

This script creates a complete mirror of a GitHub repository to a new destination repository using `git clone --mirror`. This ensures that **all refs, tags, branches, and commit history** are perfectly replicated.

## Features

- ✅ Complete repository replication using `git clone --mirror`
- ✅ Preserves all branches, tags, refs, and metadata
- ✅ Maintains complete commit history
- ✅ Automatic cleanup of temporary files
- ✅ Color-coded output for easy monitoring
- ✅ Comprehensive error handling and validation
- ✅ Support for command-line arguments

## Requirements

- Git installed and configured
- Authentication set up for both source and destination repositories
- Write access to the destination repository
- The destination repository should be **empty** or non-existent

## Usage

### Basic Usage (with default repositories)

```bash
cd scripts
./mirror-repository.sh
```

This will mirror:
- **Source**: `https://github.com/Elghazawy5367/Council-Git-V9`
- **Destination**: `https://github.com/Elghazawy5367/Council-Git-V9A`

### Custom Repositories

```bash
./mirror-repository.sh <source-url> <destination-url>
```

**Example:**
```bash
./mirror-repository.sh \
  https://github.com/user/source-repo \
  https://github.com/user/destination-repo
```

## What Gets Mirrored?

The script uses `git clone --mirror` which ensures the destination repository contains:

- ✓ **All commits** and complete commit history
- ✓ **All branches** (including remote branches)
- ✓ **All tags** (annotated and lightweight)
- ✓ **All refs** (refs/heads/*, refs/tags/*, refs/remotes/*)
- ✓ **Complete Git metadata** and objects
- ✓ **Git notes** and other special refs

## Step-by-Step Process

The script performs four main steps:

### Step 1: Validation
- Checks that Git is installed
- Validates Git version

### Step 2: Mirror Clone
```bash
git clone --mirror <source-repository>
```
- Creates a bare repository with all refs
- Downloads complete history and metadata
- Uses a temporary directory (auto-cleaned on exit)

### Step 3: Update Remote
```bash
git remote set-url origin <destination-repository>
```
- Updates the remote URL to point to the new repository
- Verifies the remote URL is set correctly

### Step 4: Mirror Push
```bash
git push --mirror
```
- Pushes ALL refs, tags, and branches
- Makes destination identical to source
- Preserves complete Git history

## Differences from `git clone --bare`

| Feature | `--mirror` | `--bare` |
|---------|-----------|----------|
| Remote branches | ✅ Included | ❌ Excluded |
| Tags | ✅ All tags | ⚠️ Some tags |
| Refs | ✅ All refs | ⚠️ Limited refs |
| Complete replica | ✅ Yes | ❌ No |
| For mirroring | ✅ Perfect | ❌ Not ideal |

**Why `--mirror` matters:**
- `--bare` only includes local refs
- `--mirror` includes ALL refs (remote branches, tags, notes, etc.)
- `--mirror` is designed specifically for creating complete replicas

## Security & Authentication

### HTTPS Authentication

For HTTPS URLs, you may need to provide credentials:

```bash
# Option 1: Use Git credential helper
git config --global credential.helper store

# Option 2: Use Personal Access Token in URL
https://username:token@github.com/user/repo
```

### SSH Authentication

For SSH URLs (recommended):

```bash
# Use SSH URLs
./mirror-repository.sh \
  git@github.com:user/source-repo.git \
  git@github.com:user/destination-repo.git
```

Make sure your SSH keys are set up:
```bash
ssh -T git@github.com
```

## Error Handling

The script includes comprehensive error handling:

- **Git not installed**: Clear error message with installation instructions
- **Clone failure**: Checks repository URL, access permissions, network
- **Remote update failure**: Validates remote URL configuration
- **Push failure**: Checks destination access, repository state
- **Automatic cleanup**: Temporary directories removed on exit (even on error)

## Output Example

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
[SUCCESS] Remote URL updated to: https://github.com/Elghazawy5367/Council-Git-V9A
[INFO] Verified remote URL: https://github.com/Elghazawy5367/Council-Git-V9A

[INFO] Step 4/4: Pushing mirror to destination repository...
[SUCCESS] Mirror push completed successfully!

==========================================
  Mirror Complete!
==========================================

[SUCCESS] Repository successfully mirrored from:
[INFO]   Source:      https://github.com/Elghazawy5367/Council-Git-V9
[INFO]   Destination: https://github.com/Elghazawy5367/Council-Git-V9A

[INFO] The destination repository now contains:
[INFO]   ✓ All commits and commit history
[INFO]   ✓ All branches (including remote branches)
[INFO]   ✓ All tags
[INFO]   ✓ All refs and metadata
[INFO]   ✓ Complete Git history and objects

[SUCCESS] You can now clone the destination repository normally:
[INFO]   git clone https://github.com/Elghazawy5367/Council-Git-V9A
```

## Troubleshooting

### Error: "fatal: destination path 'temp-mirror-*' already exists"

**Solution**: The script uses unique temporary directories. If this occurs, check for stale directories and remove them:
```bash
rm -rf temp-mirror-*
```

### Error: "fatal: could not read Username"

**Solution**: Set up Git credentials:
```bash
git config --global credential.helper store
# Or use SSH instead of HTTPS
```

### Error: "remote: Repository not found"

**Solution**: 
- Verify the destination repository exists
- Check you have write access
- Ensure the repository URL is correct

### Error: "fatal: refusing to push"

**Solution**: 
- Make sure the destination repository is empty
- If not empty, you may need to force push (dangerous):
  ```bash
  git push --mirror --force
  ```

## Verification

After running the script, verify the mirror:

```bash
# Clone the destination repository
git clone https://github.com/Elghazawy5367/Council-Git-V9A test-clone
cd test-clone

# Check branches
git branch -a

# Check tags
git tag

# Check commit history
git log --oneline --all --graph
```

## Integration with CI/CD

The script can be used in automated workflows:

```yaml
# GitHub Actions example
- name: Mirror repository
  run: |
    chmod +x scripts/mirror-repository.sh
    ./scripts/mirror-repository.sh $SOURCE_REPO $DEST_REPO
  env:
    SOURCE_REPO: https://github.com/org/source
    DEST_REPO: https://github.com/org/destination
```

## License

This script is part of the Council-Git-V9 project and follows the same license.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Verify Git installation and permissions
3. Review error messages carefully
4. Open an issue in the repository if needed

---

**Last Updated**: February 10, 2026
**Script Version**: 1.0.0
