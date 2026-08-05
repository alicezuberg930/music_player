#!/usr/bin/env bash

set -euo pipefail

readonly ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
readonly SECRET_NAME_PREFIX="yukikaze-player"

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <dev|prod> [--env-file <path>] [--namespace <namespace>]" >&2
  echo "Example: $0 dev --env-file ./.env.dev.k8s --namespace default" >&2
  exit 1
fi

ENVIRONMENT="$1"
shift

case "$ENVIRONMENT" in
  dev|prod) ;;
  *)
    echo "Environment must be either dev or prod." >&2
    exit 1
    ;;
esac

ENV_FILE="$ROOT_DIR/.env.${ENVIRONMENT}.k8s"
NAMESPACE="default"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file)
      ENV_FILE="$2"
      shift 2
      ;;
    --namespace)
      NAMESPACE="$2"
      shift 2
      ;;
    *)
      echo "Unknown argument: $1" >&2
      exit 1
      ;;
esac
done

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing env file: $ENV_FILE" >&2
  exit 1
fi

if ! command -v kubectl >/dev/null 2>&1; then
  echo "kubectl is required but was not found in PATH." >&2
  exit 1
fi

declare -A ENV_VARS
declare -a ORDERED_KEYS=()
declare -A ORDERED_INDEX=()

is_secret_key() {
  local key=$1
  case "$key" in
    CLOUDINARY_API_KEY|\
    CLOUDINARY_API_SECRET|\
    CLOUDINARY_CLOUD_NAME|\
    GOOGLE_CLIENT_ID|\
    GOOGLE_CLIENT_SECRET|\
    GOOGLE_REDIRECT_URI|\
    FACEBOOK_CLIENT_ID|\
    FACEBOOK_CLIENT_SECRET|\
    FACEBOOK_REDIRECT_URI|\
    ACCESS_TOKEN_SECRET|\
    ACCESS_TOKEN_EXPIRES_IN|\
    REFRESH_TOKEN_SECRET|\
    REFRESH_TOKEN_EXPIRES_IN|\
    MYSQL_DATABASE|\
    MYSQL_HOST|\
    MYSQL_PASSWORD|\
    MYSQL_PORT|\
    MYSQL_SSL_MODE|\
    MYSQL_USER|\
    REDIS_URL|\
    REDIS_HOST|\
    REDIS_PORT|\
    REDIS_MAX_CONNECTION_RETRY|\
    REDIS_MIN_CONNECTION_DELAY_IN_MS|\
    REDIS_MAX_CONNECTION_DELAY_IN_MS|\
    KAFKA_BROKERS|\
    KAFKA_CLIENT_ID|\
    KAFKA_COMMENT_REPLY_TOPIC|\
    KAFKA_COMMENT_REPLY_GROUP_ID|\
    KAFKA_CHAT_EVENTS_TOPIC|\
    KAFKA_CHAT_EVENTS_GROUP_ID|\
    KAFKA_SASL_USERNAME|\
    KAFKA_SASL_PASSWORD|\
    WEB_PUSH_SUBJECT|\
    WEB_PUSH_PRIVATE_KEY|\
    RESEND_API_KEY)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

trim() {
  local value="$1"
  value="${value#"${value%%[![:space:]]*}"}"
  value="${value%"${value##*[![:space:]]}"}"
  printf '%s' "$value"
}

normalize_value() {
  local value="$1"

  if [[ "$value" =~ (.*)[[:space:]]#.* ]]; then
    value="${BASH_REMATCH[1]}"
  fi

  value="${value%\r}"
  trim "$value"
}

while IFS= read -r raw_line; do
  line="$(trim "$raw_line")"
  line="${line%\r}"

  if [[ -z "$line" || "${line:0:1}" == "#" ]]; then
    continue
  fi

  if [[ "$line" != *"="* ]]; then
    continue
  fi

  key="$(trim "${line%%=*}")"
  value="$(normalize_value "${line#*=}")"
  value="${value#\"}"
  value="${value%\"}"

  if [[ -z "${ORDERED_INDEX[$key]+x}" ]]; then
    ORDERED_KEYS+=("$key")
    ORDERED_INDEX["$key"]=1
  fi
  ENV_VARS["$key"]="$value"
done < "$ENV_FILE"

tmp_secret=$(mktemp)
tmp_config=$(mktemp)
trap 'rm -f "$tmp_secret" "$tmp_config"' EXIT

for key in "${ORDERED_KEYS[@]}"; do
  value="${ENV_VARS[$key]}"
  if is_secret_key "$key"; then
    printf '%s=%s\n' "$key" "$value" >> "$tmp_secret"
  else
    printf '%s=%s\n' "$key" "$value" >> "$tmp_config"
  fi
done

if [[ ! -s "$tmp_secret" && ! -s "$tmp_config" ]]; then
  echo "No environment variables parsed from: $ENV_FILE" >&2
  exit 1
fi

if [[ -s "$tmp_secret" ]]; then
  kubectl -n "$NAMESPACE" create secret generic \
    "${SECRET_NAME_PREFIX}-secrets-${ENVIRONMENT}" \
    --from-env-file="$tmp_secret" \
    --dry-run=client -o yaml | kubectl -n "$NAMESPACE" apply -f -
fi

if [[ -s "$tmp_config" ]]; then
  kubectl -n "$NAMESPACE" create configmap \
    "${SECRET_NAME_PREFIX}-config-${ENVIRONMENT}" \
    --from-env-file="$tmp_config" \
    --dry-run=client -o yaml | kubectl -n "$NAMESPACE" apply -f -
fi

echo "Synced environment '$ENVIRONMENT' from $ENV_FILE into namespace '$NAMESPACE'."
