#!/bin/bash
code .
osascript -e 'tell application "Terminal" to do script "cd ~/backtesting/backtesting-backend; pnpm start:dev"'
cd ./backtesting-frontend
pnpm run dev  --port 3001