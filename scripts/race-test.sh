#!/usr/bin/env bash
# Usage: ./scripts/race-test.sh <TOKEN_A> <TOKEN_B> <PROGRAM_ID>
set -euo pipefail
: "${1:?token A required}"; : "${2:?token B required}"; : "${3:?program ID required}"
URL="http://localhost:3000/api/applications/$3"
curl -sS -o /tmp/sanad-a.json -w 'A HTTP %{http_code}\n' -X POST "$URL" -H "Authorization: Bearer $1" &
PID_A=$!
curl -sS -o /tmp/sanad-b.json -w 'B HTTP %{http_code}\n' -X POST "$URL" -H "Authorization: Bearer $2" &
PID_B=$!
wait "$PID_A"; wait "$PID_B"
echo 'Response A:'; cat /tmp/sanad-a.json; echo
echo 'Response B:'; cat /tmp/sanad-b.json; echo
