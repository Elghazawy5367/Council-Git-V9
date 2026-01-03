#!/bin/bash
# Usage: log_command "command to run" [log_file_name]
LOG_DIR="logs"
mkdir -p $LOG_DIR

if [ $# -eq 0 ]; then
  echo "Usage: log_command \"command\" [log_name]"
  return 1
fi

CMD="$1"
if [ $# -ge 2 ]; then
  LOG_NAME="$2"
else
  # Create a timestamp-based log name
  LOG_NAME="cmd_$(date +%Y%m%d_%H%M%S)"
fi

LOG_FILE="$LOG_DIR/${LOG_NAME}.log"

echo "Running: $CMD" | tee -a "$LOG_FILE"
echo "Timestamp: $(date)" | tee -a "$LOG_FILE"
echo "======================================" | tee -a "$LOG_FILE"

# Run the command and log output
eval "$CMD" 2>&1 | tee -a "$LOG_FILE"

echo "" | tee -a "$LOG_FILE"
echo "Output saved to: $LOG_FILE" | tee -a "$LOG_FILE"

# Also save to latest.log for quick reference
cp "$LOG_FILE" "$LOG_DIR/latest.log"
