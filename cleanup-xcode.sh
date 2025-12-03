#!/bin/bash

echo "🧹 Xcode 용량 정리 시작..."
echo ""

# 용량 확인
echo "📊 현재 용량:"
echo "DerivedData: $(du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null | cut -f1)"
echo "Archives: $(du -sh ~/Library/Developer/Xcode/Archives 2>/dev/null | cut -f1)"
echo "iOS DeviceSupport: $(du -sh ~/Library/Developer/Xcode/iOS\ DeviceSupport 2>/dev/null | cut -f1)"
echo ""

read -p "DerivedData 삭제하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  DerivedData 삭제 중..."
    rm -rf ~/Library/Developer/Xcode/DerivedData/*
    echo "✅ 완료"
fi

read -p "iOS DeviceSupport 삭제하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  iOS DeviceSupport 삭제 중..."
    rm -rf ~/Library/Developer/Xcode/iOS\ DeviceSupport/*
    echo "✅ 완료"
fi

read -p "사용하지 않는 Simulator 삭제하시겠습니까? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "🗑️  Simulator 정리 중..."
    xcrun simctl delete unavailable
    echo "✅ 완료"
fi

echo ""
echo "📊 정리 후 용량:"
echo "DerivedData: $(du -sh ~/Library/Developer/Xcode/DerivedData 2>/dev/null | cut -f1)"
echo "Archives: $(du -sh ~/Library/Developer/Xcode/Archives 2>/dev/null | cut -f1)"
echo "iOS DeviceSupport: $(du -sh ~/Library/Developer/Xcode/iOS\ DeviceSupport 2>/dev/null | cut -f1)"
echo ""
echo "✨ 정리 완료!"
