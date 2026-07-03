#!/usr/bin/env bash
set -euo pipefail

echo "Bắt đầu khởi tạo môi trường local cho Cacao TLMS..."

if ! command -v docker >/dev/null 2>&1; then
  echo "Lỗi: Docker chưa được cài đặt hoặc không nằm trong PATH." >&2
  exit 1
fi

if ! command -v docker-compose >/dev/null 2>&1; then
  echo "Lỗi: docker-compose chưa được cài đặt hoặc không nằm trong PATH." >&2
  exit 1
fi

echo "Đang khởi động các dịch vụ container..."
docker-compose up -d

echo "Chờ PostgreSQL sẵn sàng..."
RETRY=0
until docker exec cacao-postgres pg_isready -U "${DB_USER:-cacao_admin}" >/dev/null 2>&1; do
  if [ "$RETRY" -ge 30 ]; then
    echo "Lỗi: PostgreSQL không sẵn sàng sau 30 lần thử." >&2
    exit 1
  fi
  RETRY=$((RETRY + 1))
  echo "Đang chờ PostgreSQL... ($RETRY/30)"
  sleep 2
  docker-compose up -d cacao-postgres >/dev/null 2>&1 || true

done

echo "PostgreSQL đã sẵn sàng. Thực thi Prisma migrate..."
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init

echo "Kết thúc Prisma migrate. Bắt đầu load model Ollama..."
cd ..
# Preload model and start a local Ollama session in the container.
docker exec cacao-ollama ollama pull deepseek-coder:6.7b >/dev/null 2>&1 || true
nohup docker exec cacao-ollama ollama run deepseek-coder:6.7b >/dev/null 2>&1 &

echo "Mô-đun Ollama đã được khởi chạy nội bộ."

echo "Cacao TLMS self-hosted khởi tạo hoàn tất."
