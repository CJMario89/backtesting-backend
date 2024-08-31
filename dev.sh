#!/bin/bash
code .
gnome-terminal --working-directory="/home/cjmario/bitcoin-backtesting/backtesting-backend" -- pnpm start:dev
cd ./backtesting-frontend
pnpm run dev  --port 3001
