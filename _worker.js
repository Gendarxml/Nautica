#!/bin/bash

# Variabel dasar
DOMAIN="gendarxml.ariyell.web.id"
UUID=$(cat /proc/sys/kernel/random/uuid)
SS_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 16)
TROJAN_PASSWORD=$(tr -dc A-Za-z0-9 </dev/urandom | head -c 16)

# Fungsi untuk membuat konfigurasi per negara
create_config() {
    COUNTRY=$1
    COUNTRY_CODE=$2
    
    echo "Membuat konfigurasi untuk $COUNTRY (/$COUNTRY_CODE)"
    
    # Buat direktori jika belum ada
    mkdir -p "/etc/xray/config/$COUNTRY_CODE"
    
    # Konfigurasi VLESS WS
    cat > "/etc/xray/config/$COUNTRY_CODE/vless_ws.json" <<EOF
{
    "inbounds": [
        {
            "port": 443,
            "protocol": "vless",
            "settings": {
                "clients": [
                    {
                        "id": "$UUID",
                        "level": 0
                    }
                ],
                "decryption": "none"
            },
            "streamSettings": {
                "network": "ws",
                "security": "tls",
                "tlsSettings": {
                    "certificates": [
                        {
                            "certificateFile": "/etc/xray/xray.crt",
                            "keyFile": "/etc/xray/xray.key"
                        }
                    ]
                },
                "wsSettings": {
                    "path": "/$COUNTRY_CODE",
                    "headers": {
                        "Host": "$DOMAIN"
                    }
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
EOF

    # Konfigurasi VMess WS
    cat > "/etc/xray/config/$COUNTRY_CODE/vmess_ws.json" <<EOF
{
    "inbounds": [
        {
            "port": 443,
            "protocol": "vmess",
            "settings": {
                "clients": [
                    {
                        "id": "$UUID",
                        "alterId": 0
                    }
                ]
            },
            "streamSettings": {
                "network": "ws",
                "security": "tls",
                "tlsSettings": {
                    "certificates": [
                        {
                            "certificateFile": "/etc/xray/xray.crt",
                            "keyFile": "/etc/xray/xray.key"
                        }
                    ]
                },
                "wsSettings": {
                    "path": "/$COUNTRY_CODE-vmess",
                    "headers": {
                        "Host": "$DOMAIN"
                    }
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
EOF

    # Konfigurasi Trojan WS
    cat > "/etc/xray/config/$COUNTRY_CODE/trojan_ws.json" <<EOF
{
    "inbounds": [
        {
            "port": 443,
            "protocol": "trojan",
            "settings": {
                "clients": [
                    {
                        "password": "$TROJAN_PASSWORD"
                    }
                ]
            },
            "streamSettings": {
                "network": "ws",
                "security": "tls",
                "tlsSettings": {
                    "certificates": [
                        {
                            "certificateFile": "/etc/xray/xray.crt",
                            "keyFile": "/etc/xray/xray.key"
                        }
                    ]
                },
                "wsSettings": {
                    "path": "/$COUNTRY_CODE-trojan",
                    "headers": {
                        "Host": "$DOMAIN"
                    }
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
EOF

    # Konfigurasi Shadowsocks
    cat > "/etc/xray/config/$COUNTRY_CODE/shadowsocks.json" <<EOF
{
    "inbounds": [
        {
            "port": 443,
            "protocol": "shadowsocks",
            "settings": {
                "method": "aes-256-gcm",
                "password": "$SS_PASSWORD",
                "network": "tcp,udp"
            },
            "streamSettings": {
                "security": "tls",
                "tlsSettings": {
                    "certificates": [
                        {
                            "certificateFile": "/etc/xray/xray.crt",
                            "keyFile": "/etc/xray/xray.key"
                        }
                    ]
                }
            }
        }
    ],
    "outbounds": [
        {
            "protocol": "freedom",
            "settings": {}
        }
    ]
}
EOF

    # Buat file client config
    mkdir -p "/etc/xray/client_config/$COUNTRY_CODE"
    
    # Client config VLESS
    cat > "/etc/xray/client_config/$COUNTRY_CODE/vless_$COUNTRY_CODE.txt" <<EOF
=========================
VLESS WS Configuration ($COUNTRY)
=========================

Domain: $DOMAIN
Port: 443
ID: $UUID
Path: /$COUNTRY_CODE
Encryption: none
Transport: websocket
TLS: true

Link VLESS:
vless://$UUID@$DOMAIN:443?path=/$COUNTRY_CODE&security=tls&encryption=none&type=ws#$DOMAIN-$COUNTRY_CODE-VLESS
EOF

    # Client config VMess
    cat > "/etc/xray/client_config/$COUNTRY_CODE/vmess_$COUNTRY_CODE.txt" <<EOF
=========================
VMess WS Configuration ($COUNTRY)
=========================

Domain: $DOMAIN
Port: 443
ID: $UUID
AlterId: 0
Path: /$COUNTRY_CODE-vmess
Transport: websocket
TLS: true

Link VMess:
vmess://$(echo "{\"v\":\"2\",\"ps\":\"$DOMAIN-$COUNTRY_CODE-VMess\",\"add\":\"$DOMAIN\",\"port\":\"443\",\"id\":\"$UUID\",\"aid\":\"0\",\"scy\":\"auto\",\"net\":\"ws\",\"type\":\"none\",\"host\":\"$DOMAIN\",\"path\":\"/$COUNTRY_CODE-vmess\",\"tls\":\"tls\",\"sni\":\"$DOMAIN\"}" | base64 -w 0)
EOF

    # Client config Trojan
    cat > "/etc/xray/client_config/$COUNTRY_CODE/trojan_$COUNTRY_CODE.txt" <<EOF
=========================
Trojan WS Configuration ($COUNTRY)
=========================

Domain: $DOMAIN
Port: 443
Password: $TROJAN_PASSWORD
Path: /$COUNTRY_CODE-trojan
Transport: websocket
TLS: true

Link Trojan:
trojan://$TROJAN_PASSWORD@$DOMAIN:443?path=/$COUNTRY_CODE-trojan&security=tls&type=ws#$DOMAIN-$COUNTRY_CODE-Trojan
EOF

    # Client config Shadowsocks
    cat > "/etc/xray/client_config/$COUNTRY_CODE/ss_$COUNTRY_CODE.txt" <<EOF
=========================
Shadowsocks Configuration ($COUNTRY)
=========================

Domain: $DOMAIN
Port: 443
Password: $SS_PASSWORD
Method: aes-256-gcm
Plugin: v2ray-plugin
Plugin Options: tls;host=$DOMAIN

Link Shadowsocks:
ss://$(echo -n "aes-256-gcm:$SS_PASSWORD" | base64 -w 0)@$DOMAIN:443/?plugin=v2ray-plugin%3Bpath%3D%2F$COUNTRY_CODE-ss%3Bhost%3D$DOMAIN%3Btls#$DOMAIN-$COUNTRY_CODE-SS
EOF
}

# Buat konfigurasi untuk berbagai negara
create_config "Indonesia" "ID"
create_config "Singapore" "SG"
create_config "United States" "US"
create_config "Japan" "JP"
create_config "Germany" "DE"
create_config "United Kingdom" "UK"
create_config "Malaysia" "MY"
create_config "Thailand" "TH"
create_config "Vietnam" "VN"
create_config "India" "IN"

echo "Konfigurasi berhasil dibuat untuk domain $DOMAIN"
echo "File konfigurasi disimpan di /etc/xray/config/[kode_negara]"
echo "File konfigurasi client disimpan di /etc/xray/client_config/[kode_negara]"
