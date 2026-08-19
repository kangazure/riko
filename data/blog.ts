export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: "cybersecurity" | "networking" | "linux" | "tech";
  readingTime: string;
  featured?: boolean;
  content: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: "mengenal-nmap",
    title: "Mengenal Nmap: Network Mapper untuk Security Scanning",
    description:
      "Panduan awal memahami Nmap — dari basic scan sampai service detection — dan bagaimana tool ini digunakan dalam security assessment.",
    date: "2026-07-12",
    category: "cybersecurity",
    readingTime: "6 min",
    featured: true,
    content: `Nmap (Network Mapper) adalah tool open-source yang digunakan untuk network discovery dan security auditing. Buat yang baru masuk ke dunia cybersecurity, Nmap biasanya jadi salah satu tool pertama yang dipelajari.

## Kenapa Nmap?

Nmap membantu kita memahami apa yang ada di dalam sebuah network — host mana yang aktif, port apa yang terbuka, service apa yang berjalan, dan bahkan OS yang digunakan oleh target. Informasi ini jadi dasar sebelum melakukan security assessment lebih lanjut.

## Basic Scan

Perintah paling dasar:

\`\`\`bash
nmap 192.168.1.1
\`\`\`

Ini akan melakukan scan terhadap 1000 port paling umum di host tersebut. Output-nya akan menunjukkan port yang terbuka beserta service yang berjalan.

## Scan Types

Ada beberapa jenis scan yang umum digunakan:

- **TCP SYN Scan (-sS)** — Default scan, cepat dan relatif stealth karena tidak menyelesaikan three-way handshake.
- **TCP Connect Scan (-sT)** — Melakukan full connection, lebih mudah terdeteksi.
- **UDP Scan (-sU)** — Untuk men-scan port UDP, biasanya lebih lambat.
- **Service Detection (-sV)** — Mendeteksi versi service yang berjalan di port terbuka.
- **OS Detection (-O)** — Mencoba mengidentifikasi operating system target.

## Contoh Penggunaan

\`\`\`bash
# Quick scan
nmap -F 192.168.1.0/24

# Service + OS detection
nmap -sV -O 192.168.1.1

# Full port scan
nmap -p- 192.168.1.1

# Script scan
nmap --script=vuln 192.168.1.1
\`\`\`

## Hal yang Perlu Diingat

Nmap hanya boleh digunakan pada sistem yang kamu punya izin untuk men-scan. Scanning tanpa izin bisa dianggap sebagai aktivitas ilegal di banyak negara. Selalu pastikan kamu bekerja di environment yang sah (lab sendiri, CTF, atau sistem yang kamu punya otorisasi tertulis).`,
  },
  {
    slug: "dasar-web-security",
    title: "Dasar-Dasar Web Security: OWASP Top 10",
    description:
      "Pengenalan OWASP Top 10 — kategori kerentanan web paling kritis dan bagaimana cara mitigasinya.",
    date: "2026-06-28",
    category: "cybersecurity",
    readingTime: "8 min",
    featured: true,
    content: `OWASP (Open Web Application Security Project) merilis daftar Top 10 kerentanan web security paling kritis setiap beberapa tahun. Daftar ini jadi acuan standar buat developer dan security practitioner.

## Kenapa OWASP Top 10 Penting?

Karena daftar ini merangkum kerentanan yang paling sering ditemukan dan paling berdampak di aplikasi web. Memahami setiap kategori membantu kita membangun aplikasi yang lebih aman dari awal.

## Kategori-Kategori Utama

### 1. Broken Access Control
User bisa mengakses data atau fitur yang seharusnya tidak bisa mereka akses. Contoh: user biasa bisa melihat data admin hanya dengan mengubah ID di URL.

### 2. Cryptographic Failures
Data sensitif tidak dienkripsi dengan benar — baik saat transit (no HTTPS) maupun saat disimpan (password di-plaintext).

### 3. Injection
Attacker mengirimkan data berbahaya ke interpreter. SQL injection adalah contoh paling umum: memasukkan query SQL lewat input form.

### 4. Insecure Design
Aplikasi didesain tanpa mempertimbangkan security dari awal. Ini bukan bug, tapi cacat desain.

### 5. Security Misconfiguration
Server, database, atau framework tidak dikonfigurasi dengan aman. Default credentials, error messages yang terlalu verbose, unnecessary features yang tetap aktif.

### 6. Vulnerable Components
Menggunakan library atau dependency yang sudah diketahui memiliki kerentanan tanpa di-update.

### 7. Authentication Failures
Mekanisme login yang lemah — password bisa di-brute-force, session token bisa ditebak, tidak ada rate limiting.

### 8. Software and Data Integrity Failures
Pipeline CI/CD tidak aman, dependency bisa di-supply-chain-attack, update otomatis tanpa verifikasi.

### 9. Logging and Monitoring Failures
Tidak ada logging yang memadai untuk mendeteksi dan merespons serangan yang sedang berlangsung.

### 10. SSRF (Server-Side Request Forgery)
Server bisa dipaksa membuat request ke URL yang dikontrol attacker, membuka akses ke internal network.

## Mulai dari Mana?

Kalau baru mulai, fokus ke OWASP Juice Shop (aplikasi web yang sengaja dibuat vulnerable untuk latihan) dan pelajari setiap kategori sambil praktek.`,
  },
  {
    slug: "dasar-vlan",
    title: "Dasar VLAN: Virtual LAN dan Segmentasi Jaringan",
    description:
      "Memahami konsep VLAN, cara kerjanya, dan bagaimana VLAN digunakan untuk segmentasi jaringan.",
    date: "2026-06-15",
    category: "networking",
    readingTime: "5 min",
    content: `VLAN (Virtual Local Area Network) adalah teknologi yang memungkinkan kita membagi satu physical switch menjadi beberapa logical network yang terpisah.

## Konsep Dasar

Tanpa VLAN, semua device yang terhubung ke switch yang sama berada dalam satu broadcast domain. Artinya, broadcast dari satu device akan diterima oleh semua device lain — ini tidak efisien dan kurang aman.

Dengan VLAN, kita bisa mengelompokkan port-port switch ke dalam group yang berbeda. Device di VLAN 10 tidak bisa berkomunikasi langsung dengan device di VLAN 20, meskipun mereka terhubung ke switch yang sama.

## Kenapa Perlu VLAN?

1. **Keamanan** — Pisahkan traffic departemen yang berbeda (Finance vs Engineering)
2. **Performansi** — Kurangi broadcast domain yang terlalu besar
3. **Manajemen** — Struktur jaringan lebih fleksibel, tidak terikat lokasi fisik

## Cara Kerja

VLAN bekerja di Layer 2. Setiap frame Ethernet diberi tag VLAN (802.1Q) yang mengidentifikasi VLAN mana frame tersebut berasal. Switch menggunakan tag ini untuk memastikan frame hanya dikirim ke port yang ada di VLAN yang sama.

## Konfigurasi Dasar di MikroTik

\`\`\`
/interface vlan add name=vlan10 vlan-id=10 interface=ether1
/interface vlan add name=vlan20 vlan-id=20 interface=ether1
\`\`\`

Untuk routing antar VLAN, kamu butuh router (Layer 3) — ini disebut inter-VLAN routing.

VLAN adalah fondasi dari hampir semua desain jaringan modern. Bahkan di network kecil sekalipun, segmentasi VLAN bisa bikin manajemen network lebih rapi.`,
  },
  {
    slug: "linux-untuk-security",
    title: "Linux untuk Cybersecurity: Setup dan Tools Dasar",
    description:
      "Kenapa Linux jadi OS pilihan di dunia cybersecurity dan tools apa saja yang perlu kamu kenali.",
    date: "2026-05-22",
    category: "linux",
    readingTime: "7 min",
    content: `Linux adalah operating system yang mendominasi dunia cybersecurity — dari penetration testing, forensics, sampai server security. Artikel ini membahas kenapa Linux jadi pilihan utama dan tools dasar yang perlu kamu kenali.

## Kenapa Linux?

1. **Open Source** — Kamu bisa melihat, memodifikasi, dan memahami setiap bagian dari sistem.
2. **Control** — Linux memberi kontrol penuh atas networking stack, filesystem, dan kernel parameters.
3. **Tooling** — Mayoritas security tools dibuat untuk Linux first (atau Linux-only).
4. **Customizability** — Bisa di-strip down untuk jadi dedicated security appliance.

## Distro untuk Cybersecurity

- **Kali Linux** — Standard untuk penetration testing, pre-loaded dengan ratusan tools.
- **Parrot OS** — Alternatif Kali, lebih ringan, fokus ke privacy juga.
- **Ubuntu / Debian** — Buat daily driver, bisa di-install tools security secara manual.

## Tools Dasar yang Perlu Dikenal

### Network
- **Nmap** — Network scanning dan discovery
- **Wireshark** — Packet analysis
- **tcpdump** — Command-line packet capture
- **netcat** — Swiss army knife networking

### Web
- **Burp Suite** — Web application security testing
- **SQLmap** — SQL injection automation
- **dirb / gobuster** — Directory enumeration
- **ffuf** — Fast web fuzzer

### Exploitation
- **Metasploit** — Exploitation framework
- **searchsploit** — Exploit database search
- **John the Ripper / Hashcat** — Password cracking

## Setup Awal

Setelah install Kali (atau distro lain), hal pertama yang biasanya dilakukan:

\`\`\`bash
# Update semua package
sudo apt update && sudo apt upgrade -y

# Install tools tambahan
sudo apt install seclists wordlists dirb gobuster ffuf

# Setup terminal multiplexer
sudo apt install tmux
\`\`\`

Linux bukan sekadar OS buat cybersecurity — ini adalah skill fundamental. Semakin dalam kamu paham Linux, semakin efektif kamu sebagai security practitioner.`,
  },
  {
    slug: "mengenal-mikrotik",
    title: "Mengenal MikroTik: RouterOS untuk Network Management",
    description:
      "Pengenalan MikroTik RouterOS — sistem operasi router yang powerful untuk manajemen jaringan.",
    date: "2026-05-08",
    category: "networking",
    readingTime: "5 min",
    content: `MikroTik adalah perusahaan asal Latvia yang membuat perangkat keras dan perangkat lunak untuk jaringan. Produk utama mereka adalah RouterOS — sistem operasi berbasis Linux yang bisa mengubah PC biasa atau dedicated hardware menjadi router yang powerful.

## Kenapa MikroTik Populer?

MikroTik populer di kalangan ISP kecil-menengah, network administrator, dan bahkan home-lab enthusiast karena harganya yang terjangkau dengan fitur yang sangat lengkap.

## Fitur Utama RouterOS

1. **Routing** — Static, OSPF, BGP, MPLS
2. **Firewall & NAT** — Filter rules yang sangat granular
3. **VPN** — PPTP, L2TP, SSTP, OpenVPN, WireGuard
4. **QoS / Queue** — Bandwidth management, traffic shaping
5. **Hotspot** — Captive portal untuk public WiFi
6. **DHCP, DNS, NTP** — Network services built-in
7. **Wireless** — AP, bridge, WDS

## Cara Akses

Ada beberapa cara untuk mengakses dan mengelola RouterOS:

- **WinBox** — GUI tool resmi (Windows, bisa jalan via Wine di Linux)
- **WebFig** — Web interface
- **SSH** — CLI access
- **API** — Untuk automation dan integrasi

## Konfigurasi Dasar

\`\`\`
# Set identity
/system identity set name=MyRouter

# Set IP di interface
/ip address add address=192.168.1.1/24 interface=ether1

# Tambah NAT masquerade
/ip firewall nat add chain=srcnat out-interface=ether1 action=masquerade

# Set DNS
/ip dns set servers=8.8.8.8,1.1.1.1

# DHCP server
/ip dhcp-server setup
\`\`\`

WinBox memudahkan kalau kamu belum familiar dengan CLI. Tapi lama-lama, CLI lebih cepat dan powerful.

## Best Practices

- **Backup konfigurasi** sebelum melakukan perubahan besar
- **Update RouterOS** secara berkala
- **Amankan access** — ganti default user, gunakan SSH key
- **Logging** — monitor traffic dan event penting
- **Firewall rules** — jangan cuma mengandalkan NAT

MikroTik bisa dipakai dari skala rumahan sampai ISP kelas menengah. Yang bikin beda adalah seberapa dalam kamu memahami fitur-fiturnya.`,
  },
  {
    slug: "dasar-pppoe",
    title: "Dasar PPPoE: Point-to-Point Protocol over Ethernet",
    description:
      "Memahami PPPoE, protokol yang banyak digunakan ISP untuk autentikasi dan manajemen pelanggan.",
    date: "2026-04-20",
    category: "networking",
    readingTime: "4 min",
    content: `PPPoE (Point-to-Point Protocol over Ethernet) adalah protokol yang menggabungkan PPP (Point-to-Point Protocol) dengan Ethernet. PPPoE banyak digunakan oleh ISP untuk mengelola koneksi pelanggan — dari autentikasi sampai billing.

## Cara Kerja

PPPoE bekerja dengan membuat "session" PPP di atas jaringan Ethernet. Prosesnya:

1. **Discovery Stage** — Client mencari server PPPoE (Active Discovery Initiation / PADI)
2. **Offer** — Server merespons (PADO)
3. **Request** — Client memilih server dan request session (PADR)
4. **Confirmation** — Server konfirmasi session (PADS)
5. **Session Stage** — PPP negotiation (LCP, authentication, NCP)
6. **Data Transfer** — Data mulai mengalir

## Kenapa ISP Pakai PPPoE?

1. **Authentication** — Setiap user punya username dan password
2. **Accounting** — Bisa track usage per-user
3. **IP Assignment** — Dynamic IP assignment via IPCP
4. **Session Control** — ISP bisa terminate session kapan saja

## Konfigurasi di MikroTik

**Server side:**
\`\`\`
/interface pppoe-server server add service-name=pppoe interface=ether1
/ppp secret add name=user1 password=pass123 service=pppoe
\`\`\`

**Client side:**
\`\`\`
/interface pppoe-client add name=pppoe-out interface=ether1 user=user1 password=pass123
\`\`\`

## Kelebihan dan Kekurangan

Kelebihan:
- Authentication built-in
- Accounting built-in
- Support di hampir semua perangkat

Kekurangan:
- Overhead packet (8 byte PPPoE header)
- MTU lebih kecil (1492 vs 1500)
- Tidak se-simple DHCP

PPPoE mungkin udah termasuk teknologi lama, tapi masih jadi backbone banyak ISP di Indonesia. Paham cara kerjanya penting banget buat yang terjun ke networking.`,
  },
];
