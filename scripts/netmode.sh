#!/usr/bin/env bash
# WLAN 静态 IP / 自动获取(DHCP) 一键切换（需管理员权限运行）
# 静态地址与路由器的 MAC 绑定配套：固定后同 WiFi 同事可稳定访问 http://192.168.1.216:3005
# 用法：scripts/netmode.sh {static|dhcp|status}
set -euo pipefail

IFACE="WLAN"
IP="192.168.1.216"
MASK="255.255.255.0"
GW="192.168.1.1"
DNS="192.168.1.1"

require_admin() {
    if ! net session >/dev/null 2>&1; then
        echo "需要管理员权限：请以管理员身份打开终端后重试" >&2
        exit 1
    fi
}

static() {
    require_admin
    netsh interface ip set address name="$IFACE" source=static addr="$IP" mask="$MASK" gateway="$GW" gwmetric=0 >/dev/null
    # DNS 用 PowerShell 设置：netsh 的 set dns 在部分环境下会误报"服务器不正确或不存在"
    powershell -NoProfile -Command "Set-DnsClientServerAddress -InterfaceAlias '$IFACE' -ServerAddresses $DNS"
    echo "已切换为静态 IP：$IP/$MASK 网关 $GW DNS $DNS"
}

dhcp() {
    require_admin
    netsh interface ip set address name="$IFACE" source=dhcp >/dev/null
    powershell -NoProfile -Command "Set-DnsClientServerAddress -InterfaceAlias '$IFACE' -ResetServerAddresses"
    echo "已切回自动获取(DHCP)"
}

status() {
    # PowerShell 实现：netsh 输出为 GBK，在 git-bash 下乱码；接口名与 IFACE 保持一致
    powershell -NoProfile -Command '$c = Get-NetIPConfiguration -InterfaceAlias WLAN; $ip = $c.IPv4Address; $gw = $c.IPv4DefaultGateway.NextHop; $dns = ($c.DNSServer | Where-Object { $_.AddressFamily -eq 2 }).ServerAddresses -join ", "; $mode = if ((Get-NetIPAddress -InterfaceAlias WLAN -AddressFamily IPv4).PrefixOrigin -eq 1) { "static" } else { "dhcp" }; "IP: {0}/{1}  mode: {2}" -f $ip.IPAddress, $ip.PrefixLength, $mode; "GW: {0}   DNS: {1}" -f $gw, $dns'
}

case "${1:-status}" in
    static) static ;;
    dhcp) dhcp ;;
    status) status ;;
    *)
        echo "用法：$0 {static|dhcp|status}" >&2
        exit 1
        ;;
esac
