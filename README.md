#!/bin/bash
# 👑 МИСИЈА НА АЛЕКСАНДАР v5.0 — Smart Launcher

clear
echo ""
echo "==============================================="
echo "  👑 МИСИЈА НА АЛЕКСАНДАР v5.0"
echo "  Патот на Светлината"
echo "==============================================="
echo ""

cd "$(dirname "$0")"

PORT=8000

# Function to open URL in default browser
open_browser() {
    local url=$1
    sleep 1.5
    if command -v xdg-open &> /dev/null; then
        xdg-open "$url" &> /dev/null &
    elif command -v open &> /dev/null; then
        open "$url" &
    elif command -v start &> /dev/null; then
        start "$url" &
    fi
}

# Find available port if 8000 is taken
while nc -z localhost $PORT 2>/dev/null; do
    PORT=$((PORT + 1))
    if [ $PORT -gt 8010 ]; then
        echo "❌ Сите портови 8000-8010 се зафатени!"
        echo "   Затвори некој друг сервер и пробај пак."
        exit 1
    fi
done

URL="http://localhost:$PORT"

# === Try Python 3 ===
if command -v python3 &> /dev/null; then
    echo "✅ Python3 е најден!"
    echo ""
    echo "==============================================="
    echo "  ИГРАТА Е НА: $URL"
    echo "  За да ja затвориш: Ctrl+C"
    echo "==============================================="
    echo ""
    open_browser "$URL"
    python3 -m http.server $PORT
    exit 0
fi

# === Try Python 2 ===
if command -v python &> /dev/null; then
    echo "✅ Python е најден!"
    echo "  ИГРАТА Е НА: $URL"
    open_browser "$URL"
    python -m http.server $PORT
    exit 0
fi

# === Try Node.js ===
if command -v npx &> /dev/null; then
    echo "✅ Node.js е најден!"
    echo "  ИГРАТА Е НА: $URL"
    open_browser "$URL"
    npx --yes http-server -p $PORT
    exit 0
fi

# === Try PHP ===
if command -v php &> /dev/null; then
    echo "✅ PHP е најден!"
    echo "  ИГРАТА Е НА: $URL"
    open_browser "$URL"
    php -S "localhost:$PORT"
    exit 0
fi

# === Try Ruby ===
if command -v ruby &> /dev/null; then
    echo "✅ Ruby е најден!"
    echo "  ИГРАТА Е НА: $URL"
    open_browser "$URL"
    ruby -run -e httpd . -p $PORT
    exit 0
fi

# === Nothing found ===
echo ""
echo "==============================================="
echo "  ⚠️  ВНИМАНИЕ!"
echo "==============================================="
echo ""
echo "На твојот компјутер нема инсталирано:"
echo "  - Python"
echo "  - Node.js"
echo "  - PHP"
echo "  - Ruby"
echo ""
echo "РЕШЕНИЈА (избери едно):"
echo ""
echo "  1. Инсталирај Python:"
echo "     macOS:  brew install python3"
echo "     Linux:  sudo apt install python3"
echo ""
echo "  2. Качи ја играта на GitHub Pages (бесплатно)"
echo "     Прочитај README.md"
echo ""
echo "  3. Drag-and-drop на https://app.netlify.com/drop"
echo ""
echo "⚠️  НЕ ОТВАРАЈ ja index.html ДИРЕКТНО -"
echo "    browser-от блокира CDN-ите од file:// протокол!"
echo ""
read -p "Притисни Enter за крај..."
